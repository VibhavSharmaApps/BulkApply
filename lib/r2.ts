// lib/r2.ts - Utility to upload files to Cloudflare R2
import AWS from 'aws-sdk';

// Setup S3 client with Cloudflare R2 credentials
const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  signatureVersion: 'v4',
});

// Upload a file buffer to R2 and return the URL
export const uploadToR2 = async (file: Buffer, filename: string, mimetype: string) => {
  const params = {
    Bucket: process.env.R2_BUCKET!,
    Key: filename,
    Body: file,
    ContentType: mimetype,
  };

  const data = await s3.upload(params).promise();
  return data.Location;
};