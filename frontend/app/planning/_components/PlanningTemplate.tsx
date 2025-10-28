// frontend/app/planning/_components/PlanningTemplate.tsx
"use client";
import React, { useState } from "react";
import { Loader2, Send } from "lucide-react";

export default function PlanningTemplate({ title, description }: { title: string; description: string; }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000)); // simulación de respuesta
    setResponse(`🧩 Agent "${title}" processó: "${input}"`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={5}
            placeholder="Escribe tu prompt o idea aquí..."
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18}/> : <Send className="mr-2" size={18}/>}
            {loading ? "Procesando..." : "Ejecutar agente"}
          </button>
        </form>

        {response && (
          <div className="p-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Respuesta del agente</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
