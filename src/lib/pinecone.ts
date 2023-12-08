import { Pinecone, PineconeRecord, utils } from "@pinecone-database/pinecone";
import { downloadFile } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "./utils";

export const getPineconeClient = () => {
  return new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type pdfPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecome(fileKey: string) {
  // 1. obtain the pdf -> downlaod and read from pdf
  console.log("downloading s3 into file system");
  const file_name = await downloadFile(fileKey);
  if (!file_name) {
    throw new Error("could not download from s3");
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as pdfPage[];

  // 2. split and segment the pdf
  const documents = await Promise.all(pages.map(prepareDoc));

  // 3. vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(vectoriseAndEmbedDocs));

  // 4. upload to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("chatpdf");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  console.log("inserting vectors into pinecone");
  await namespace.upsert(vectors);

  return documents[0];
}

async function vectoriseAndEmbedDocs(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    throw new Error("Could not vectorise and embed docs");
  }
}

export const truncateStringByBytes = (str: string, numBytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, numBytes));
};

async function prepareDoc(page: pdfPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}
