# Deployment Instructions

## Vercel Deployment

The website is configured to deploy to: `https://vercel.com/drew-lamberts-projects/revelateops`

### Prerequisites
1. Git repository initialized ✅
2. Code committed ✅
3. Vercel project exists ✅

### Deploy Steps

#### Option 1: Connect via Vercel Dashboard (Recommended)
1. Go to https://vercel.com/drew-lamberts-projects
2. Click "Add New" → "Project"
3. Import the git repository from `/Users/drewlambert/Desktop/Revelate/revelateops-website`
4. Configure project:
   - **Project Name**: revelateops
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_CALENDLY_CLIENT_ID=pPIkttAjyS42CBhMKcpyZWYjoigHDmpivG5_Vl33IY0
   CALENDLY_CLIENT_SECRET=DKHmA1Tr-ufft6K5n5PW8C8X2XzfA-y2lhudD89x7mc
   CALENDLY_SIGNING_KEY=ho7LV8OQTMfl-o8linC-flAuy-_WUWgklVcx1h7A2j0
   ```
6. Click "Deploy"

#### Option 2: Using Vercel CLI
```bash
cd /Users/drewlambert/Desktop/Revelate/revelateops-website
npx vercel link --project revelateops
npx vercel env pull  # Pull existing env vars if any
npx vercel deploy --prod
```

### Post-Deployment

1. **Configure Custom Domain**:
   - Go to Project Settings → Domains
   - Add `revelateops.com` and `www.revelateops.com`
   - Update DNS records as Vercel instructs

2. **Update Calendly Embed**:
   - Edit `components/CalendlyEmbed.tsx`
   - Replace `your-calendly-username` with your actual Calendly username
   - Commit and redeploy

3. **Add Your Logo**:
   - Place logo image in `public/` folder
   - Update Navigation component to use the logo

4. **Analytics (Optional)**:
   - Add Vercel Analytics: `npm install @vercel/analytics`
   - Add Google Analytics if desired

### Continuous Deployment

Once connected to Vercel:
- Every push to `main` branch automatically deploys to production
- Preview deployments created for all branches/PRs
- No manual deployment needed

## Environment Variables

These are already in `.env.local` locally (gitignored).
Add to Vercel Project Settings → Environment Variables:

```
NEXT_PUBLIC_CALENDLY_CLIENT_ID=pPIkttAjyS42CBhMKcpyZWYjoigHDmpivG5_Vl33IY0
CALENDLY_CLIENT_SECRET=DKHmA1Tr-ufft6K5n5PW8C8X2XzfA-y2lhudD89x7mc
CALENDLY_SIGNING_KEY=ho7LV8OQTMfl-o8linC-flAuy-_WUWgklVcx1h7A2j0
```

## Next Steps After Deployment

### Immediate
1. Test all pages on the live URL
2. Update Calendly username in CalendlyEmbed.tsx
3. Verify mobile responsiveness
4. Test all CTAs and navigation

### Soon
1. Add actual logo file to replace text logo
2. Set up email (drew@revelateops.com)
3. Connect domain (revelateops.com)
4. Add Google Analytics or Vercel Analytics
5. Set up OpenGraph images for social sharing

### V2 Features (Future)
1. Blog/Resources section for SEO
2. Additional case studies as projects complete
3. Newsletter signup
4. Chat widget (optional)
5. Video testimonials
