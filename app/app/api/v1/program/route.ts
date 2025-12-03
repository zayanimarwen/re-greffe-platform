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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const program = await prisma.program.findFirst({
    where: { isDefault: true },
  });

  if (!program) {
    return NextResponse.json(
      { error: "No default program found. Call /api/v1/program/init first." },
      { status: 400 }
    );
  }

  const session = await prisma.session.findFirst({
    where: {
      userId: DEMO_USER_ID,
      programId: program.id,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
    orderBy: { date: "asc" },
  });

  if (!session) {
    return NextResponse.json(
      { message: "Aucune séance planifiée pour aujourd'hui." },
      { status: 200 }
    );
  }

  return NextResponse.json({
    id: session.id,
    phaseNumber: session.phaseNumber,
    weekNumber: session.weekNumber,
    date: session.date,
    type: session.type,
    modality: session.modality,
    plannedDurationMin: session.plannedDurationMin,
    intensityHint: session.intensityHint,
  });
}

