import React from "react";
import DashboardSidebar from "@/components/dashboard/Sidebar";

type Meta<T> = { title: string; component: T };
type Story<T> = { render?: () => React.ReactNode };

const meta: Meta<typeof DashboardSidebar> = {
  title: "Components/DashboardSidebar",
  component: DashboardSidebar,
};

export default meta;

export const Default: Story<typeof DashboardSidebar> = {
  render: () => (
    <DashboardSidebar
      activeModule="build"
      activeSubmodule="modules"
      onSelectSubmodule={() => undefined}
      projectProgress={{
        build: 60,
        planning: 20,
        design: 40,
        integrate: 10,
        test: 0,
        deploy: 0,
        monitor: 0,
        collaborate: 0,
      }}
    />
  ),
};
