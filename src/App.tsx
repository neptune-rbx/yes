import { useState } from 'react';
import { Preloader } from './components/Preloader';
import { ParksTab } from './components/ParksTab';
import { ProfileTab } from './components/ProfileTab';
import { TierListTab } from './components/TierListTab';
import { useTracker } from './hooks/useTracker';
import { Map, User, ListFilter, LogIn } from 'lucide-react';
import { cn } from './utils/cn';

type Tab = 'parks' | 'profile' | 'tierlist';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('parks');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const tracker = useTracker();
  const [year, setYear] = useState(() => tracker.state.profile.selectedYear || new Date().getFullYear());

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-zinc-100 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎢</span>
            <div className="flex flex-col">
              <h1 className="text-xl font-black uppercase tracking-widest text-zinc-100 leading-none">East Coaster</h1>
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">Tracker</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {tracker.session ? (
              <>
                {tracker.state.profile.pic ? (
                  <img src={tracker.state.profile.pic} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-zinc-800" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500">?</div>
                )}
                <span className="text-sm font-medium text-zinc-400 hidden sm:block">@{tracker.session.username}</span>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white font-bold text-sm uppercase tracking-wider transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'parks' && <ParksTab tracker={tracker} year={year} />}
        {activeTab === 'profile' && <ProfileTab tracker={tracker} year={year} setYear={setYear} showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />}
        {activeTab === 'tierlist' && <TierListTab tracker={tracker} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 px-6 py-4 pb-safe flex justify-center">
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-full border border-zinc-800">
          <button
            onClick={() => setActiveTab('parks')}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-colors",
              activeTab === 'parks' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Parks</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tierlist')}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-colors",
              activeTab === 'tierlist' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <ListFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Tier List</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-colors",
              activeTab === 'profile' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
