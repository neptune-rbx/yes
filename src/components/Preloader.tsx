import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PARKS } from '../data/parks';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const images = Object.values(PARKS)
      .flat()
      .map((r) => r.img);

    let loaded = 0;
    const total = images.length;

    if (total === 0) {
      onComplete();
      return;
    }

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loaded += 1;
        setProgress(Math.round((loaded / total) * 100));
        if (loaded === total) {
          setTimeout(onComplete, 500); // slight delay to show 100%
        }
      };
    });
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-zinc-100"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className="flex flex-col items-center space-y-4">
        <span className="text-6xl">🎢</span>
        <h1 className="text-2xl font-bold tracking-widest uppercase text-zinc-200">East Coaster Tracker</h1>
        <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden mt-4">
          <motion.div
            className="h-full bg-zinc-200"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>
        <p className="text-sm text-zinc-500 font-mono mt-2">{progress}%</p>
      </div>
    </motion.div>
  );
}
