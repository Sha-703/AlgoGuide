import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

// Fonction pour lire la DB
export async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Si la DB n'existe pas ou est corrompue, on la réinitialise
    const empty = { users: [], mdps: {}, progressions: [] };
    await fs.writeFile(DB_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }
}

// Fonction pour écrire dans la DB
export async function writeDb(data: any) {
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