// frontend/app/planning/_components/ChatAgent.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, User, Bot } from "lucide-react";

interface Message {
  role: "user" | "agent";
  content: string;
}

export default function ChatAgent({ title, intro }: { title: string; intro: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", content: intro },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    // 🔹 Simulación temporal del agente
    await new Promise((r) => setTimeout(r, 1000));
    const fakeReply = `🤖 Analizando: "${newMessage.content}"... 
Aquí hay una versión inicial de tu idea estructurada para el proyecto.`;

    setMessages((prev) => [...prev, { role: "agent", content: fakeReply }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-3xl mx-auto w-full flex flex-col space-y-4 flex-grow">
        <h1 className="text-3xl font-bold">{title}</h1>

        <div className="flex flex-col space-y-3 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex-grow overflow-y-auto max-h-[70vh]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "agent" && <Bot className="text-blue-500" />}
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && <User className="text-gray-500" />}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start items-center gap-2">
              <Loader2 className="animate-spin text-blue-500" />
              <span className="text-gray-400 text-sm">El agente está pensando...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={sendMessage} className="flex gap-2 mt-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            placeholder="Escribe tu idea..."
          />
          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
