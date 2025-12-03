// app/app/api/v1/vitals/route.ts
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

  const vitals = await prisma.vital.findMany({
    where: {
      userId: DEMO_USER_ID,
      measuredAt: {
        gte: since,
      },
    },
    orderBy: { measuredAt: "asc" },
  });

  return NextResponse.json(vitals);
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

  const { systolic, diastolic, heartRate, weightKg } = body;

  const vital = await prisma.vital.create({
    data: {
      userId: DEMO_USER_ID,
      measuredAt: new Date(),
      systolic: systolic ?? null,
      diastolic: diastolic ?? null,
      heartRate: heartRate ?? null,
      weightKg: weightKg ?? null,
      source: "MANUAL",
    },
  });

  return NextResponse.json(vital, { status: 201 });
}

