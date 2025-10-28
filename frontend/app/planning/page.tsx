"use client";
import React, { useState } from "react";

export default function PlanningPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/api/planning", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">🧭 Planning Agent</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border rounded"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your project idea..."
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Run Agent
        </button>
      </form>
      {response && (
        <div className="p-4 border rounded bg-gray-50">
          <h2 className="font-semibold">Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
