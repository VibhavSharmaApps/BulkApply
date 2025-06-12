// lib/r2.ts - Utility to upload files to Cloudflare R2
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto", // required by R2
  endpoint: process.env.R2_ENDPOINT, // e.g., https://<account>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

export async function uploadToR2(fileBuffer: Buffer, fileName: string, mimeType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3.send(command);
  return `https://${process.env.R2_BUCKET}.${new URL(process.env.R2_ENDPOINT!).host}/${fileName}`;
}
