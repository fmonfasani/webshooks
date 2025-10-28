
// src\app\builder\page.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChatMessage } from "@/types";
import { useChatStore } from "@/store/useChatStore";

export default function ChatBuilderPage() {

  const { messages, sending, send } = useChatStore();
  const [text, setText] = useState("");
  const [hydrated, setHydrated] = useState<ChatMessage[] | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const scrollWrapRef = useRef<HTMLDivElement | null>(null);

  // Typing indicator: ensure it shows for at least 12s
  const [typingHoldUntil, setTypingHoldUntil] = useState<number | null>(null);
  const nowRef = useRef<number>(Date.now());
  useEffect(() => {
    const id = setInterval(() => {
      nowRef.current = Date.now();
    }, 250);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (sending) {
      setTypingHoldUntil(Date.now() + 12_000);
    }
  }, [sending]);
  const showTyping = sending || (typingHoldUntil !== null && Date.now() < typingHoldUntil);

  // Load persisted messages once
  useEffect(() => {
    try {
      const raw = localStorage.getItem("chat_builder_messages");
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        setHydrated(parsed);
      }
    } catch {}
  }, []);

  // Persist on store changes
  useEffect(() => {
    try {
      localStorage.setItem("chat_builder_messages", JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto scroll to latest
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending, showTyping]);

  const displayMessages: ChatMessage[] = useMemo(() => {
    return messages.length > 0 ? messages : (hydrated ?? []);
  }, [messages, hydrated]);

  const quickActions = [
    "Create SaaS flow",
    "🧩 Add Auth Module",
    "💾 Connect Database",
    "🎨 Generate UI",
  ];
  const quickActionsClean = quickActions.map((v, i) => {
    if (i === 1) return "🧩 Add Auth Module";
    if (i === 2) return "💾 Connect Database";
    if (i === 3) return "🎨 Generate UI";
    return v;
  });

  async function handleSend() {
    const value = text.trim();
    if (!value) return;
    setText("");
    await send(value);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <div className="relative min-h-[70vh] flex flex-col">
      <div ref={scrollWrapRef} className="flex-1 overflow-y-auto pb-40 px-3 sm:px-4">
        <div className="mx-auto max-w-3xl py-6 space-y-4">
          {displayMessages.length === 0 && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              Start a conversation to build your SaaS.
            </div>
          )}

          {displayMessages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-[18px] shadow-sm px-4 py-2 text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-[#2563EB] to-[#1E40AF] text-white"
                    : "bg-[#F3F4F6] text-gray-900 dark:bg-[#1F2937] dark:text-gray-100"
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}

          {showTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-start"
            >
              <div className="inline-flex items-center gap-1 rounded-[18px] shadow-sm px-4 py-2 text-sm bg-[#F3F4F6] text-gray-900 dark:bg-[#1F2937] dark:text-gray-100">
                <motion.span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-gray-500"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0 }}
                />
                <motion.span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-gray-500"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 }}
                />
                <motion.span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-gray-500"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.4 }}
                />
              </div>
            </motion.div>
          )}

          <div ref={endRef} />
        </div>
      </div>

      {/* Sticky composer */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-black/5 dark:border-white/10 backdrop-blur-md bg-white/70 dark:bg-gray-900/50">
        <div className="mx-auto max-w-3xl px-3 sm:px-4 py-3">
          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 mb-2">
            {quickActionsClean.map((qa) => (
              <Button
                key={qa}
                type="button"
                variant="secondary"
                className="rounded-3xl text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={() => setText(qa)}
              >
                {qa}
              </Button>
            ))}
          </div>

          <div className="flex items-end gap-2">
            {/* Hidden input to satisfy typed import while keeping textarea UX */}
            <Input type="hidden" ariaLabel="helper" readOnly value="" />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={sending ? "Assistant is typing..." : "Type your message"}
              rows={1}
              className="flex-1 resize-none rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <Button
              type="button"
              onClick={() => void handleSend()}
              disabled={sending || text.trim().length === 0}
              className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
