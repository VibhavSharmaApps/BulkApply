// components/UploadForm.tsx
import { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setStatus("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Add other metadata here if needed
    // formData.append("expectedSalary", "50000");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setStatus(data.success ? "Upload successful!" : "Upload failed.");
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="submit">Upload PDF</button>
      {status && <p>{status}</p>}
    </form>
  );
}