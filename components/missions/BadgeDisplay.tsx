import type { Badge } from "@/lib/types";
interface Props { badges: Badge[]; badgesDebloques: string[]; }
export function BadgeDisplay({ badges, badgesDebloques }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {badges.map(b => {
        const ok = badgesDebloques.includes(b.id);
        return (
          <div key={b.id} title={ok ? b.description : "Complète la mission pour débloquer"}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${ok ? "border-accent-border bg-accent-soft" : "border-border opacity-40 grayscale"}`}
          >
            <span className="text-xl">{b.emoji}</span>
            <span className="text-xs font-medium text-text leading-tight">{b.nom}</span>
          </div>
        );
      })}
    </div>
  );
}
