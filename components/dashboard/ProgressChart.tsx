"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { UserEleve, ProgressionEleve } from "@/lib/types";

const MOCK_WEEK = [
  { jour: "Lun", step: 0, quest: 0 },
  { jour: "Mar", step: 0, quest: 0 },
  { jour: "Mer", step: 0, quest: 0 },
  { jour: "Jeu", step: 0, quest: 0 },
  { jour: "Ven", step: 0, quest: 0 },
  { jour: "Sam", step: 0, quest: 0 },
  { jour: "Dim", step: 0, quest: 0 },
];

interface Props {
  eleves: { eleve: UserEleve; progression: ProgressionEleve }[];
}

export function ProgressChart({ eleves }: Props) {
  const data = MOCK_WEEK.map((d, i) => ({
    ...d,
    step:  eleves.length ? Math.round(eleves.reduce((s, e) => s + e.progression.algoStepPct, 0) / eleves.length * (0.7 + i * 0.05)) : 0,
    quest: eleves.length ? Math.round(eleves.reduce((s, e) => s + e.progression.algoQuestPct, 0) / eleves.length * (0.5 + i * 0.07)) : 0,
  }));

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-card h-full">
      <h3 className="font-semibold text-text mb-0.5">Progression de la classe</h3>
      <p className="text-xs text-text-2 mb-5">Score moyen · 7 derniers jours ({eleves.length} élève{eleves.length > 1 ? "s" : ""})</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="jour" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11, color: "#6B7280" }} />
          <Line type="monotone" dataKey="step"  name="AlgoStep"  stroke="#16A34A" strokeWidth={2} dot={{ fill: "#16A34A", r: 3 }} />
          <Line type="monotone" dataKey="quest" name="AlgoQuest" stroke="#2563EB" strokeWidth={2} dot={{ fill: "#2563EB", r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
