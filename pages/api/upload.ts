import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Error parsing form" });

    // Safely access the resume file from the parsed form
      const resumeField = files.resume;

      if (!resumeField) {
        return res.status(400).json({ error: "Resume file is required" });
      }

      const file = Array.isArray(resumeField) ? resumeField[0] : resumeField as File;

      if (!file || !file.filepath) {
        return res.status(400).json({ error: "Invalid resume file" });
      }


    if (!file) return res.status(400).json({ error: "Resume file is required" });

    try {
      const fileStream = fs.createReadStream(file.filepath);
      const buffer = await streamToBuffer(fileStream);

      const uploadResponse = await fetch("https://<your-worker-subdomain>.workers.dev/upload", {
        method: "POST",
        headers: {
          "Content-Type": file.mimetype || "application/pdf",
          "X-Filename": file.originalFilename || "resume.pdf",
        },
        body: buffer,
      });

      if (!uploadResponse.ok) {
        const errMsg = await uploadResponse.text();
        return res.status(500).json({ error: `Upload to Worker failed: ${errMsg}` });
      }

      const result = await uploadResponse.json();
      return res.status(200).json({ success: true, fileUrl: result.fileUrl });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error uploading to R2" });
    }
  });
}

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}