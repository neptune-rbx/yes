# Quick Reference

## Project Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app component (header, routing) |
| `src/components/ProfileTab.tsx` | Profile page (auth form when logged out, stats when logged in) |
| `src/components/ParksTab.tsx` | Parks/rides listing |
| `src/components/TierListTab.tsx` | Tier list feature |
| `src/hooks/useTracker.ts` | Main state management hook |
| `worker.js` | Cloudflare Worker backend |
| `vite.config.ts` | Build configuration |
| `.env.example` | Environment variables template |
| `package.json` | Dependencies |

## Key Environment Variables

```bash
# Frontend API endpoint
VITE_API_BASE=/api          # Relative path (default)
VITE_API_BASE=https://...   # Absolute worker URL
```

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy worker
wrangler deploy worker.js
```

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/register` | Create account |
| POST | `/login` | Sign in |
| GET | `/counts?user=USERNAME` | Fetch ride counts |
| POST | `/counts` | Update ride count |

## Component Props

### `<App />`
- No props required
- Manages: auth modal state, active tab, year

### `<ProfileTab />`
- `tracker` - useTracker hook instance
- `year` - Current year number
- `setYear` - Year setter function
- `showAuthModal` - Boolean (currently unused but available)
- `setShowAuthModal` - Function to show/hide auth

### `<ParksTab />`
- `tracker` - useTracker hook instance
- `year` - Current year number

### `<TierListTab />`
- `tracker` - useTracker hook instance

## useTracker Hook

Returns object with:

```typescript
{
  // State
  state: {
    counts: Record<string, number>,      // ride counts
    tiers: Record<string, string>,       // tier assignments
    profile: { name, pic, selectedYear } // user profile
  },
  session: { username, token } | null,   // user session
  syncState: 'idle' | 'syncing' | 'synced' | 'error' | 'not-authenticated',
  authError: string | null,
  
  // Functions
  incrementCount(id: string, year: number),
  decrementCount(id: string, year: number),
  updateTier(id: string, tier: string),
  updateProfile(updates: {}),
  register(username: string, password: string): Promise<boolean>,
  login(username: string, password: string): Promise<boolean>,
  logout()
}
```

## localStorage Keys

- `coaster_session` - Active user session (token + username)
- `east_coaster_data` - Offline state backup

## Cloudflare Worker Setup

1. Create KV namespace
2. Set binding variable name to: `RIDE_TRACKER` (case-sensitive)
3. Deploy: `wrangler deploy worker.js`
4. Use returned URL as `VITE_API_BASE`

## Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot reach server" | Check `VITE_API_BASE` env var and worker status |
| Auth form stuck | Check browser console for errors |
| Data not syncing | Verify you're logged in, check Network tab in DevTools |
| CORS errors | Ensure worker CORS headers are enabled |

## File Sizes (Approximate)

- Frontend bundle: ~150KB (gzipped)
- Worker: ~5KB
- Total deployable size: Minimal

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

- Data syncs on 1-second debounce after edits
- Offline edits save to localStorage immediately
- Profile pictures stored as base64 data URLs
- No external API calls except to worker

## Security

- Passwords hashed with SHA-256
- Token-based authentication
- KV store data isolated per user
- CORS enabled for all origins (can be restricted)
- No sensitive data in frontend code

## Customization

To change styling:
- Tailwind classes in `.tsx` files
- Main colors: zinc-950, zinc-900, zinc-100
- Modify `src/index.css` for global styles

To add more parks:
- Edit `src/data/parks.ts`
- Follow existing format
- Update PARK_INFO object

To modify worker endpoints:
- Edit `worker.js`
- Add route handlers
- Test with `wrangler dev`

## Deployment Checklist

- [ ] Set up `.env.local` with API URL
- [ ] Build frontend: `npm run build`
- [ ] Deploy worker: `wrangler deploy worker.js`
- [ ] Verify KV namespace created
- [ ] Test login/registration
- [ ] Test data sync
- [ ] Deploy frontend to hosting service
- [ ] Test in production
