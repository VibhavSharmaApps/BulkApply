import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    if (email && password) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } else {
    res.status(405).end();
  }
}