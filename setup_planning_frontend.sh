#!/bin/bash
set -e

BASE_DIR="frontend/app/planning"

echo "🚀 Creating Planning frontend structure..."

mkdir -p $BASE_DIR/{idea-board,specification,architecture,tech-stack,roadmap}

# Template component
COMPONENT='
"use client";
import React, { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(`Simulación de agente ejecutando con input: ${input}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">__TITLE__</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border rounded"
          rows={4}
          placeholder="Describe aquí tu idea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ejecutar agente
        </button>
      </form>
      {response && (
        <div className="mt-6 border rounded p-4 bg-gray-50">
          <h2 className="font-semibold">Respuesta simulada:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
'

# Create each subpage
declare -A titles=(
  ["idea-board"]="🧠 Idea Board"
  ["specification"]="📋 Specification"
  ["architecture"]="🏗️ Architecture"
  ["tech-stack"]="⚙️ Tech Stack"
  ["roadmap"]="🗺️ Roadmap"
)

for dir in "${!titles[@]}"; do
  echo "$COMPONENT" | sed "s/__TITLE__/${titles[$dir]}/g" > "$BASE_DIR/$dir/page.tsx"
done

echo "✅ Planning frontend module created successfully."
