import { useMemo, DragEvent } from 'react';
import { useTracker } from '../hooks/useTracker';
import { PARKS, type Ride } from '../data/parks';
import { cn } from '../utils/cn';

const TIERS = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];

const TIER_COLORS: Record<string, string> = {
  S: 'bg-red-900/50 text-red-400 border-red-900/50',
  A: 'bg-orange-900/50 text-orange-400 border-orange-900/50',
  B: 'bg-yellow-900/50 text-yellow-400 border-yellow-900/50',
  C: 'bg-green-900/50 text-green-400 border-green-900/50',
  D: 'bg-blue-900/50 text-blue-400 border-blue-900/50',
  E: 'bg-indigo-900/50 text-indigo-400 border-indigo-900/50',
  F: 'bg-zinc-800/50 text-zinc-400 border-zinc-800/50',
};

export function TierListTab({ tracker }: { tracker: ReturnType<typeof useTracker> }) {
  const { counts, tiers } = tracker.state;

  const riddenCoasters = useMemo(() => {
    const ridden: Ride[] = [];
    Object.values(PARKS).flat().forEach(ride => {
      let total = 0;
      Object.entries(counts).forEach(([key, val]) => {
        if (key.startsWith(ride.id + '_')) total += val;
      });
      if (total > 0) ridden.push(ride);
    });
    return ridden;
  }, [counts]);

  const handleDrop = (e: DragEvent, targetTier: string) => {
    e.preventDefault();
    const rideId = e.dataTransfer.getData('rideId');
    if (rideId) {
      tracker.updateTier(rideId, targetTier);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: DragEvent, rideId: string) => {
    e.dataTransfer.setData('rideId', rideId);
  };

  // Group coasters
  const unranked = riddenCoasters.filter(r => !tiers[r.id] || tiers[r.id] === 'unranked');

  return (
    <div className="space-y-8 animate-in pb-12">
      <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-zinc-100 mb-4">Tier List</h3>
        <p className="text-sm text-zinc-500 mb-6">Drag and drop the coasters you've ridden into the tiers below.</p>
        
        <div className="flex flex-col gap-2">
          {TIERS.map(tier => {
            const coastersInTier = riddenCoasters.filter(r => tiers[r.id] === tier);
            return (
              <div 
                key={tier} 
                className="flex min-h-[100px] bg-zinc-950/40 border border-zinc-900 rounded-xl overflow-hidden"
                onDrop={(e) => handleDrop(e, tier)}
                onDragOver={handleDragOver}
              >
                <div className={cn("w-24 flex items-center justify-center border-r shrink-0 font-black text-3xl", TIER_COLORS[tier])}>
                  {tier}
                </div>
                <div className="flex-1 p-3 flex flex-wrap gap-3 items-start content-start">
                  {coastersInTier.map(ride => (
                    <img
                      key={ride.id}
                      src={ride.img}
                      alt={ride.name}
                      title={ride.name}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ride.id)}
                      className="w-20 h-20 object-cover rounded-lg border border-zinc-900 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div 
        className="bg-zinc-900/10 border border-zinc-900 rounded-2xl p-6 min-h-[200px]"
        onDrop={(e) => handleDrop(e, 'unranked')}
        onDragOver={handleDragOver}
      >
        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Unranked ({unranked.length})</h4>
        <div className="flex flex-wrap gap-3">
          {unranked.length === 0 && <p className="text-zinc-600 text-sm italic">All ridden coasters have been ranked.</p>}
          {unranked.map(ride => (
            <img
              key={ride.id}
              src={ride.img}
              alt={ride.name}
              title={ride.name}
              draggable
              onDragStart={(e) => handleDragStart(e, ride.id)}
              className="w-20 h-20 object-cover rounded-lg border border-zinc-900 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
