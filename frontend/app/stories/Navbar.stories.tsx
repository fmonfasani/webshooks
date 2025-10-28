import React from "react";
import Navbar from "@/components/layout/Navbar";

type Meta<T> = { title: string; component: T };
type Story<T> = { render?: () => React.ReactNode };

const meta: Meta<typeof Navbar> = {
  title: "Components/Navbar",
  component: Navbar,
};

export default meta;

export const Default: Story<typeof Navbar> = {
  render: () => <Navbar />,
};
