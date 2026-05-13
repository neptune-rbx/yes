import { useState, useRef, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { ParksTab } from './components/ParksTab';
import { ProfileTab } from './components/ProfileTab';
import { TierListTab } from './components/TierListTab';
import { useTracker } from './hooks/useTracker';
import { Map, User, ListFilter, LogIn, LogOut, Settings } from 'lucide-react';
import { cn } from './utils/cn';

type Tab = 'parks' | 'profile' | 'tierlist';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('parks');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const tracker = useTracker();
  const [year, setYear] = useState(() => tracker.state.profile.selectedYear || new Date().getFullYear());
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfileMenu]);

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-zinc-100 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">🎢</span>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-widest text-zinc-100 leading-none">East Coaster</h1>
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">Tracker</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {tracker.session ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity active:opacity-60"
                >
                  {tracker.state.profile.pic ? (
                    <img src={tracker.state.profile.pic} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-zinc-800 hover:border-zinc-700 transition-colors" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500">?</div>
                  )}
                  <span className="text-sm font-medium text-zinc-400 hidden sm:block">@{tracker.session.username}</span>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-lg shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors border-b border-zinc-800/50"
                    >
                      <Settings className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        tracker.logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors active:bg-zinc-200"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'parks' && <ParksTab tracker={tracker} year={year} />}
        {activeTab === 'profile' && <ProfileTab tracker={tracker} year={year} setYear={setYear} showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />}
        {activeTab === 'tierlist' && <TierListTab tracker={tracker} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 px-4 sm:px-6 py-3 sm:py-4 pb-safe flex justify-center">
        <div className="flex items-center gap-1 sm:gap-2 bg-zinc-900/50 p-1.5 rounded-full border border-zinc-800">
          <button
            onClick={() => setActiveTab('parks')}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors active:scale-95",
              activeTab === 'parks' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Parks</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tierlist')}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors active:scale-95",
              activeTab === 'tierlist' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <ListFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Tier List</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors active:scale-95",
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
