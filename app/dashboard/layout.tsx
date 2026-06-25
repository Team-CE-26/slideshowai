import Link from "next/link";
import { Logo } from "@/components/landing/Logo";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar (sidebar is hidden below lg) */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
          <Logo />
          <Link
            href="/dashboard"
            className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground"
          >
            + Create
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
