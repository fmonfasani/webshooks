import React from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";

type AnyComponent = React.ComponentType<any>;
type Meta<T extends AnyComponent> = { title: string; component: T };
type Story<T extends AnyComponent> = { args?: Partial<React.ComponentProps<T>> };

const meta: Meta<typeof MessageBubble> = {
  title: "Components/MessageBubble",
  component: MessageBubble,
};

export default meta;

export const User: Story<typeof MessageBubble> = {
  args: { role: "user", content: "Hello", timestamp: new Date().toISOString() },
};

export const System: Story<typeof MessageBubble> = {
  args: { role: "system", content: "Hi!", timestamp: new Date().toISOString() },
};
