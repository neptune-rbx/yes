# East Coaster Tracker

A modern ride tracking application built with React, TypeScript, and Cloudflare Workers.

## Quick Start

### 1. Setup Frontend

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### 2. Setup Backend (Cloudflare Worker)

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy worker.js
```

After deploying, note your worker URL and update `.env.local`:
```
VITE_API_BASE=https://your-worker-name.your-account.workers.dev
```

### 3. Set up KV Namespace

1. Go to Cloudflare Dashboard → Workers & Pages
2. Select your worker
3. Go to Settings → Bindings
4. Create KV Namespace binding:
   - Variable name: `RIDE_TRACKER`
   - Select or create a KV namespace
5. Redeploy worker: `wrangler deploy worker.js`

## Features

✅ User Authentication (Register/Login)
✅ Cloud Sync for Ride Counts  
✅ Profile Customization (Name & Picture)
✅ Multi-Year Tracking
✅ Offline Support with Local Storage
✅ Responsive Mobile Design

## Project Structure

```
├── src/
│   ├── components/          # React UI components
│   ├── hooks/              # useTracker hook
│   ├── utils/              # Helper functions
│   ├── data/               # Park data
│   ├── App.tsx             # Main app
│   └── main.tsx            # Entry point
├── worker.js               # Cloudflare Worker backend
├── vite.config.ts          # Vite config
├── .env.example            # Environment template
├── DEPLOYMENT.md           # Deployment guide
└── package.json            # Dependencies
```

## Environment Variables

Create `.env.local` based on `.env.example`:

- `VITE_API_BASE`: Backend API URL (default: `/api`)

## Development

```bash
# Watch and rebuild
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
- **Frontend**: Push to GitHub, connect to Vercel
- **Backend**: Run `wrangler deploy worker.js`

## Architecture

- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite
- **Backend**: Cloudflare Workers + KV Storage
- **Storage**: Browser LocalStorage (client) + Cloudflare KV (server)
- **Auth**: Token-based with SHA-256 password hashing

## API Endpoints

- `POST /register` - Create new account
- `POST /login` - Sign in
- `GET /counts?user=USERNAME` - Fetch ride counts
- `POST /counts` - Update ride count

See `worker.js` for implementation details.

## License

MIT

## Support

For issues or questions:
1. Check browser console for errors (F12)
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
3. Check Cloudflare dashboard for worker status
