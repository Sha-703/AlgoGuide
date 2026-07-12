"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout, getCurrentUser } from "@/lib/auth";
import type { UserEnseignant } from "@/lib/types";

export function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const user     = getCurrentUser();

  if (!user) return null;

  const isEnseignant = user.role === "enseignant";
  const links = isEnseignant
    ? [{ href: "/dashboard", label: "Dashboard", emoji: "📊" }]
    : [
        { href: "/simulateur", label: "AlgoStep",  emoji: "⚡" },
        { href: "/missions",   label: "AlgoQuest", emoji: "🎯" },
      ];

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <nav className="sticky top-0 z-40 bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={isEnseignant ? "/dashboard" : "/simulateur"} className="flex items-center gap-2 group">
          <span className="text-base">🧮</span>
          <span className="font-bold text-text text-sm group-hover:text-accent transition-colors">AlgoGuide</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-accent-soft text-accent"
                  : "text-text-2 hover:text-text hover:bg-border-soft"
              }`}
            >
              <span className="text-base">{link.emoji}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-text leading-none">{user.prenom} {user.nom}</div>
            {isEnseignant && (
              <div className="text-xs text-text-3 mt-0.5">
                {(user as UserEnseignant).ecole} · code : <span className="font-mono text-accent">{(user as UserEnseignant).code}</span>
              </div>
            )}
            {!isEnseignant && (
              <div className="text-xs text-text-3 mt-0.5">{user.ecole} · {user.classe}</div>
            )}
          </div>
          <div className="w-7 h-7 rounded-full bg-accent-soft border border-accent-border flex items-center justify-center text-accent text-xs font-bold shrink-0">
            {user.prenom?.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-text-3 hover:text-danger transition-colors border border-border rounded-lg px-2.5 py-1.5"
          >
            Quitter
          </button>
        </div>
      </div>
    </nav>
  );
}
