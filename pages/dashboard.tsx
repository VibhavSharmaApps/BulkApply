// pages/dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [applications, setApplications] = useState<any[]>([]);

  const [currentSalary, setCurrentSalary] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [preferredLocations, setPreferredLocations] = useState("");
  const [experienceSummary, setExperienceSummary] = useState("");
  const [education, setEducation] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) return alert("Please upload a resume");

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobTitle", jobTitle);
    formData.append("location", location);
    formData.append("experience", experience);
    formData.append("currentSalary", currentSalary);
    formData.append("expectedSalary", expectedSalary);
    formData.append("noticePeriod", noticePeriod);
    formData.append("preferredLocations", preferredLocations);
    formData.append("experienceSummary", experienceSummary);
    formData.append("education", education);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Resume and details uploaded successfully");
        setJobTitle("");
        setLocation("");
        setExperience("");
        setResume(null);
        setCurrentSalary("");
        setExpectedSalary("");
        setNoticePeriod("");
        setPreferredLocations("");
        setExperienceSummary("");
        setEducation("");
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


  if (status === "loading") return null;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar for Preferences */}
      <section className="md:col-span-1 space-y-4 bg-gray-900 p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Profile & Resume</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label>Resume (PDF)</Label>
            <Input type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files?.[0] || null)} />
          </div>
          <div>
            <Label>Job Title Preference</Label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <Label>Experience (years)</Label>
            <Input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} />
          </div>
          <div>
            <Label>Current Salary (USD)</Label>
            <Input type="number" value={currentSalary} onChange={(e) => setCurrentSalary(e.target.value)} />
          </div>
          <div>
            <Label>Expected Salary (USD)</Label>
            <Input type="number" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} />
          </div>
          <div>
            <Label>Notice Period (days)</Label>
            <Input type="number" value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)} />
          </div>
          <div>
            <Label>Preferred Locations</Label>
            <Input type="text" value={preferredLocations} onChange={(e) => setPreferredLocations(e.target.value)} placeholder="e.g. Remote, New York, Berlin" />
          </div>
          <div>
            <Label>Experience Summary</Label>
            <textarea value={experienceSummary} onChange={(e) => setExperienceSummary(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2" rows={3} />
          </div>
          <div>
            <Label>Educational Qualifications</Label>
            <textarea value={education} onChange={(e) => setEducation(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2" rows={2} />
          </div>
          <Button type="submit" className="w-full bg-gray-700 hover:bg-gray-600">
            <UploadCloud className="w-4 h-4 mr-2" /> Save & Upload
          </Button>
        </form>
      </section>

      {/* Main Content for Job Applications */}
      <section className="md:col-span-3 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-2">Your Job Applications</h2>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>Logout</Button>
        </div>
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