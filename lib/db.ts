import fs from "fs/promises";
import path from "path";
// Seed statique (committé) pour amencer Redis au premier déploiement. Importé
// statiquement -> garanti d'être bundlé dans la fonction serverless (un
// fs.readFile runtime ne l'est pas, et nft ne le détecte pas toujours).
import dbSeed from "@/data/db.json";

// ─── Stockage : Upstash Redis en prod (Vercel), fichier en local ──────────────
// Le système de fichiers des fonctions serverless Vercel est en lecture seule :
// on stocke donc la "base" (un seul document JSON { users, mdps, progressions })
// dans Upstash Redis (intégration Vercel Marketplace). En local, sans les vars,
// on retombe sur le fichier data/db.json — comportement inchangé pour le dev.
//
// Au tout premier déploiement, le store Redis est vide : on l'amorce (seed) depuis
// data/db.json (le fichier committé), ce qui conserve les utilisateurs existants.
//
// Variables d'env acceptées (l'intégration Upstash injecte les premières ;
// KV_REST_API_* correspond à l'ancien client @vercel/kv, gardé pour compat) :
//   UPSTASH_REDIS_REST_URL  | KV_REST_API_URL
//   UPSTASH_REDIS_REST_TOKEN| KV_REST_API_TOKEN

const DB_PATH = path.join(process.cwd(), "data", "db.json");
const KV_KEY = "algoguide:db";
const EMPTY = { users: [], mdps: {}, progressions: [] };

function redisUrl() {
  return process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
}
function redisToken() {
  return process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
}
function hasKv(): boolean {
  return Boolean(redisUrl() && redisToken());
}

let _redis: any = null;
async function getKv() {
  if (_redis) return _redis;
  const { Redis } = await import("@upstash/redis");
  _redis = new Redis({ url: redisUrl(), token: redisToken() });
  return _redis as {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<string | null>;
  };
}

// Lecture du fichier (seed + dev local).
async function readDbFile(): Promise<any> {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    // Fichier absent ou corrompu : on réinitialise localement.
    await fs.writeFile(DB_PATH, JSON.stringify(EMPTY, null, 2));
    return EMPTY;
  }
}

// Lecture de la DB (Upstash Redis en prod Vercel, fichier en local).
export async function readDb() {
  if (hasKv()) {
    try {
      const kv = await getKv();
      const raw = await kv.get(KV_KEY);
      if (raw != null) {
        // Objet stocké tel quel -> on le renvoie directement.
        // Chaîne JSON (anciennement stringifiée) -> on parse par sécurité.
        return typeof raw === "string" ? JSON.parse(raw) : raw;
      }
      // Premier déploiement : on amorce le store Redis depuis data/db.json (committé).
      // Import statique -> le fichier est bundlé dans la fonction serverless ; un
      // fs.readFile runtime n'est pas garanti d'être inclus sur Vercel.
      await kv.set(KV_KEY, dbSeed);
      return dbSeed;
    } catch (error) {
      console.error("Redis readDb a échoué, repli sur le fichier:", error);
      return readDbFile();
    }
  }
  return readDbFile();
}

// Écriture de la DB (Upstash Redis en prod Vercel, fichier en local).
export async function writeDb(data: any) {
  if (hasKv()) {
    try {
      const kv = await getKv();
      await kv.set(KV_KEY, data);
      return;
    } catch (error) {
      console.error("Redis writeDb a échoué, repli sur le fichier:", error);
      // On tente le fichier (ne persiste pas en prod, mais évite un 500 dur).
    }
  }
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// Utilitaires pour comparer les chaînes (ignore majuscules et accents)
export function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

// ─── Users ──────────────────────────────────────────────────────────────────────
export async function getAllUsers() {
  const db = await readDb();
  return db.users;
}

export async function saveUser(user: any) {
  const db = await readDb();
  db.users.push(user);
  await writeDb(db);
}

export async function saveAllUsers(users: any[]) {
  const db = await readDb();
  db.users = users;
  await writeDb(db);
}

export async function findUserByPredicate(predicate: (u: any) => boolean) {
  const users = await getAllUsers();
  return users.find(predicate);
}

export async function findUsersByPredicate(predicate: (u: any) => boolean) {
  const users = await getAllUsers();
  return users.filter(predicate);
}

// ─── Mots de passe ──────────────────────────────────────────────────────────────
export async function getPasswords() {
  const db = await readDb();
  return db.mdps || {};
}

export async function savePassword(userId: string, password: string) {
  const db = await readDb();
  db.mdps[userId] = password;
  await writeDb(db);
}

// ─── Progressions ───────────────────────────────────────────────────────────────
export async function getAllProgressions() {
  const db = await readDb();
  return db.progressions || [];
}

export async function saveProgressionData(prog: any) {
  const db = await readDb();
  const idx = db.progressions.findIndex((p: any) => p.eleveId === prog.eleveId);
  if (idx >= 0) {
    db.progressions[idx] = prog;
  } else {
    db.progressions.push(prog);
  }
  await writeDb(db);
}

export async function saveAllProgressions(progs: any[]) {
  const db = await readDb();
  db.progressions = progs;
  await writeDb(db);
}

// ─── Utilitaires ────────────────────────────────────────────────────────────────
export function genId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function genCode(ecole: string) {
  const prefix = ecole.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "ALG";
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}
