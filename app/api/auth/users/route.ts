import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";

// GET /api/auth/users - Récupérer tous les utilisateurs
export async function GET() {
  const db = await readDb();
  return NextResponse.json({ ok: true, data: db.users || [] });
}