# Deploy FlipBridge to Vercel from Origin

FlipBridge is a Next.js app with Prisma + PostgreSQL. SQLite will not run on Vercel serverless — use Vercel Postgres or Neon.

## 1. Connect Vercel to this Origin repo

1. In Cursor, open the **Origin Apps** tab and connect **Vercel**.
2. Import this Origin repository (do not create a GitHub mirror).
3. Framework preset: **Next.js**. The repo includes a `vercel.json` build command that generates the Prisma client, applies migrations, seeds the demo seller if the database is empty, then builds Next.js.

## 2. Provision Postgres

Pick one:

- **Vercel Postgres** — Storage → Create Database → Postgres. Copy the connection strings Vercel injects.
- **Neon** — create a project, copy the pooled and direct URLs.

## 3. Environment variables in Vercel

Set these on the Vercel project (Production and Preview):

| Name | Required | What to put there |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Pooled Postgres URL. For Vercel Postgres use `POSTGRES_PRISMA_URL` / `POSTGRES_URL` (the pooled one, often with `pgbouncer=true`). For Neon use the **pooled** connection string. |
| `DIRECT_URL` | Yes | Direct (non-pooled) URL used by `prisma migrate deploy`. For Vercel Postgres use `POSTGRES_URL_NON_POOLING`. For Neon use the **direct** connection string. Locally both can be the same Docker URL. |
| `AUTH_SECRET` | Yes | Long random string used to sign session cookies. Example: `openssl rand -base64 32`. Do not reuse the local default in production. |

No eBay or Amazon API keys are required for this MVP.

## 4. Deploy

Push to the connected Origin branch (usually `main`). Vercel will:

1. `prisma generate`
2. `prisma migrate deploy`
3. `tsx prisma/seed.ts` (creates `demo@flipbridge.app` / `demo1234` if missing)
4. `next build`

After the first successful deploy, open the Vercel URL and sign in with the demo account.

## 5. Re-seed or reset (optional)

From a machine with `DATABASE_URL` and `DIRECT_URL` pointed at the cloud database:

```bash
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

The seed is idempotent: it upserts the demo user and only inserts pipeline deals when that user has none.
