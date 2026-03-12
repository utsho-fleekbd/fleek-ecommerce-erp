import { useState, ReactNode } from "react";

import { TopNav } from "./TopNav";
import { AppSidebar } from "./AppSidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onMobileMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">{children}</main>
      </div>
    </div>
  );
}
