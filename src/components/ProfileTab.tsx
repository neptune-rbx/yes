import { useRef, useMemo, useState, ChangeEvent } from 'react';
import { useTracker } from '../hooks/useTracker';
import { Camera, ChevronDown, LogIn, UserPlus, LogOut, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { PARKS, PARK_INFO } from '../data/parks';

const START_YEAR = 2026;
const currentYear = new Date().getFullYear();
const END_YEAR = Math.max(START_YEAR, currentYear);

export function ProfileTab({ tracker, year, setYear }: { tracker: ReturnType<typeof useTracker>; year: number; setYear: (y: number) => void }) {
  const { profile, counts } = tracker.state;
  const { session, syncState, authError, register, login, logout } = tracker;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const years = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);

  const handlePicUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          tracker.updateProfile({ pic: ev.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = useMemo(() => {
    let globalTotal = 0;
    const parkTotals: Record<string, number> = {};

    Object.keys(PARKS).forEach(parkKey => {
      let parkTotal = 0;
      PARKS[parkKey].forEach(ride => {
        const count = counts[`${ride.id}_${year}`] || 0;
        parkTotal += count;
        globalTotal += count;
      });
      parkTotals[parkKey] = parkTotal;
    });

    return { globalTotal, parkTotals };
  }, [counts, year]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setFeedback(null);
    
    let success = false;
    if (authMode === 'register') {
      success = await register(username, password);
    } else {
      success = await login(username, password);
    }

    setLoading(false);
    if (success) {
      setFeedback({ type: 'success', message: authMode === 'register' ? 'Account created successfully! Session synced.' : 'Logged in successfully!' });
      setUsername('');
      setPassword('');
    } else {
      setFeedback({ type: 'error', message: authError || 'Authentication failed' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in pb-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-zinc-900/30 border border-zinc-900 p-8 rounded-2xl">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-zinc-950 border border-zinc-900 flex items-center justify-center">
            {profile.pic ? (
              <img src={profile.pic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl text-zinc-600">?</span>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handlePicUpload} />
        </div>

        <div className="flex flex-col items-center md:items-start flex-1 gap-4">
          <input
            type="text"
            value={profile.name}
            onChange={(e) => tracker.updateProfile({ name: e.target.value })}
            className="bg-transparent text-3xl font-black text-zinc-100 outline-none border-b border-transparent hover:border-zinc-900 focus:border-zinc-800 transition-colors w-full text-center md:text-left"
            placeholder="Your Name"
          />
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Tracking Year</span>
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="appearance-none bg-zinc-950 border border-zinc-900 rounded-lg py-1.5 pl-3 pr-8 text-sm font-semibold text-zinc-200 outline-none focus:border-zinc-800"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Sync & Auth Section */}
      <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Cloud Sync Services</h3>
        
        {session ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Active Session</span>
                <span className="text-sm font-semibold text-zinc-400">@{session.username}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1.5">
                {syncState === 'syncing' && <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-400" />}
                {syncState === 'synced' && <CheckCircle className="w-3.5 h-3.5 text-zinc-400" />}
                {syncState === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                Status: {syncState === 'syncing' ? 'Syncing counts to Cloudflare Workers...' : syncState === 'synced' ? 'All counts synced to cloud!' : syncState === 'error' ? 'Sync error occurred.' : 'Idle'}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white px-4 py-2 rounded-xl border border-zinc-800 hover:border-zinc-750 transition-colors text-sm font-bold uppercase tracking-wider shrink-0"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-zinc-500">Sign in to sync your ride counts across devices via Anthony's Ride Tracker backend.</p>
            
            <div className="flex gap-2 border-b border-zinc-900 pb-2 max-w-xs">
              <button
                onClick={() => { setAuthMode('login'); setFeedback(null); }}
                className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${authMode === 'login' ? 'border-zinc-300 text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                Login
              </button>
              <button
                onClick={() => { setAuthMode('register'); setFeedback(null); }}
                className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${authMode === 'register' ? 'border-zinc-300 text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="max-w-md space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-zinc-200 text-sm outline-none focus:border-zinc-800"
                  placeholder="Your username"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-zinc-200 text-sm outline-none focus:border-zinc-800"
                  placeholder="Min 4 characters"
                />
              </div>

              {feedback && (
                <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${feedback.type === 'success' ? 'bg-zinc-900 text-zinc-300 border border-zinc-800' : 'bg-red-950/20 text-red-400 border border-red-950/30'}`}>
                  {feedback.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{feedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full bg-zinc-100 hover:bg-white text-zinc-950 px-5 py-2.5 rounded-xl transition-all font-bold uppercase tracking-wider text-sm disabled:opacity-50"
              >
                {authMode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {loading ? 'Authenticating...' : authMode === 'login' ? 'Log In' : 'Create Account'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Statistics for {year}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl flex items-center justify-between col-span-1 md:col-span-2">
            <div>
              <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-1">Total Coasters Ridden</p>
              <p className="text-4xl font-black text-zinc-100">{stats.globalTotal}</p>
            </div>
            <div className="text-5xl opacity-10">🎢</div>
          </div>

          {Object.entries(stats.parkTotals).map(([parkKey, total]) => (
            <div key={parkKey} className="bg-zinc-900/10 border border-zinc-900 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-zinc-400 font-bold uppercase tracking-wider text-xs">{PARK_INFO[parkKey as keyof typeof PARK_INFO].name}</p>
                <p className="text-2xl font-bold text-zinc-200 mt-1">{total}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
