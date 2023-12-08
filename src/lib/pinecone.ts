import { Pinecone,  } from "@pinecone-database/pinecone";
import { downloadFile } from "./db/s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
        environment: process.env.PINECONE_ENVIRONMENT!,
        });
    }
  return pinecone;
};

export async function loadS3IntoPinecome(filekey : string) {
    //get PDF by downloading and reading file
    console.log("Loading file into pinecone");
    const fileName = await downloadFile(filekey);
    if (!fileName) {
        throw new Error("File not found");
    }
    const pdfLoader = new PDFLoader(fileName);
    const pdf = await pdfLoader.load();
    console.log("File downloaded to: ", fileName);
    return pdf;
}