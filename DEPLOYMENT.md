# Deployment Guide for Vibe Rooms Review Dashboard

## What You Have

- ✅ Git repository initialized and committed
- ✅ React dashboard with Highcharts
- ✅ 1172 Google Maps reviews downloaded
- ✅ Netlify configuration file ready
- ✅ Production build tested and working

## Deploy to Netlify - 3 Options

### Option 1: Netlify CLI (Fastest - 2 minutes)

1. From the `dashboard` directory:
   ```bash
   cd dashboard
   netlify deploy --prod --dir=dist
   ```

2. Follow the prompts:
   - Choose "Create & configure a new site"
   - Select your team
   - Give it a site name (e.g., "vibe-rooms-reviews")
   - The site will be deployed!

### Option 2: GitHub + Netlify (Recommended - 5 minutes)

1. **Create a GitHub repository:**
   ```bash
   # Create a new repo on GitHub first (https://github.com/new)
   # Name it "vibe-rooms-review-analyzer"

   # Then push your code:
   git remote add origin https://github.com/YOUR_USERNAME/vibe-rooms-review-analyzer.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and select your repository
   - Configure:
     - Base directory: `dashboard`
     - Build command: `npm run build`
     - Publish directory: `dashboard/dist`
   - Click "Deploy site"

### Option 3: Drag & Drop (Easiest - 1 minute)

1. Go to https://app.netlify.com/drop
2. Drag and drop the `dashboard/dist` folder
3. Your site is live!

Note: This option doesn't support auto-updates, so you'll need to manually upload new builds.

## After Deployment

Your dashboard will be live at a URL like:
`https://your-site-name.netlify.app`

## Updating the Dashboard

When you want to refresh the reviews data:

1. **Download new reviews:**
   ```bash
   node --loader ts-node/esm download-all-reviews.ts
   ```

2. **Copy to dashboard:**
   ```bash
   cp all-reviews.json dashboard/public/
   ```

3. **Rebuild and deploy:**
   ```bash
   cd dashboard
   npm run build
   netlify deploy --prod --dir=dist
   ```

Or if using GitHub integration, just:
```bash
git add .
git commit -m "Update reviews data"
git push
```

Netlify will automatically rebuild and deploy!

## Features

Your dashboard includes:

1. ✨ **Overall Statistics** - Rating breakdown, total reviews, category averages
2. 📊 **Interactive Rating Trends Chart** - View by month or week, shows all star ratings over time
3. 🔍 **Detailed Analysis** - Top topics, recent reviews, low-rating issues
4. 📱 **Responsive Design** - Works great on mobile, tablet, and desktop
5. ⚡ **Fast Loading** - Optimized build with Vite

## Customization

To customize the dashboard:

- Edit components in `dashboard/src/components/`
- Update styles in the `.css` files
- Modify chart options in `RatingTrendsChart.jsx`

After changes:
```bash
cd dashboard
npm run build
```

Then redeploy!
