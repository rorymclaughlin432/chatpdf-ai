// /api/create-chat

import { loadS3IntoPinecome } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log(file_key, file_name);
    const pineconefPdf = await loadS3IntoPinecome(file_key);
    return NextResponse.json({ pineconefPdf });

  } catch (err) {
    console.log(err);
    return NextResponse.json(
        { error: "Something went wrong" }, 
        { status: 500 }
        );
  }
}
