"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

interface JobApplication {
  id: number;
  title: string;
  board: string;
}

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();

  const [applications, setApplications] = useState<JobApplication[]>([]);

  // Profile form state
  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    experience: "",
    currentSalary: "",
    expectedSalary: "",
    noticePeriod: "",
    preferredLocations: "",
    experienceSummary: "",
    education: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/applications");
        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err) {
        console.error("Failed to fetch job applications", err);
      }
    };

    fetchApplications();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return alert("Please upload a resume");

    const payload = new FormData();
    payload.append("resume", resumeFile);

    for (const key in formData) {
      payload.append(key, formData[key as keyof typeof formData]);
    }

    try {
      const res = await fetch("https://r2-worker.vibhav-contact.workers.dev", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Upload failed: " + err.error);
        return;
      }

      alert("Resume and details uploaded successfully");
      setFormData({
        jobTitle: "",
        location: "",
        experience: "",
        currentSalary: "",
        expectedSalary: "",
        noticePeriod: "",
        preferredLocations: "",
        experienceSummary: "",
        education: "",
      });
      setResumeFile(null);
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    }
  };

  if (status === "loading") return null;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar Form */}
      <section className="md:col-span-1 space-y-4 bg-gray-900 p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Profile & Resume</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label>Resume (PDF)</Label>
            <Input type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
          </div>

          {[
            { label: "Job Title", name: "jobTitle" },
            { label: "Location", name: "location" },
            { label: "Experience (years)", name: "experience", type: "number" },
            { label: "Current Salary (USD)", name: "currentSalary", type: "number" },
            { label: "Expected Salary (USD)", name: "expectedSalary", type: "number" },
            { label: "Notice Period (days)", name: "noticePeriod", type: "number" },
            { label: "Preferred Locations", name: "preferredLocations" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <Label>{label}</Label>
              <Input
                name={name}
                type={type || "text"}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div>
            <Label>Experience Summary</Label>
            <textarea
              name="experienceSummary"
              value={formData.experienceSummary}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2"
              rows={3}
            />
          </div>
          <div>
            <Label>Educational Qualifications</Label>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2"
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full bg-gray-700 hover:bg-gray-600">
            <UploadCloud className="w-4 h-4 mr-2" /> Save & Upload
          </Button>
        </form>
      </section>

      {/* Applications List */}
      <section className="md:col-span-3 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-2">Your Job Applications</h2>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
            Logout
          </Button>
        </div>
        <div className="grid gap-4 max-h-[75vh] overflow-y-auto pr-2">
          {applications.length > 0 ? (
            applications.map((app) => (
              <Card key={app.id} className="bg-gray-900">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{app.title}</h3>
                      <p className="text-sm text-gray-400">{app.board}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-400">No applications found.</p>
          )}
        </div>
      </section>
    </main>
  );
}