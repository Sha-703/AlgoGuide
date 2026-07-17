import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

// Lecture live depuis Redis (sinon Next prerender statique ignorant les écritures).
export const dynamic = 'force-dynamic';

// GET /api/auth/users - Récupérer tous les utilisateurs
export async function GET() {
  const db = await readDb();
  return NextResponse.json({ ok: true, data: db.users || [] });
}
