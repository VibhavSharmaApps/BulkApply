import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "/uploads");
  fs.mkdirSync(uploadDir, { recursive: true });

  // Create formidable form with options
  const form = formidable({
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Failed to parse form" });
    }

    // Extract fields from parsed form
    const {
      jobTitle,
      location,
      experience,
      currentSalary,
      expectedSalary,
      noticePeriod,
      preferredLocations,
      experienceSummary,
      education
    } = fields;

    // Files.resume can be File or array depending on multiple files - check accordingly
    // If your form sends one file only, files.resume should be a single object
    const resumeFile = files.resume;

    if (!resumeFile) {
      return res.status(400).json({ error: "Resume upload failed" });
    }

    // Depending on your form setup, resumeFile may be an array or single object
    // Normalize to single file object if array
    const resume = Array.isArray(resumeFile) ? resumeFile[0] : resumeFile;

    // Prepare your user profile data
    const userProfile = {
      jobTitle,
      location,
      experience,
      currentSalary,
      expectedSalary,
      noticePeriod,
      preferredLocations,
      experienceSummary,
      education,
      resumePath: resume.filepath,  // this should exist for saved file path
      uploadedAt: new Date(),
    };


    console.log("Saved profile:", userProfile);

    return res.status(200).json({ message: "Uploaded successfully" });
  });
}