import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEMO_USER_ID = process.env.DEMO_USER_ID || "";

function getBaseDate(): Date {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  return base;
}

type SessionTemplate = {
  dayOffset: number; // offset in days from base date
  type: "CARDIO";
  modality:
    | "WALK"
    | "TREADMILL"
    | "BIKE"
    | "POOL_WALK"
    | "POOL_SWIM"
    | "AQUABIKE"
    | "RUN";
  duration: number; // minutes
  intensityHint?: string;
};

function getWeeklyTemplate(week: number): SessionTemplate[] {
  if (week <= 3) {
    // Phase 1 : base lente
    return [
      {
        dayOffset: 0,
        type: "CARDIO",
        modality: "WALK",
        duration: 15,
        intensityHint: "Marche très tranquille, tu dois pouvoir parler.",
      },
      {
        dayOffset: 2,
        type: "CARDIO",
        modality: "BIKE",
        duration: 10,
        intensityHint: "Vélo très léger, sans essoufflement.",
      },
      {
        dayOffset: 4,
        type: "CARDIO",
        modality: "WALK",
        duration: 15,
        intensityHint: "Marche confortable, sans douleur.",
      },
    ];
  } else if (week <= 6) {
    // Phase 2 : progression cardio + piscine douce
    return [
      {
        dayOffset: 0,
        type: "CARDIO",
        modality: "WALK",
        duration: 20,
        intensityHint: "Marche soutenue mais toujours confortable.",
      },
      {
        dayOffset: 2,
        type: "CARDIO",
        modality: "BIKE",
        duration: 15,
        intensityHint: "Vélo doux, cadence régulière.",
      },
      {
        dayOffset: 4,
        type: "CARDIO",
        modality: "TREADMILL",
        duration: 20,
        intensityHint: "Tapis plat, pas de montée.",
      },
      {
        dayOffset: 6,
        type: "CARDIO",
        modality: "POOL_WALK",
        duration: 15,
        intensityHint: "Marche en piscine, très protecteur pour les articulations.",
      },
    ];
  } else if (week <= 9) {
    // Phase 3 : consolidation
    return [
      {
        dayOffset: 0,
        type: "CARDIO",
        modality: "TREADMILL",
        duration: 25,
        intensityHint: "Tapis à allure confortable.",
      },
      {
        dayOffset: 2,
        type: "CARDIO",
        modality: "BIKE",
        duration: 20,
        intensityHint: "Vélo modéré.",
      },
      {
        dayOffset: 4,
        type: "CARDIO",
        modality: "POOL_SWIM",
        duration: 20,
        intensityHint: "Nage douce, pauses fréquentes.",
      },
      {
        dayOffset: 6,
        type: "CARDIO",
        modality: "WALK",
        duration: 30,
        intensityHint: "Marche en extérieur si possible.",
      },
    ];
  } else {
    // Phase 4 : retour progressif vers une vie plus active
    return [
      {
        dayOffset: 0,
        type: "CARDIO",
        modality: "RUN",
        duration: 10,
        intensityHint:
          "Jogging très très léger, alterné avec de la marche, si validé par le cardio.",
      },
      {
        dayOffset: 2,
        type: "CARDIO",
        modality: "BIKE",
        duration: 25,
        intensityHint: "Vélo modéré.",
      },
      {
        dayOffset: 4,
        type: "CARDIO",
        modality: "POOL_SWIM",
        duration: 25,
        intensityHint: "Nage douce continue.",
      },
      {
        dayOffset: 6,
        type: "CARDIO",
        modality: "WALK",
        duration: 35,
        intensityHint: "Marche longue mais toujours confortable.",
      },
    ];
  }
}

export async function POST(_req: NextRequest) {
  if (!DEMO_USER_ID) {
    return NextResponse.json(
      { error: "DEMO_USER_ID not configured" },
      { status: 500 }
    );
  }

  // 1) Program par défaut
  let program = await prisma.program.findFirst({
    where: { isDefault: true },
  });

  if (!program) {
    program = await prisma.program.create({
      data: {
        name: "Post-greffe - 12 semaines",
        description:
          "Programme progressif sur 12 semaines après greffe cardiaque.",
        totalWeeks: 12,
        isDefault: true,
      },
    });
  }

  // 2) Phases
  const existingPhases = await prisma.phase.findMany({
    where: { programId: program.id },
  });

  if (existingPhases.length === 0) {
    await prisma.phase.createMany({
      data: [
        {
          programId: program.id,
          phaseNumber: 1,
          label: "Phase 1 - Réveil en douceur",
          startWeek: 1,
          endWeek: 3,
        },
        {
          programId: program.id,
          phaseNumber: 2,
          label: "Phase 2 - Progression cardio",
          startWeek: 4,
          endWeek: 6,
        },
        {
          programId: program.id,
          phaseNumber: 3,
          label: "Phase 3 - Consolidation",
          startWeek: 7,
          endWeek: 9,
        },
        {
          programId: program.id,
          phaseNumber: 4,
          label: "Phase 4 - Retour à la vie active",
          startWeek: 10,
          endWeek: 12,
        },
      ],
    });
  }

  // 3) Sessions pour le user démo
  const existingSessions = await prisma.session.count({
    where: {
      userId: DEMO_USER_ID,
      programId: program.id,
    },
  });

  if (existingSessions > 0) {
    return NextResponse.json(
      {
        message:
          "Les sessions existent déjà pour ce patient et ce programme. Rien à faire.",
      },
      { status: 200 }
    );
  }

  const base = getBaseDate();

  type SessionSeed = {
    userId: string;
    programId: string;
    phaseNumber: number;
    weekNumber: number;
    date: Date;
    type: "CARDIO";
    modality:
      | "WALK"
      | "TREADMILL"
      | "BIKE"
      | "POOL_WALK"
      | "POOL_SWIM"
      | "AQUABIKE"
      | "RUN";
    plannedDurationMin: number;
    intensityHint?: string;
  };

const allSessionsData: SessionSeed[] = [];


  const allSessionsData: any[] = [];

  for (let week = 1; week <= 12; week++) {
    const weeklyTemplate = getWeeklyTemplate(week);

    for (const tpl of weeklyTemplate) {
      const date = new Date(base);
      // semaine = offset de 7 jours * (week - 1) + offset dans la semaine
      date.setDate(base.getDate() + (week - 1) * 7 + tpl.dayOffset);

      allSessionsData.push({
        userId: DEMO_USER_ID,
        programId: program.id,
        phaseNumber:
          week <= 3 ? 1 : week <= 6 ? 2 : week <= 9 ? 3 : 4,
        weekNumber: week,
        date,
        type: tpl.type,
        modality: tpl.modality,
        plannedDurationMin: tpl.duration,
        intensityHint: tpl.intensityHint,
      });
    }
  }

  await prisma.session.createMany({
    data: allSessionsData,
  });

  return NextResponse.json(
    {
      message: "Programme 12 semaines initialisé pour le patient démo.",
      sessionsCreated: allSessionsData.length,
    },
    { status: 201 }
  );
}

