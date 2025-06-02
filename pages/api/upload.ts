// pages/api/upload.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Dummy user for testing
const DUMMY_USER_ID = 'your-test-user-id'; // Replace with a real one after signup/login flow

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Failed to parse form data' });

    const { jobTitle, location, experience } = fields;
    const fileField = files.resume;
    const file = Array.isArray(fileField) ? fileField[0] : fileField;

    if (!file || !jobTitle || !location || !experience) {
    return res.status(400).json({ error: 'Missing required fields or file' });
    }


    // Simulate uploading to Cloudflare — you can replace this later
    const uploadedUrl = `https://fake-cdn.cloudflare.com/uploads/${uuidv4()}.pdf`;

    try {
      const resume = await prisma.resume.create({
        data: {
          userId: DUMMY_USER_ID,
          jobTitle: String(jobTitle),
          location: String(location),
          experience: Number(experience),
          resumeUrl: uploadedUrl,
        },
      });

      res.status(200).json({ message: 'Resume uploaded successfully', resume });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save resume to DB' });
    }
  });
}