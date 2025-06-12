// pages/api/applications.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userEmail = session.user.email;

  // Get the user ID from Supabase
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", userEmail)
    .single();

  if (userError || !user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (req.method === "GET") {
    const { data: applications, error } = await supabase
      .from("job_applications")
      .select("id, title, board, company, location")
      .eq("user_id", user.id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ applications });
  }

  if (req.method === "POST") {
    const { title, board, company, location, status } = req.body;

    if (!title || !board) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase.from("job_applications").insert([
      {
        user_id: user.id,
        title,
        board,
        company,
        location,
      },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "Application saved", application: data?.[0] });
  }

  return res.status(405).json({ error: "Method not allowed" });
}