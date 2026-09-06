"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, Settings, Columns3, Menu } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { Brand } from "@/components/brand";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/deals/new", label: "New deal", icon: Plus },
  { href: "/deals", label: "Pipeline", icon: Columns3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: ReactNode;
}) {
  return (
    <div className="min-h-full bg-[var(--app-canvas)]">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="px-4 py-5">
          <Link href="/dashboard">
            <Brand inverted />
          </Link>
        </div>
        <NavList />
        <UserBlock user={user} />
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-[var(--app-canvas)]/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/dashboard">
            <Brand />
          </Link>
          <Sheet>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
              aria-label="Open menu"
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="bg-sidebar p-0 text-sidebar-foreground">
              <div className="px-4 py-5">
                <Brand inverted />
              </div>
              <NavList />
              <UserBlock user={user} />
            </SheetContent>
          </Sheet>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavList() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV.map((item) => {
        const active =
          item.href === "/deals"
            ? pathname === "/deals" || (pathname.startsWith("/deals/") && pathname !== "/deals/new")
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserBlock({ user }: { user: { name: string; email: string } }) {
  return (
    <div className="mt-auto border-t border-sidebar-border p-4">
      <p className="truncate text-sm font-medium">{user.name}</p>
      <p className="truncate text-xs text-sidebar-foreground/60">{user.email}</p>
      <form action={logoutAction} className="mt-3">
        <Button type="submit" variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground">
          Sign out
        </Button>
      </form>
    </div>
  );
}
