// pages/api/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password" });

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser)
    return res.status(409).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return res.status(201).json({ message: "User created" });
}
