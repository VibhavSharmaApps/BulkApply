// pages/api/applications.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userEmail = session.user.email;
  const user = await prisma.user.findUnique({ where: { email: userEmail } });

  if (!user) return res.status(404).json({ error: "User not found" });

  if (req.method === "GET") {
    // Return all job applications for this user
    const applications = await prisma.jobApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ applications });
  }

  if (req.method === "POST") {
    const { title, board, company, location, status } = req.body;

    if (!title || !board) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const application = await prisma.jobApplication.create({
      data: {
        userId: user.id,
        title,
        board,
        company,
        location,
        status,
      },
    });

    return res.status(201).json({ message: "Application saved", application });
  }

  return res.status(405).json({ error: "Method not allowed" });
}