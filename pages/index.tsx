// pages/index.tsx
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      // Signup flow
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Auto-login after signup
        const signInRes = await signIn("credentials", {
          redirect: false,
          ...formData,
        });

        if (signInRes?.ok) router.push("/dashboard"); // adjust if needed
        else setError("Login after signup failed.");
      } else {
        const body = await res.json();
        setError(body?.message || "Signup failed.");
      }
    } else {
      // Login flow
      const res = await signIn("credentials", {
        ...formData,
        redirect: false,
      });

      if (res?.ok) router.push("/dashboard"); // adjust if needed
      else setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-semibold text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          {isSignup ? "Already have an account?" : "New user?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-500 underline"
          >
            {isSignup ? "Login here" : "Sign up here"}
          </button>
        </p>
      </form>
    </div>
  );
}