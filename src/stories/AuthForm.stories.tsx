import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";

type AnyComponent = React.ComponentType<any>;
type Meta<T extends AnyComponent> = { title: string; component: T };
type Story<T extends AnyComponent> = { args?: Partial<React.ComponentProps<T>> };

const meta: Meta<typeof AuthForm> = {
  title: "Components/AuthForm",
  component: AuthForm,
};

export default meta;

export const SignIn: Story<typeof AuthForm> = {
  args: { mode: "signin", loading: false, onSubmit: async () => {} },
};

export const SignUp: Story<typeof AuthForm> = {
  args: { mode: "signup", loading: false, onSubmit: async () => {} },
};

export const Loading: Story<typeof AuthForm> = {
  args: { mode: "signin", loading: true, onSubmit: async () => {} },
};
