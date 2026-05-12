# East Coaster Tracker - Deployment Guide

## Setup

### 1. Frontend (Vite + React)

The frontend is built with Vite and can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages, etc.)

**Build the frontend:**
```bash
npm install
npm run build
```

This creates a `dist/` folder with your compiled frontend.

### 2. Backend (Cloudflare Worker)

The backend is a Cloudflare Worker that handles authentication and data syncing.

**Deploy the worker:**

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy the worker:
```bash
wrangler deploy worker.js
```

4. Set up KV Namespace in Cloudflare Dashboard:
   - Go to Workers & Pages → your worker
   - Settings → Bindings → KV Namespace
   - Create a binding named `RIDE_TRACKER` (exact case-sensitive name)
   - The worker will now store user data and ride counts

### 3. API Configuration

You have three options for connecting the frontend to the backend:

**Option A: Cloudflare Worker URL (External)**
```bash
# Create a .env.local file in the project root:
VITE_API_BASE=https://your-worker-url.workers.dev
```

**Option B: Relative Path (If serving frontend + worker from same origin)**
```bash
# Create a .env.local file:
VITE_API_BASE=/api
```

**Option C: Local Development**
```bash
# For local testing:
VITE_API_BASE=http://localhost:8787
```

## Deployment Steps

### Deploy to Vercel (Recommended for Frontend)

1. Push your repo to GitHub
2. Connect to Vercel: https://vercel.com
3. Import your repository
4. Add environment variable: `VITE_API_BASE` with your Cloudflare Worker URL
5. Deploy!

### Deploy Worker to Cloudflare

1. Update `worker.js` if needed
2. Run: `wrangler deploy worker.js`
3. Note the worker URL from the output
4. Update frontend `VITE_API_BASE` environment variable with this URL

## Project Structure

```
├── src/                  # Frontend source code
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── data/            # Static data
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── worker.js            # Cloudflare Worker backend
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies
├── .env.example         # Environment variables template
└── DEPLOYMENT.md        # This file
```

## Environment Variables

- `VITE_API_BASE`: The base URL for API requests. Defaults to `/api` if not set.

## Features

- **User Authentication**: Register/Login with username and password
- **Data Sync**: All ride counts sync to cloud when authenticated
- **Offline Support**: Local storage backup for data persistence
- **Multi-user**: Each user has isolated data
- **Profile Customization**: Name and profile picture support
- **Year Tracking**: Track rides across multiple years

## Troubleshooting

### "Cannot reach server" error
- Check that your worker is deployed: `wrangler deployments list`
- Verify `VITE_API_BASE` environment variable is set correctly
- Check browser console for CORS errors

### Data not syncing
- Ensure you're logged in (check for username in header)
- Check browser DevTools → Network tab for failed requests
- Verify KV namespace binding is configured in Cloudflare Dashboard

### CORS errors
- The worker has CORS headers configured for all origins
- If issues persist, check Cloudflare dashboard for any firewall rules

## Support

For issues or questions, check:
1. Browser console (F12) for error messages
2. Network tab in DevTools for failed requests
3. Cloudflare dashboard for worker status
