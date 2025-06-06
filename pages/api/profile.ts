import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userEmail = session.user.email;

  if (req.method === "GET") {
    try {
      // Include userProfile to fetch profile details
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { userProfile: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ profile: user.userProfile || null });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        jobTitle,
        location,
        experience,
        currentSalary,
        expectedSalary,
        noticePeriod,
        preferredLocations,
        experienceSummary,
        education,
        resumeUrl,
      } = req.body;

      // Upsert profile (create if not exists, update if exists)
      const updatedProfile = await prisma.userProfile.upsert({
        where: { userId: userEmail }, // <-- IMPORTANT: this should be userId (user.id), fix below
        create: {
          userId: userEmail, // this should be userId, not email
          jobTitle,
          location,
          experience,
          currentSalary,
          expectedSalary,
          noticePeriod,
          preferredLocations,
          experienceSummary,
          education,
          resumeUrl,
        },
        update: {
          jobTitle,
          location,
          experience,
          currentSalary,
          expectedSalary,
          noticePeriod,
          preferredLocations,
          experienceSummary,
          education,
          resumeUrl,
        },
      });

      res.status(200).json({ profile: updatedProfile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}