# Daily Worksheet

A calendar and activity-planning app built with Next.js App Router, React, and TypeScript. The UI uses Tailwind CSS 4, shadcn/ui, Lucide React, date-fns, and Zod. Google-only sign-in is powered by Better Auth, with Prisma ORM 7 and Neon PostgreSQL for auth data.

## Run locally

1. Install dependencies and create your local environment file:

   ```bash
   pnpm install
   cp .env.example .env
   ```

2. Set `DATABASE_URL` to your Neon pooled connection string and `DIRECT_URL` to its direct connection string. Generate a secret with `openssl rand -base64 32` and set `BETTER_AUTH_SECRET`.
3. Create a Google OAuth Web client. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI, then set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
4. Apply the committed database migrations:

   ```bash
   pnpm db:migrate
   ```

5. Start the app:

   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000). App routes require an authenticated Google account.

## Production deployment

Keep the Vercel Build Command as `pnpm build`; it generates Prisma Client and builds the app. Apply database migrations as a separate, controlled release step before promoting the corresponding app deployment:

```bash
pnpm db:migrate:deploy
```

The command uses `DIRECT_URL` from `prisma.config.ts`, so provide the Neon direct (unpooled) connection string to the migration job. Do not use `prisma migrate dev` against production or run migrations on every preview build. For previews, use an isolated Neon branch cloned from a database with the current schema and migration history.

The existing migration history is already applied to the configured production database, but it is not ordered for a brand-new empty database: the activities migration adds a foreign key to `User` before the auth migration creates that table. Do not use `db:migrate` or `db:migrate:deploy` to initialize an empty database until the migration history is safely reconciled; do not rewrite migrations already applied in production.

Set the runtime environment variables in Vercel and add `https://your-domain.com/api/auth/callback/google` to the Google OAuth redirect URIs. Ensure the Vercel production environment uses the intended production database.

## Project structure

- `prisma/schema.prisma` defines the Better Auth user, session, account, and verification models.
- `src/app/` contains route groups, the Better Auth route handler, and global styles.
- `src/components/` contains feature components organized by layout, calendar, activities, appearance, settings, and auth.
- `src/providers/` and `src/hooks/` hold shared client state and feature hooks.
- `src/lib/`, `src/types/`, and `src/constants/` contain auth/database clients, date utilities, domain types, and UI/sample data.
- `components.json` configures shadcn/ui; generated primitives live in `src/components/ui/`.

Authentication, sessions, planner activities, and appearance settings are persisted in Neon PostgreSQL.

## Checks

```bash
pnpm lint
pnpm build
```
