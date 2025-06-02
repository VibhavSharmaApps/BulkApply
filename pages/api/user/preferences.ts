import { IncomingForm } from 'formidable';
export const config = { api: { bodyParser: false } };
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'Error parsing form' });
      console.log('Preferences:', fields);
      res.status(200).json({ success: true });
    });
  } else {
    res.status(405).end();
  }
}