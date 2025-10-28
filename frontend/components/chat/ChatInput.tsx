// src/components/chat/ChatInput.tsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSend(value);
        setValue("");
      }}
    >
      <Input
        aria-label="Message"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Describe your app..."
      />
      <Button type="submit" disabled={disabled}>
        Send
      </Button>
    </form>
  );
}
