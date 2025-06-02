// pages/dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

export default function Dashboard() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [applications, setApplications] = useState<any[]>([]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) return alert("Please upload a resume");

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobTitle", jobTitle);
    formData.append("location", location);
    formData.append("experience", experience);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Resume uploaded successfully");
        setJobTitle("");
        setLocation("");
        setExperience("");
        setResume(null);
      } else {
        const err = await res.json();
        alert("Upload failed: " + err.error);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    }
  };

  useEffect(() => {
    // Placeholder: Fetch job applications
    setApplications([
      { id: 1, title: "Frontend Developer", board: "LinkedIn" },
      { id: 2, title: "Full Stack Engineer", board: "Indeed" },
    ]);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar for Preferences */}
      <section className="md:col-span-1 space-y-4 bg-gray-900 p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label>Resume (PDF)</Label>
            <Input type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files?.[0] || null)} />
          </div>
          <div>
            <Label>Job Title Preference</Label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="bg-gray-800 border-gray-700" />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-gray-800 border-gray-700" />
          </div>
          <div>
            <Label>Experience (years)</Label>
            <Input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <Button type="submit" className="w-full bg-gray-700 hover:bg-gray-600">
            <UploadCloud className="w-4 h-4 mr-2" /> Upload
          </Button>
        </form>
      </section>

      {/* Main Content for Job Applications */}
      <section className="md:col-span-3 space-y-4">
        <h2 className="text-2xl font-bold mb-2">Your Job Applications</h2>
        <div className="grid gap-4 max-h-[75vh] overflow-y-auto pr-2">
          {applications.map((app) => (
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
          ))}
        </div>
      </section>
    </main>
  );
}