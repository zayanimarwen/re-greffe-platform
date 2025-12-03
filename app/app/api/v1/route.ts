// app/app/api/v1/journal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEMO_USER_ID = process.env.DEMO_USER_ID || "";

export async function GET(req: NextRequest) {
  if (!DEMO_USER_ID) {
    return NextResponse.json(
      { error: "DEMO_USER_ID not configured" },
      { status: 500 }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const days = parseInt(searchParams.get("days") || "7", 10);

  const since = new Date();
  since.setDate(since.getDate() - days);

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: DEMO_USER_ID,
      date: {
        gte: since,
      },
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  if (!DEMO_USER_ID) {
    return NextResponse.json(
      { error: "DEMO_USER_ID not configured" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { mood, fatigue, sleepQuality, symptoms, notes } = body;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // on fait un upsert sur la date du jour
  const entry = await prisma.journalEntry.upsert({
    where: {
      userId_date: {
        userId: DEMO_USER_ID,
        date: today,
      },
    },
    update: {
      mood,
      fatigue,
      sleepQuality,
      symptoms: symptoms ?? null,
      notes: notes ?? null,
    },
    create: {
      userId: DEMO_USER_ID,
      date: today,
      mood,
      fatigue,
      sleepQuality,
      symptoms: symptoms ?? null,
      notes: notes ?? null,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}

