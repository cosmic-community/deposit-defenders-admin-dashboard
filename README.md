# Deposit Defenders Admin Dashboard

![Admin Dashboard Preview](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=300&fit=crop&auto=format)

A comprehensive admin dashboard for tracking user growth, subscriptions, and revenue for your Deposit Defenders rental protection platform.

## Features

- 📊 **Real-time Analytics Dashboard** - Track user signups, logins, and engagement
- 💰 **Revenue Tracking** - Monitor monthly recurring revenue (MRR) and growth
- 👥 **User Management** - View user details, subscription status, and activity
- 📈 **Interactive Charts** - Visual data representation with Chart.js
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🌙 **Dark Mode Support** - Professional dashboard theme
- 📊 **Subscription Analytics** - Track free vs pro conversions
- 📤 **Export Reports** - Download user and revenue data
- 🔒 **Admin Authentication** - Secure admin-only access
- ⚡ **Real-time Updates** - Live data refresh capabilities

<!-- CLONE_PROJECT_BUTTON -->

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> I want to build a simple landing page for my Deposit Defenders application. The landing page should be to provide a little information about why this type of application exists, show the free tier and paid tier pricing and allow the user to sign up and also log in.

### Code Generation Prompt

> I have the website https://deposit-defenders-landing-page-paym.cosmic.site/ where users sign up to use my app that let's them take inventory of their apartment/home when they move in. I want to create an admin dashboard that tracks my user sign ups, logins, and how much money I'm making. Basically a simple dashboard to track the growth of this website I've built.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Chart.js + React-Chartjs-2** - Interactive charts and data visualization
- **Lucide React** - Beautiful icons
- **Cosmic CMS** - Headless CMS for user data and analytics
- **Vercel** - Deployment and hosting

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with bucket access

### Installation

1. Clone this repository
2. Install dependencies:
```bash
bun install
```

3. Set up your environment variables (create `.env.local`):
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetch User Analytics
```typescript
import { cosmic } from '@/lib/cosmic'

// Get user signups by date range
const userSignups = await cosmic.objects
  .find({ 
    type: 'users',
    'metadata.signup_date': {
      $gte: startDate,
      $lte: endDate
    }
  })
  .props(['title', 'metadata'])
```

### Track Revenue Metrics
```typescript
// Get subscription data for revenue calculation
const subscriptions = await cosmic.objects
  .find({ 
    type: 'users',
    'metadata.subscription_plan': 'pro'
  })
  .props(['metadata.subscription_plan', 'metadata.signup_date'])
```

### Monitor User Activity
```typescript
// Get recent login activity
const recentActivity = await cosmic.objects
  .find({ 
    type: 'user_sessions',
    'metadata.login_date': {
      $gte: last30Days
    }
  })
  .sort('metadata.login_date', -1)
```

## Cosmic CMS Integration

This dashboard integrates with your Deposit Defenders user data:

- **Users Object Type** - Stores user profiles, subscription plans, signup dates
- **User Sessions** - Tracks login activity and engagement metrics  
- **Revenue Analytics** - Calculates MRR from subscription data
- **Growth Metrics** - Monitors user acquisition and retention

The dashboard automatically fetches and displays:
- Total user count and growth trends
- Free vs Pro subscription breakdown
- Monthly recurring revenue calculations
- User activity and engagement metrics

## Deployment Options

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy with automatic CI/CD

### Deploy to Netlify
1. Build the project: `bun run build`
2. Deploy the `out` folder to Netlify
3. Set up environment variables in Netlify dashboard

### Environment Variables for Production
Set these in your hosting platform:
- `COSMIC_BUCKET_SLUG` - Your Cosmic bucket identifier
- `COSMIC_READ_KEY` - API key for reading data
- `COSMIC_WRITE_KEY` - API key for writing data (if needed)