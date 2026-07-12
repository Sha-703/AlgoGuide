import type { User, UserEleve, UserEnseignant, ProgressionEleve } from "./types";

const KEY_USER = "ag_user";
const KEY_USERS_CACHE = "ag_users_cache";
const KEY_PROG_CACHE = "ag_prog_cache";

// Comparaison souple : ignore majuscules + accents
function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

// ─── Session ──────────────────────────────────────────────────────────────────
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY_USER) || "null"); } catch { return null; }
}
export function setCurrentUser(u: User) { localStorage.setItem(KEY_USER, JSON.stringify(u)); }
export function logout() { localStorage.removeItem(KEY_USER); }

// ─── API Helpers ──────────────────────────────────────────────────────────────
async function apiRequest(endpoint: string, data?: any) {
  const res = await fetch(`/api${endpoint}`, {
    method: data ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });
  return res.json();
}

// ─── Enseignant : inscription ─────────────────────────────────────────────────
export interface RegisterEnseignantData {
  nom: string; prenom: string; ecole: string; classes: string[]; motDePasse: string;
}
export async function registerEnseignant(data: RegisterEnseignantData): Promise<{ ok: boolean; error?: string; user?: UserEnseignant }> {
  // Vérifier si existe déjà
  const users = await getAllUsersFromAPI();
  const exists = users.find((u: any) =>
    u.role === "enseignant" &&
    norm(u.nom) === norm(data.nom) &&
    norm(u.ecole) === norm(data.ecole)
  );
  if (exists) return { ok: false, error: "Un enseignant avec ce nom existe déjà dans cette école." };

  const result = await apiRequest("/auth/register-enseignant", data);
  if (result.ok) {
    // Mettre à jour le cache
    await refreshUsersCache();
  }
  return result;
}

// ─── Enseignant : connexion ───────────────────────────────────────────────────
export async function loginEnseignant(nom: string, ecole: string, mdp: string): Promise<{ ok: boolean; error?: string; user?: UserEnseignant }> {
  const result = await apiRequest("/auth/login-enseignant", { nom, ecole, mdp });
  if (result.ok) {
    await refreshUsersCache();
  }
  return result;
}

// ─── Code enseignant → classes disponibles ────────────────────────────────────
export async function getClassesFromCode(code: string): Promise<{ ok: boolean; error?: string; classes?: string[] }> {
  if (!code || code.length < 3) return { ok: false, error: "Code trop court." };

  // D'abord, vérifier dans le cache local
  const users = await getAllUsersFromAPI();
  const enseignant = users.find((u: any) =>
    u.role === "enseignant" &&
    norm(u.code) === norm(code)
  );

  if (!enseignant) return { ok: false, error: "Code invalide. Vérifie-le avec ton professeur." };
  return { ok: true, classes: enseignant.classes };
}

// ─── Élève : inscription ──────────────────────────────────────────────────────
export interface RegisterEleveData {
  prenom: string; nom: string; classe: string; codeEnseignant: string;
}
export async function registerEleve(data: RegisterEleveData): Promise<{ ok: boolean; error?: string; user?: UserEleve }> {
  const result = await apiRequest("/auth/register-eleve", data);
  if (result.ok) {
    await refreshUsersCache();
    await refreshProgressionsCache();
  }
  return result;
}

// ─── Élève : connexion ────────────────────────────────────────────────────────
export async function loginEleve(prenom: string, nom: string, classe: string): Promise<{ ok: boolean; error?: string; user?: UserEleve }> {
  const result = await apiRequest("/auth/login-eleve", { prenom, nom, classe });
  return result;
}

// ─── Cache Helpers ────────────────────────────────────────────────────────────
async function getAllUsersFromAPI(): Promise<any[]> {
  // Essaye d'abord le cache, puis rafraîchit si nécessaire
  if (typeof window === "undefined") return [];

  const cache = localStorage.getItem(KEY_USERS_CACHE);
  if (cache) {
    const { data, timestamp } = JSON.parse(cache);
    // Cache valide pendant 30 secondes
    if (Date.now() - timestamp < 30000) {
      return data;
    }
  }

  // Rafraîchir le cache
  const users = await refreshUsersCache();
  return users;
}

async function refreshUsersCache() {
  if (typeof window === "undefined") return [];
  try {
    const res = await fetch("/api/auth/users");
    const result = await res.json();
    const data = result.data || result || [];
    localStorage.setItem(KEY_USERS_CACHE, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch {
    return [];
  }
}

async function refreshProgressionsCache() {
  if (typeof window === "undefined") return [];
  try {
    const res = await fetch("/api/auth/progressions");
    const result = await res.json();
    const data = result.data || result || [];
    localStorage.setItem(KEY_PROG_CACHE, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch {
    return [];
  }
}

// ─── Progression ─────────────────────────────────────────────────────────────
export async function saveProgression(prog: ProgressionEleve) {
  await apiRequest("/auth/save-progression", prog);
}

export async function getProgression(eleveId: string): Promise<ProgressionEleve | null> {
  const result = await apiRequest(`/auth/progression?eleveId=${eleveId}`);
  return result.data || result || null;
}

// ─── Récupérer les élèves d'un enseignant ─────────────────────────────────────
export async function getElevesDeEnseignant(enseignantId: string): Promise<{ eleve: UserEleve; progression: ProgressionEleve }[]> {
  const result = await apiRequest(`/auth/eleves/${enseignantId}`);
  return result.data || result || [];
}