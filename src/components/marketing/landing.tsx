import Link from "next/link";
import { ArrowRight, Calculator, Columns3, Shield, ScanSearch } from "lucide-react";
import { Brand } from "@/components/brand";
import { LandingCalculator } from "@/components/marketing/landing-calculator";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingPage() {
  return (
    <div className="min-h-full bg-[var(--app-canvas)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Brand />
        <nav className="flex items-center gap-2">
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
            Sign in
          </Link>
          <Link href="/signup" className={cn(buttonVariants())}>
            Start free
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
            For eBay → Amazon sellers
          </p>
          <h1 className="font-heading mt-4 max-w-xl text-5xl leading-[1.05] tracking-tight sm:text-6xl">
            Know the real profit before you buy the lot.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            FlipBridge is an ops desk for online arbitrage. Paste an eBay listing, match the
            Amazon ASIN, and see referral fees, FBA, and ROI before you click Buy It Now.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>
              Open the calculator
              <ArrowRight />
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 px-4")}
            >
              View demo pipeline
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Demo login: demo@flipbridge.app / demo1234
          </p>
        </div>
        <LandingCalculator />
      </section>

      <section className="border-y border-border bg-card/60">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
          <Proof
            stat="15%"
            label="Typical Home & Kitchen referral — baked into every estimate"
          />
          <Proof stat="5 stages" label="Researching to Sold, without a second spreadsheet" />
          <Proof stat="USD" label="Cash math first. APIs and billing come next." />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-heading max-w-xl text-3xl tracking-tight sm:text-4xl">
          Spreadsheets hide the fee stack. The listing looks fat until FBA lands.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Step
            n="01"
            title="Capture the buy"
            body="Paste an eBay URL or type title, condition, price, and inbound shipping. The mock parser fills demo catalog items so you can move today."
          />
          <Step
            n="02"
            title="Match the sell-side"
            body="Look up an ASIN or enter Amazon title and price. Category defaults set referral fees; FBA tiers or FBM postage are editable."
          />
          <Step
            n="03"
            title="Park it in the pipeline"
            body="Save the deal as Researching, Watching, Buying, Listed, or Sold. The dashboard totals open profit and realized ROI."
          />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-16 sm:px-6 md:grid-cols-2">
        <Feature
          icon={Calculator}
          title="Fee-honest calculator"
          body="eBay cost + inbound + referral + FBA or FBM + prep. Net profit, margin, and cash-on-cash ROI update as you type."
        />
        <Feature
          icon={ScanSearch}
          title="API-ready seams"
          body="eBay Browse, Amazon SP-API, and Keepa are stubbed behind parse and lookup actions. No marketplace keys required for the MVP."
        />
        <Feature
          icon={Columns3}
          title="A pipeline, not a pile"
          body="Kanban or table. Drag a card when you bid, receive, list, or sell. Losing flips stay visible so you stop repeating them."
        />
        <Feature
          icon={Shield}
          title="Ops tool, not a hype deck"
          body="Quiet UI, named fee assumptions, and settings you can change. Built for FBA/FBM sellers who already know this is a grind."
        />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl bg-sidebar px-6 py-12 text-sidebar-foreground sm:px-12">
          <h2 className="font-heading max-w-xl text-3xl tracking-tight sm:text-4xl">
            Run the next eBay lot through FlipBridge before you spend the cash.
          </h2>
          <p className="mt-4 max-w-lg text-sidebar-foreground/70">
            Create a workspace or sign in as the demo seller. Branding, live APIs, and billing
            are the next iteration — the loop is already usable.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "h-10 bg-white px-4 text-sidebar hover:bg-white/90")}
            >
              Create a workspace
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-10 px-4 text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground",
              )}
            >
              Sign in to demo
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Brand />
          <p>Rename-friendly MVP. Not affiliated with Amazon or eBay.</p>
        </div>
      </footer>
    </div>
  );
}

function Proof({ stat, label }: { stat: string; label: string }) {
  return (
    <div>
      <p className="font-heading text-3xl tracking-tight">{stat}</p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="font-mono text-xs text-muted-foreground">{n}</p>
      <h3 className="mt-3 font-heading text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </article>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Calculator;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <Icon className="size-5 text-primary" />
      <h3 className="mt-4 font-heading text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </article>
  );
}
