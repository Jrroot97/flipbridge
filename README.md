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

```bash
npm install
npm run dev
```

`npm run dev` generates the Prisma client, pushes the SQLite schema, and seeds demo data if needed. The app listens on [http://127.0.0.1:43147](http://127.0.0.1:43147).

Copy `.env.example` to `.env` only if you want to change the defaults. The setup script creates `.env` when it is missing.

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="flipbridge-dev-secret-change-in-production"
```

## Demo account

- Email: `demo@flipbridge.app`
- Password: `demo1234`

The demo user has a full pipeline: a strong Dyson flip, a thin Bose FBM check, a fee-killed HDMI lot, and deals already listed or sold.

Try parsing:

- `https://www.ebay.com/itm/Dyson-V8-Animal-Cordless-Vacuum/126884210001`
- `https://www.ebay.com/itm/Instant-Pot-Duo-6-Quart/204991120118`

Or look up ASINs such as `B08KTZ8249` (Kindle) and `B00FLYWNYQ` (Instant Pot).

## Stack

- Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui
- Prisma + SQLite
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
