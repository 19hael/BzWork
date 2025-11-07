"use client";

import { Toaster } from "react-hot-toast";
import { WorkspaceHydrator } from "@/components/providers/WorkspaceHydrator";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WorkspaceHydrator />
      {children}
      <Toaster position="top-right" />
    </>
  );
}
