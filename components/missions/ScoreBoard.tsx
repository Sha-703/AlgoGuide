"use client";
import type { Badge } from "@/lib/types";
interface Props { score: number; badge: Badge; onContinuer: () => void; }
export function ScoreBoard({ score, badge, onContinuer }: Props) {
  return (
    <div className="flex flex-col items-center text-center py-8 space-y-5 animate-fade-up">
      <div className="relative"><span className="text-7xl">{badge.emoji}</span>
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center font-bold">✓</span>
      </div>
      <div><div className="text-5xl font-bold text-accent font-mono">+{score}</div><div className="text-text-2 text-sm mt-1">points gagnés</div></div>
      <div className="bg-surface border border-accent-border rounded-xl px-6 py-4 max-w-xs w-full">
        <div className="text-xs text-text-3 uppercase tracking-wide mb-1">Badge débloqué</div>
        <div className="font-bold text-text">{badge.nom}</div>
        <div className="text-sm text-text-2 mt-1">{badge.description}</div>
      </div>
      <button onClick={onContinuer} className="px-8 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors">
        Mission suivante →
      </button>
    </div>
  );
}
