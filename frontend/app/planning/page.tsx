"use client";
import React, { useState } from "react";

export default function PlanningPage() {
  const [instruction, setInstruction] = useState("");
  const [response, setResponse] = useState(null);

  const generatePlan = async () => {
    const res = await fetch("/api/planning", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instruction }),
    });
    const data = await res.json();
    setResponse(data.plan);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-4">í·  Planning Agent</h1>
      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        className="w-full max-w-xl h-32 border rounded-lg p-4 mb-4"
        placeholder="Describe your SaaS idea..."
      />
      <button
        onClick={generatePlan}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Generate Plan
      </button>

      {response && (
        <pre className="mt-6 bg-gray-900 text-green-300 p-4 rounded-lg text-sm max-w-3xl overflow-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
