"use client";

import { useActionState, type ReactNode } from "react";
import Link from "next/link";
import { loginAction, signupAction, type AuthState } from "@/app/actions/auth";
import { Brand } from "@/components/brand";
import { Field } from "@/components/field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function LoginForm({ nextPath = "/dashboard" }: { nextPath?: string }) {
  const [state, action, pending] = useActionState(loginAction, null as AuthState);
  return (
    <AuthCard
      title="Sign in to FlipBridge"
      subtitle="Use the demo account or your own seller login."
    >
      <form action={action} className="grid gap-4">
        <input type="hidden" name="next" value={nextPath} />
        <DemoHint />
        <Field label="Email">
          <Input name="email" type="email" autoComplete="email" defaultValue="demo@flipbridge.app" required />
        </Field>
        <Field label="Password">
          <Input name="password" type="password" autoComplete="current-password" defaultValue="demo1234" required />
        </Field>
        {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
        <Button type="submit" disabled={pending} size="lg">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, null as AuthState);
  return (
    <AuthCard title="Create your workspace" subtitle="Start with a calculator and an empty pipeline.">
      <form action={action} className="grid gap-4">
        <Field label="Name">
          <Input name="name" autoComplete="name" required placeholder="Alex Rivera" />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Password">
          <Input name="password" type="password" autoComplete="new-password" required minLength={8} />
        </Field>
        {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
        <Button type="submit" disabled={pending} size="lg">
          {pending ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}

function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-[var(--app-canvas)]">
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/">
          <Brand />
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
          Back to site
        </Link>
      </header>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-16">
        <h1 className="font-heading text-3xl tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">{children}</div>
      </div>
    </div>
  );
}

function DemoHint() {
  return (
    <div className="rounded-xl bg-muted/80 px-3 py-2.5 text-sm">
      <p className="font-medium">Demo seller</p>
      <p className="text-muted-foreground">
        demo@flipbridge.app · demo1234 — pipeline already loaded.
      </p>
    </div>
  );
}
