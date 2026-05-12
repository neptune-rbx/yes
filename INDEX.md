# 📚 Documentation Index

Welcome to the East Coaster Tracker! This document will guide you to the right information.

## 🚀 Getting Started

**New to this project?** Start here:
1. Read: [`README.md`](./README.md) - Overview and quick setup
2. Read: [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md) - What was just changed
3. Run: `./deploy.sh` - Automated setup helper (macOS/Linux)

## 📖 Documentation Files

| File | Purpose | When to Read |
|------|---------|-------------|
| [`README.md`](./README.md) | Project overview, quick start | First thing, always |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Complete deployment guide | When deploying |
| [`CHANGES.md`](./CHANGES.md) | What was modified | To understand changes |
| [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md) | Developer reference | During development |
| [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md) | Summary of recent changes | To see what's new |
| [`INDEX.md`](./INDEX.md) | This file | Navigation |

## 🛠️ Quick Commands

```bash
# Setup
npm install
cp .env.example .env.local
npm run dev

# Build
npm run build

# Deploy worker
wrangler deploy worker.js

# Automated setup (macOS/Linux)
chmod +x deploy.sh
./deploy.sh
```

## 🎯 Common Tasks

### I want to run it locally
1. Read: [`README.md`](./README.md) → "Quick Start" section
2. Run: `npm install && npm run dev`
3. Visit: `http://localhost:5173`

### I want to deploy everything
1. Read: [`DEPLOYMENT.md`](./DEPLOYMENT.md)
2. Follow the step-by-step guide
3. Or run: `./deploy.sh` (if on macOS/Linux)

### I want to understand the code
1. Read: [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md)
2. Check: `src/` folder structure
3. Review: Key files listed in reference

### I want to know what changed
1. Read: [`CHANGES.md`](./CHANGES.md) → "Files Modified" section
2. Or: [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md)

### I'm stuck or getting errors
1. Check: [`DEPLOYMENT.md`](./DEPLOYMENT.md) → "Troubleshooting" section
2. Check: [`README.md`](./README.md) → "Support" section
3. Check: Browser console (F12) for errors

## 🏗️ Project Structure

```
east-coaster-tracker/
├── src/
│   ├── components/        # React UI components
│   ├── hooks/            # Custom hooks (useTracker)
│   ├── data/             # Park data
│   ├── utils/            # Helper functions
│   ├── App.tsx           # Main component
│   └── main.tsx          # Entry point
│
├── worker.js             # Cloudflare Worker backend
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config
├── package.json          # Dependencies
│
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── deploy.sh             # Automated deployment script
│
├── README.md             # Quick start guide
├── DEPLOYMENT.md         # Deployment instructions
├── CHANGES.md            # Change log
├── QUICK_REFERENCE.md    # Developer reference
├── IMPLEMENTATION_SUMMARY.md  # Recent changes
└── INDEX.md              # This file
```

## 💡 Key Concepts

### Authentication
- Users register with username and password
- SHA-256 password hashing on backend
- Token-based session management
- 30-day token expiration

### Data Storage
- **Frontend**: LocalStorage (offline cache)
- **Backend**: Cloudflare KV (cloud storage)
- Auto-sync when online
- Per-user isolated data

### Deployment Options
1. **Same-origin**: Frontend + Worker on same domain
2. **Separate**: Frontend on Vercel, Worker on Cloudflare
3. **Local**: Both running locally for development

### API Configuration
Set `VITE_API_BASE` environment variable to:
- Production: `https://your-worker.workers.dev`
- Local dev: `http://localhost:8787`
- Relative: `/api`

## 🔧 Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Cloudflare Workers, KV Storage
- **UI Components**: Lucide icons, Framer Motion
- **Build**: Vite with single-file output
- **Package Manager**: npm

## 📋 Feature List

✅ User authentication (Register/Login)
✅ Cloud data sync
✅ Offline support
✅ Profile customization
✅ Multi-year tracking
✅ Statistics dashboard
✅ Tier list feature
✅ Responsive design
✅ Mobile friendly

## 🚀 Deployment Checklist

- [ ] Read [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- [ ] Set up `.env.local`
- [ ] Run `npm install`
- [ ] Test locally: `npm run dev`
- [ ] Build: `npm run build`
- [ ] Deploy worker: `wrangler deploy worker.js`
- [ ] Setup KV namespace
- [ ] Deploy frontend to hosting
- [ ] Test in production
- [ ] Monitor for errors

## 🆘 Getting Help

**For setup issues:**
- Read [`README.md`](./README.md) Quick Start section
- Check browser console (F12)

**For deployment issues:**
- Read [`DEPLOYMENT.md`](./DEPLOYMENT.md) Troubleshooting
- Check Cloudflare dashboard

**For code questions:**
- Read [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md)
- Check component files in `src/`

**For change details:**
- Read [`CHANGES.md`](./CHANGES.md)
- Read [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md)

## 📞 Support Channels

1. **Browser Console**: F12 → Console tab (error messages)
2. **Network Tab**: F12 → Network tab (failed requests)
3. **Cloudflare Dashboard**: Worker status and logs
4. **Documentation**: Files in this folder

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Cloudflare Workers Guide](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)

## 📝 License

MIT

## 🎉 You're All Set!

Choose your next step:
- **First time?** → Start with [`README.md`](./README.md)
- **Deploying?** → Read [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- **Developing?** → Use [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md)
- **Want changes?** → Check [`CHANGES.md`](./CHANGES.md)

Good luck! 🚀
