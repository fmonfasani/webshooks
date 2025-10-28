"use client";
import { ChatPanel } from "@/components/chat/ChatPanel";

export default function IdeaBoard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🧠 Idea Board</h1>
      <p className="text-gray-500 mb-6">
        Describe tu idea inicial y el agente la transformará en un proyecto estructurado.
      </p>
      <div className="max-w-3xl mx-auto">
        <ChatPanel messages={[]} state="empty" />
      </div>
    </div>
  );
}
