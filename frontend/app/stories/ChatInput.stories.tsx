import React from "react";
import { ChatInput } from "@/components/chat/ChatInput";

type AnyComponent = React.ComponentType<any>;
type Meta<T extends AnyComponent> = { title: string; component: T };
type Story<T extends AnyComponent> = { args?: Partial<React.ComponentProps<T>> };

const meta: Meta<typeof ChatInput> = {
  title: "Components/ChatInput",
  component: ChatInput,
};

export default meta;

export const Default: Story<typeof ChatInput> = {
  args: { onSend: () => {} },
};

export const Disabled: Story<typeof ChatInput> = {
  args: { onSend: () => {}, disabled: true },
};
