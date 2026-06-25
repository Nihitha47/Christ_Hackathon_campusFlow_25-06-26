import type { ReactNode } from "react";
import { SiteShell } from "../../components/layout/site-shell";

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <SiteShell>{children}</SiteShell>;
}