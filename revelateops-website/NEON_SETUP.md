# Neon Postgres Setup (Updated for Vercel Marketplace)

Vercel now integrates with marketplace database providers. **Neon** is the recommended choice - serverless Postgres with excellent free tier.

## Step 1: Set Up Neon via Vercel

1. **Go to your Vercel Storage page:**
   https://vercel.com/drew-lamberts-projects/revelateops-website/stores

2. **Click "Neon" (Serverless Postgres)**

3. **Click "Add Integration"** or **"Connect"**

4. **Authorize Neon:**
   - You'll be redirected to Neon
   - Sign in or create account (use same email as Vercel)
   - Authorize the Vercel integration

5. **Create Database:**
   - Database name: `revelate-chat` (or leave default)
   - Region: Choose closest to you
   - Click **"Create"**

6. **Connect to Project:**
   - Select project: `revelateops-website`
   - Environment: Check **Development** and **Production**
   - Click **"Add Integration"**

## Step 2: Pull Environment Variables

This downloads the Neon connection string to your local `.env.local`:

```bash
cd /Users/drewlambert/Desktop/Revelate/revelateops-website
vercel env pull .env.local
```

This adds:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_URL_NON_POOLING`
- etc.

## Step 3: Verify Connection String

Check your `.env.local` has the Postgres URL:

```bash
grep POSTGRES_URL .env.local
```

You should see something like:
```
POSTGRES_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb"
```

## Step 4: Install Postgres Client (Already Done ✓)

You already have `@vercel/postgres` installed, which works with Neon.

## Step 5: Run Database Schema

You have two options:

### Option A: Via Neon Console (Recommended)

1. Go to: https://console.neon.tech/app/projects
2. Click your project (`revelate-chat` or similar)
3. Click **"SQL Editor"** in left sidebar
4. Copy entire contents of `lib/db/schema.sql`
5. Paste and click **"Run"**

### Option B: Via Terminal

```bash
# Make sure you have psql installed
brew install postgresql

# Run the schema
psql $POSTGRES_URL -f lib/db/schema.sql
```

## Step 6: Verify Tables Created

In Neon Console → SQL Editor, run:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

You should see:
- ✅ `conversations`
- ✅ `messages`

## Step 7: Test the Connection

Restart your dev server to load the new env vars:

```bash
npm run dev
```

The database connection should now work!

## Troubleshooting

### "Cannot find POSTGRES_URL"
- Run `vercel env pull .env.local` again
- Make sure Neon integration is connected in Vercel
- Restart your dev server

### "Connection refused"
- Check your IP isn't blocked in Neon dashboard
- Neon free tier allows connections from anywhere by default

### "SSL required"
- Use `POSTGRES_URL` (includes SSL)
- Or use `POSTGRES_URL_NON_POOLING` for direct connections

## Neon Free Tier Limits

- ✅ 3 GB storage
- ✅ Unlimited compute hours
- ✅ 0.5 GB RAM
- ✅ More than enough for chat system

Perfect for this use case!

## Next Steps

Once database is set up:
1. ✅ Database created and connected
2. ✅ Schema run (tables created)
3. → Set up Slack Events webhook
4. → Test the chat system!
