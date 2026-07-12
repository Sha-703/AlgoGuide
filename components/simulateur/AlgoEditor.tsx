"use client";
import { useState } from "react";
import type { LigneAlgo } from "@/lib/types";

interface Props { lignes: LigneAlgo[]; ligneActive: number; onReponsesChange: (r: Record<number, string>) => void; }

export function AlgoEditor({ lignes, ligneActive, onReponsesChange }: Props) {
  const [reponses, setReponses] = useState<Record<number, string>>({});
  const handle = (id: number, v: string) => { const n = {...reponses, [id]: v}; setReponses(n); onReponsesChange(n); };

  return (
    <div className="bg-[#1E1E2E] border border-border rounded-xl overflow-hidden font-mono text-sm shadow-card">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5 bg-white/5">
        <span className="w-3 h-3 rounded-full bg-red-400/70" /><span className="w-3 h-3 rounded-full bg-yellow-400/70" /><span className="w-3 h-3 rounded-full bg-green-400/70" />
        <span className="ml-2 text-xs text-white/30">algorithme.algo</span>
      </div>
      <div className="p-4 space-y-0.5">
        {lignes.map(ligne => {
          const active = ligne.id === ligneActive + 1;
          const color = ligne.texte.startsWith("//") ? "text-white/30 italic"
            : ligne.type === "condition" ? "text-yellow-300"
            : ligne.type === "boucle" ? "text-blue-300"
            : ligne.type === "fin" ? "text-white/50"
            : ligne.texte.includes("AFFICHER") ? "text-green-300"
            : "text-white/80";
          return (
            <div key={ligne.id}
              className={`flex items-center gap-3 px-2 py-1 rounded transition-all duration-300 ${active ? "bg-accent/20 border-l-2 border-accent animate-highlight" : "border-l-2 border-transparent"}`}
              style={{ paddingLeft: `${ligne.indent * 20 + 8}px` }}
            >
              <span className="text-white/20 text-xs w-4 text-right shrink-0 select-none">{ligne.id}</span>
              {ligne.trou ? (
                <div className="flex items-center gap-2">
                  <input type="text" value={reponses[ligne.id] ?? ""} onChange={e => handle(ligne.id, e.target.value)}
                    placeholder={ligne.reponse}
                    className={`bg-white/10 border rounded px-2 py-0.5 text-xs font-mono outline-none min-w-[180px] transition-colors ${
                      reponses[ligne.id]?.trim().toLowerCase() === ligne.reponse?.toLowerCase()
                        ? "border-accent text-green-300" : "border-white/20 text-white/70 placeholder:text-white/25"
                    }`}
                  />
                  {reponses[ligne.id]?.trim().toLowerCase() === ligne.reponse?.toLowerCase() && <span className="text-accent text-xs">✓</span>}
                </div>
              ) : (
                <span className={color}>{ligne.texte}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
