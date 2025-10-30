# Vercel Postgres Setup Instructions

## Step 1: Create Postgres Database in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `revelateops-website`
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name: `revelate-chat-db` (or whatever you prefer)
7. Select region: Choose closest to you or your users
8. Click **Create**

## Step 2: Connect to Your Project

1. After creation, click **Connect Project**
2. Select your project from the dropdown
3. Choose environment: **Development** (for now)
4. Click **Connect**

This will automatically add these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## Step 3: Pull Environment Variables to Local

In your terminal, run:
```bash
vercel env pull .env.local
```

This will download all environment variables (including the new Postgres ones) to your `.env.local` file.

## Step 4: Install Postgres Client

```bash
npm install @vercel/postgres
```

## Step 5: Run Database Schema

You have two options:

### Option A: Via Vercel Dashboard (Easiest)
1. In Vercel dashboard, go to your database
2. Click **Query** tab
3. Copy the contents of `lib/db/schema.sql`
4. Paste into the query editor
5. Click **Run Query**

### Option B: Via Terminal
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Run the schema
vercel env pull
psql $POSTGRES_URL < lib/db/schema.sql
```

## Step 6: Verify Tables Created

In Vercel dashboard → Database → Data tab, you should see:
- ✅ `conversations` table
- ✅ `messages` table

## Step 7: Ready to Code!

Your database is now set up and ready. The chat API routes will use these tables.

## Environment Variables Needed

Make sure your `.env.local` has:
```env
# Vercel Postgres (auto-added by Vercel)
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."

# Slack (you already have these)
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_USER_ID=U09J8RBV18T
```

## Troubleshooting

**"Error connecting to database"**
- Run `vercel env pull .env.local` to get latest env vars
- Restart your dev server

**"Table already exists"**
- Normal if you run schema.sql multiple times
- Tables use `IF NOT EXISTS` so it's safe

**Need to reset database?**
```sql
DROP TABLE messages;
DROP TABLE conversations;
-- Then run schema.sql again
```
