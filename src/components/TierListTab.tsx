import { useMemo, DragEvent, useState, TouchEvent } from 'react';
import { useTracker } from '../hooks/useTracker';
import { PARKS, type Ride } from '../data/parks';
import { cn } from '../utils/cn';
import { GripVertical } from 'lucide-react';

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

interface RideWithPosition extends Ride {
  x?: number;
  y?: number;
}

export function TierListTab({ tracker }: { tracker: ReturnType<typeof useTracker> }) {
  const { counts, tiers } = tracker.state;
  const [draggedRide, setDraggedRide] = useState<string | null>(null);
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);

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

  // Desktop drag handlers
  const handleDrop = (e: DragEvent, targetTier: string) => {
    e.preventDefault();
    const rideId = e.dataTransfer.getData('rideId');
    if (rideId) {
      tracker.updateTier(rideId, targetTier);
      setDraggedRide(null);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: DragEvent, rideId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('rideId', rideId);
    setDraggedRide(rideId);
  };

  const handleDragEnd = () => {
    setDraggedRide(null);
  };

  // Mobile touch handlers for tier assignment
  const handleRideClick = (rideId: string) => {
    setSelectedRide(selectedRide === rideId ? null : rideId);
  };

  const moveTierOnMobile = (tier: string) => {
    if (selectedRide) {
      tracker.updateTier(selectedRide, tier);
      setSelectedRide(null);
    }
  };

  // Group coasters
  const unranked = riddenCoasters.filter(r => !tiers[r.id] || tiers[r.id] === 'unranked');

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in pb-12">
      {/* Instructions */}
      <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-3 sm:mb-4">Tier List</h3>
        <p className="text-xs sm:text-sm text-zinc-500 mb-4 sm:mb-6">
          {isMobile 
            ? "Tap a coaster to select it, then tap a tier to move it. Or use long-press and drag on supported devices."
            : "Drag and drop the coasters you've ridden into the tiers below."}
        </p>
        
        <div className="flex flex-col gap-2 sm:gap-3">
          {TIERS.map(tier => {
            const coastersInTier = riddenCoasters.filter(r => tiers[r.id] === tier);
            const isHighlighted = selectedRide && riddenCoasters.find(r => r.id === selectedRide);
            
            return (
              <div 
                key={tier} 
                className={cn(
                  "flex flex-col sm:flex-row min-h-[80px] sm:min-h-[100px] bg-zinc-950/40 border rounded-xl overflow-hidden transition-all",
                  selectedRide && !coastersInTier.find(r => r.id === selectedRide)
                    ? "border-zinc-700/50 cursor-pointer hover:border-zinc-600 active:border-zinc-500"
                    : "border-zinc-900"
                )}
                onDrop={(e) => handleDrop(e, tier)}
                onDragOver={handleDragOver}
                onClick={() => selectedRide && moveTierOnMobile(tier)}
              >
                <div className={cn("w-full sm:w-24 flex items-center justify-center border-b sm:border-b-0 sm:border-r shrink-0 font-black text-2xl sm:text-3xl py-3 sm:py-0", TIER_COLORS[tier])}>
                  {tier}
                </div>
                <div className="flex-1 p-3 flex flex-wrap gap-2 sm:gap-3 items-start content-start">
                  {coastersInTier.map(ride => (
                    <div
                      key={ride.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ride.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleRideClick(ride.id)}
                      className={cn(
                        "flex flex-col items-center cursor-grab active:cursor-grabbing hover:opacity-80 transition-all relative",
                        draggedRide === ride.id && "opacity-50",
                        selectedRide === ride.id && "ring-2 ring-zinc-300 rounded-lg"
                      )}
                    >
                      <img
                        src={ride.img}
                        alt={ride.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-zinc-900 hover:scale-105 transition-transform"
                      />
                      <p className="text-xs text-zinc-400 mt-1 text-center max-w-[64px] sm:max-w-[80px] truncate">{ride.name}</p>
                      {selectedRide === ride.id && (
                        <div className="absolute -top-1 -right-1 bg-zinc-300 rounded-full p-1">
                          <GripVertical className="w-3 h-3 text-zinc-950" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unranked Section */}
      <div 
        className={cn(
          "bg-zinc-900/10 border rounded-2xl p-4 sm:p-6 min-h-[120px] transition-all",
          selectedRide && !riddenCoasters.find(r => r.id === selectedRide && !tiers[r.id])
            ? "border-zinc-700/50 cursor-pointer hover:border-zinc-600 active:border-zinc-500"
            : "border-zinc-900"
        )}
        onDrop={(e) => handleDrop(e, 'unranked')}
        onDragOver={handleDragOver}
        onClick={() => selectedRide && moveTierOnMobile('unranked')}
      >
        <h4 className="text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3 sm:mb-4">Unranked ({unranked.length})</h4>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {unranked.length === 0 && <p className="text-zinc-600 text-sm italic">All ridden coasters have been ranked.</p>}
          {unranked.map(ride => (
            <div
              key={ride.id}
              draggable
              onDragStart={(e) => handleDragStart(e, ride.id)}
              onDragEnd={handleDragEnd}
              onClick={() => handleRideClick(ride.id)}
              className={cn(
                "flex flex-col items-center cursor-grab active:cursor-grabbing hover:opacity-80 transition-all relative",
                draggedRide === ride.id && "opacity-50",
                selectedRide === ride.id && "ring-2 ring-zinc-300 rounded-lg"
              )}
            >
              <img
                src={ride.img}
                alt={ride.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-zinc-900 hover:scale-105 transition-transform"
              />
              <p className="text-xs text-zinc-400 mt-1 text-center max-w-[64px] sm:max-w-[80px] truncate">{ride.name}</p>
              {selectedRide === ride.id && (
                <div className="absolute -top-1 -right-1 bg-zinc-300 rounded-full p-1">
                  <GripVertical className="w-3 h-3 text-zinc-950" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Helper Text */}
      {selectedRide && isMobile && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-3 text-center text-xs text-zinc-300">
          📍 Select a tier above to move the coaster, or tap elsewhere to cancel
        </div>
      )}
    </div>
  );
}
