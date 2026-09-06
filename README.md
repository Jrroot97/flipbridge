# FlipBridge

A focused workspace for Amazon FBA/FBM sellers who source inventory on eBay and resell it on Amazon. Paste a listing, estimate the Amazon side, and see whether the flip still works after referral fees, FBA or FBM, and prep.

Working name is FlipBridge. Branding, live marketplace APIs, and billing are the next iteration.

## What you can do

- Land on a marketing page that explains the eBay → Amazon loop
- Sign in with email/password (or use the seeded demo account)
- Parse an eBay URL from a mocked catalog, or enter title, price, condition, and inbound shipping
- Match an ASIN from a mocked Amazon catalog, or enter title and price by hand
- Calculate net profit, margin, and cash-on-cash ROI with category-aware referral defaults
- Save deals into Researching → Watching → Buying → Listed → Sold
- Review totals on the dashboard and change fee defaults in Settings

Marketplace credentials are not required. Lookups are mocked, fields stay editable, and the parse/lookup actions are the seams for eBay Browse, Amazon SP-API, and Keepa.

## Run locally

Postgres is required (SQLite will not deploy to Vercel). The default path is Docker Compose.

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

`npm run dev` generates the Prisma client, applies migrations, and seeds demo data if needed. The app listens on [http://127.0.0.1:43147](http://127.0.0.1:43147).

`.env.example` defaults:

```
DATABASE_URL="postgresql://flipbridge:flipbridge@127.0.0.1:5432/flipbridge"
DIRECT_URL="postgresql://flipbridge:flipbridge@127.0.0.1:5432/flipbridge"
AUTH_SECRET="flipbridge-dev-secret-change-in-production"
```

`DATABASE_URL` and `DIRECT_URL` can be the same locally. In production, `DATABASE_URL` should be the pooled URL and `DIRECT_URL` the direct (non-pooled) URL so migrations can run.

### Without Docker

Create a database on [Neon](https://neon.tech) (or any Postgres 16 host), put both URLs in `.env`, then:

```bash
npm install
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run dev
```

## Demo account

- Email: `demo@flipbridge.app`
- Password: `demo1234`

The demo user has a full pipeline: a strong Dyson flip, a thin Bose FBM check, a fee-killed HDMI lot, and deals already listed or sold.

Try parsing:

- `https://www.ebay.com/itm/Dyson-V8-Animal-Cordless-Vacuum/126884210001`
- `https://www.ebay.com/itm/Instant-Pot-Duo-6-Quart/204991120118`

Or look up ASINs such as `B08KTZ8249` (Kindle) and `B00FLYWNYQ` (Instant Pot).

## Deploy to Vercel (from Origin)

See [DEPLOY.md](./DEPLOY.md). Short version: connect Vercel from the Origin Apps tab, add Vercel Postgres or Neon, set `DATABASE_URL`, `DIRECT_URL`, and `AUTH_SECRET`, then deploy. Do not mirror this repo to GitHub.

Required Vercel env vars:

- `DATABASE_URL` — pooled Postgres URL
- `DIRECT_URL` — direct Postgres URL for migrations
- `AUTH_SECRET` — session cookie secret

## Stack

- Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui
- Prisma + PostgreSQL
- Email/password sessions (JWT cookie via `jose` + `bcryptjs`)

## Project shape

- `src/lib/catalog.ts` — mocked eBay/Amazon listings and URL/ASIN matching
- `src/lib/profit.ts` — landed cost, fees, margin, ROI
- `src/lib/categories.ts` — category referral defaults and FBA size-tier shortcuts
- `src/app/actions/` — auth, deals, settings, lookups
- `prisma/schema.prisma` — users, settings, deals

## Reset the local database

```bash
npm run db:reset
```
