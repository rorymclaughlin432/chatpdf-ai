import { GetObjectCommandOutput, S3 } from "@aws-sdk/client-s3";
import fs from "fs";
import AWS from "aws-sdk";
export async function downloadFile(file_key: string) {

  try {

    AWS.config.update({
      region: process.env.NEXT_PUBLIC_S3_REGION!,
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
    });
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      },
      region: process.env.NEXT_PUBLIC_S3_REGION!,
    });
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };
    const file = await s3.getObject(params).promise();
    const fileName = file_key.split("/")[1];
    fs.writeFileSync(fileName, file.Body as Buffer);
    return fileName;

  } catch (error) {
    console.log(error);
    return null;
  }
  
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-west-1.amazonaws.com/${file_key}`;
  return url;
}
