import { useState, useMemo } from 'react';
import { PARKS, PARK_INFO } from '../data/parks';
import { Minus, Plus, Star, Zap, Ruler, Navigation, Calendar } from 'lucide-react';
import { useTracker } from '../hooks/useTracker';
import { cn } from '../utils/cn';

const PARK_KEYS = Object.keys(PARKS);

const PARK_SHORT_NAMES: Record<string, string> = {
  "dorney park": "Dorney Park",
  "six flags": "Six Flags",
  "wildwood": "Wildwood",
  "cedar point": "Cedar Point"
};

export function ParksTab({ tracker, year }: { tracker: ReturnType<typeof useTracker>; year: number }) {
  const [selectedPark, setSelectedPark] = useState<string>(PARK_KEYS[0]);
  
  const rides = PARKS[selectedPark];
  const info = PARK_INFO[selectedPark as keyof typeof PARK_INFO];

  const totalRides = useMemo(() => {
    return rides.reduce((acc, ride) => acc + (tracker.state.counts[`${ride.id}_${year}`] || 0), 0);
  }, [rides, tracker.state.counts, year]);

  return (
    <div className="flex flex-col space-y-6 sm:space-y-8 animate-in">
      {/* Park Tabs - Horizontal scroll on mobile */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="flex gap-2 border-b border-zinc-900 pb-2 min-w-min sm:min-w-0 sm:flex-wrap">
          {PARK_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setSelectedPark(key)}
              className={cn(
                "px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors rounded-t-lg whitespace-nowrap shrink-0 sm:shrink",
                selectedPark === key
                  ? "bg-zinc-900 text-zinc-100 border-b-2 border-zinc-400"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
              )}
            >
              {PARK_SHORT_NAMES[key] || key}
            </button>
          ))}
        </div>
      </div>

      {/* Park Banner */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-zinc-900/40 p-4 sm:p-6 rounded-2xl border border-zinc-900/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-100">{info.name}</h2>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-1">{info.desc}</p>
        </div>
        <div className="text-left md:text-right flex flex-col md:items-end justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Rides in {year}</span>
          <span className="text-3xl sm:text-4xl font-black text-zinc-100">{totalRides}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {rides.map((ride, idx) => {
          const count = tracker.state.counts[`${ride.id}_${year}`] || 0;
          return (
            <div key={ride.id} className="group flex flex-col bg-zinc-900/30 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-800 transition-colors">
              <div className="relative h-40 sm:h-48 overflow-hidden bg-zinc-950">
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 bg-zinc-950/80 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-zinc-900 text-xs font-bold text-zinc-300">
                  #{idx + 1}
                </div>
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 bg-zinc-950/80 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-zinc-900 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  {ride.type}
                </div>
                <img
                  src={ride.img}
                  alt={ride.alt}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
              </div>

              <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3 sm:gap-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-100 leading-tight">{ride.name}</h3>
                  <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded border border-zinc-900 shrink-0">
                    <Star className="w-3 h-3 text-zinc-400 fill-zinc-400" />
                    <span className="text-xs font-medium text-zinc-300">{ride.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs sm:text-sm text-zinc-400">
                  <div className="flex items-center gap-2"><Zap className="w-3 sm:w-4 h-3 sm:h-4 text-zinc-500 shrink-0" /> <span className="truncate">{ride.speed}</span></div>
                  <div className="flex items-center gap-2"><Navigation className="w-3 sm:w-4 h-3 sm:h-4 text-zinc-500 shrink-0" /> <span className="truncate">{ride.height}</span></div>
                  <div className="flex items-center gap-2"><Ruler className="w-3 sm:w-4 h-3 sm:h-4 text-zinc-500 shrink-0" /> <span className="truncate">{ride.length}</span></div>
                  <div className="flex items-center gap-2"><Calendar className="w-3 sm:w-4 h-3 sm:h-4 text-zinc-500 shrink-0" /> <span className="truncate">{ride.year}</span></div>
                </div>

                <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between border-t border-zinc-900/60">
                  <span className="text-xs sm:text-sm font-medium text-zinc-500 uppercase tracking-wider">Times Ridden</span>
                  <div className="flex items-center gap-2 sm:gap-3 bg-zinc-950 rounded-full border border-zinc-900 p-1">
                    <button
                      onClick={() => tracker.decrementCount(ride.id, year)}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors disabled:opacity-50 active:bg-zinc-800"
                      disabled={count === 0}
                    >
                      <Minus className="w-3 sm:w-4 h-3 sm:h-4" />
                    </button>
                    <span className="w-6 text-center font-bold text-zinc-100 text-sm">{count}</span>
                    <button
                      onClick={() => tracker.incrementCount(ride.id, year)}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors active:bg-zinc-800"
                    >
                      <Plus className="w-3 sm:w-4 h-3 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
