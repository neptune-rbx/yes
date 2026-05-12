import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = 'https://ridesbackend.anthonykummerling.workers.dev';

type TrackerState = {
  counts: Record<string, number>;
  tiers: Record<string, string>;
  profile: { name: string; pic: string; selectedYear: number };
};

type Session = {
  username: string;
  token: string;
} | null;

export type SyncState = 'idle' | 'syncing' | 'synced' | 'error' | 'not-authenticated';

export function useTracker() {
  // Local session state
  const [session, setSession] = useState<Session>(() => {
    const saved = localStorage.getItem('coaster_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Main counts & profile state
  const [state, setState] = useState<TrackerState>(() => {
    const saved = localStorage.getItem('east_coaster_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      counts: {},
      tiers: {},
      profile: { name: '', pic: 'https://cdn141.picsart.com/321556657089211.png', selectedYear: new Date().getFullYear() },
    };
  });

  const [syncState, setSyncState] = useState<SyncState>(session ? 'idle' : 'not-authenticated');
  const [authError, setAuthError] = useState<string | null>(null);

  // Save session & state to localStorage
  useEffect(() => {
    if (session) {
      localStorage.setItem('coaster_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('coaster_session');
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem('east_coaster_data', JSON.stringify(state));
  }, [state]);

  // Pull counts from Cloudflare Worker
  const pullCounts = useCallback(async (user: string) => {
    setSyncState('syncing');
    try {
      const res = await fetch(`${API_BASE}/counts?user=${encodeURIComponent(user)}`);
      const data = await res.json();
      if (data.ok) {
        setState((s) => ({
          ...s,
          counts: { ...s.counts, ...data.counts },
        }));
        setSyncState('synced');
      } else {
        setSyncState('error');
      }
    } catch (e) {
      setSyncState('error');
    }
  }, []);

  // Sync session on mount / update
  useEffect(() => {
    if (session) {
      pullCounts(session.username);
    } else {
      setSyncState('not-authenticated');
    }
  }, [session, pullCounts]);

  // Push single count changes to Cloudflare Worker
  const pushCountQueue = useRef<Record<string, number>>({});
  const pushTimeout = useRef<NodeJS.Timeout | null>(null);

  const pushPendingCounts = useCallback(async () => {
    if (!session) return;
    const queue = { ...pushCountQueue.current };
    pushCountQueue.current = {};
    
    setSyncState('syncing');
    try {
      for (const [rideId, count] of Object.entries(queue)) {
        await fetch(`${API_BASE}/counts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: session.username,
            token: session.token,
            rideId,
            count
          })
        });
      }
      setSyncState('synced');
    } catch (e) {
      setSyncState('error');
    }
  }, [session]);

  const queuePushCount = useCallback((rideId: string, count: number) => {
    if (!session) return;
    pushCountQueue.current[rideId] = count;
    if (pushTimeout.current) clearTimeout(pushTimeout.current);
    pushTimeout.current = setTimeout(pushPendingCounts, 1000);
  }, [session, pushPendingCounts]);

  const incrementCount = (id: string, year: number) => {
    const key = `${id}_${year}`;
    const newCount = (state.counts[key] || 0) + 1;
    setState((s) => ({
      ...s,
      counts: { ...s.counts, [key]: newCount },
    }));
    queuePushCount(key, newCount);
  };

  const decrementCount = (id: string, year: number) => {
    const key = `${id}_${year}`;
    const current = state.counts[key] || 0;
    const newCount = Math.max(0, current - 1);
    setState((s) => ({
      ...s,
      counts: { ...s.counts, [key]: newCount },
    }));
    queuePushCount(key, newCount);
  };

  const updateTier = (id: string, tier: string) => {
    setState((s) => ({
      ...s,
      tiers: { ...s.tiers, [id]: tier },
    }));
  };

  const updateProfile = (updates: Partial<TrackerState['profile']>) => {
    setState((s) => ({
      ...s,
      profile: { ...s.profile, ...updates },
    }));
  };

  // Auth Operations
  const register = async (username: string, password: string) => {
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.ok) {
        setSession({ username: data.username, token: data.token });
        return true;
      } else {
        setAuthError(data.error || 'Registration failed');
        return false;
      }
    } catch (e) {
      setAuthError('Cannot reach server. Please check your connection.');
      return false;
    }
  };

  const login = async (username: string, password: string) => {
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.ok) {
        setSession({ username: data.username, token: data.token });
        return true;
      } else {
        setAuthError(data.error || 'Invalid credentials');
        return false;
      }
    } catch (e) {
      setAuthError('Cannot reach server. Please check your connection.');
      return false;
    }
  };

  const logout = () => {
    setSession(null);
    // Clear both counts and profile when logging out
    setState((s) => ({ 
      ...s, 
      counts: {},
      profile: { name: '', pic: 'https://cdn141.picsart.com/321556657089211.png', selectedYear: s.profile.selectedYear }
    }));
  };

  return {
    state,
    session,
    syncState,
    authError,
    incrementCount,
    decrementCount,
    updateTier,
    updateProfile,
    register,
    login,
    logout,
  };
}
