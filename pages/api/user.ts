import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
//import fs from "fs";

// Disable the default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Utility function to parse the incoming form using formidable
function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// Main API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);

    // Type-safe extraction of uploaded resume file
    const fileField = files.resume;
    const file: File | undefined = Array.isArray(fileField) ? fileField[0] : fileField;

    if (!file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    // Extract user data
    const name = fields.name?.toString() || "";
    const email = fields.email?.toString() || "";
    const jobTitle = fields.jobTitle?.toString() || "";
    const location = fields.location?.toString() || "";
    const experience = fields.experience?.toString() || "";

    // 🚀 Placeholder: Upload to Cloudflare or another storage provider
    const resumeURL = `/uploads/${file.originalFilename}`; // Replace with actual upload result

    // 📦 Save user data (stub - replace with database logic)
    console.log("Saving user:", { name, email, jobTitle, location, experience, resumeURL });

    return res.status(200).json({ message: "User data saved", resumeURL });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
