/* import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    const result = await response.json();
    return result.data[0].embedding;
  } catch (error) {
    console.log("open ai embedding api could not be called", error);
  }
} */

import OpenAI from "openai";

const openai1 = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function getEmbeddings(text: string) {
  try {
    const chatCompletion = await openai1.embeddings.create({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    const result = chatCompletion.data[0].embedding;
    return result;
  } catch (error) {
    console.log("open ai embedding api could not be called", error);
  }
}
