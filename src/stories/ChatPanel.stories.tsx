import React from "react";
import { ChatPanel } from "@/components/chat/ChatPanel";

type AnyComponent = React.ComponentType<any>;
type Meta<T extends AnyComponent> = { title: string; component: T };
type Story<T extends AnyComponent> = { args?: Partial<React.ComponentProps<T>> };

const meta: Meta<typeof ChatPanel> = {
  title: "Components/ChatPanel",
  component: ChatPanel,
};

export default meta;

export const Empty: Story<typeof ChatPanel> = {
  args: { messages: [], state: "empty" },
};

export const Loading: Story<typeof ChatPanel> = {
  args: { messages: [], state: "loading" },
};

export const Populated: Story<typeof ChatPanel> = {
  args: {
    state: "success",
    messages: [
      { id: "1", role: "user", content: "Hi", timestamp: new Date().toISOString() },
      { id: "2", role: "system", content: "Hello!", timestamp: new Date().toISOString() },
    ],
  },
};
