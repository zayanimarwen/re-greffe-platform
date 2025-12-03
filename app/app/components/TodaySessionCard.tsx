"use client";

import { useEffect, useState } from "react";

type TodaySession = {
  id: string;
  phaseNumber: number;
  weekNumber: number;
  date: string;
  type: string;
  modality: string;
  plannedDurationMin: number;
  intensityHint?: string | null;
};

export function TodaySessionCard() {
  const [session, setSession] = useState<TodaySession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadSession() {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/program/today");
      if (!res.ok) throw new Error("Erreur chargement séance du jour");
      const data = await res.json();

      if (data.id) {
        setSession(data);
        setError(null);
      } else {
        setSession(null);
        setError(data.message || null);
      }
    } catch (e) {
      setError("Impossible de charger la séance du jour.");
      setSession(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSession();
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-800">Séance du jour</h2>

      {loading ? (
        <p className="mt-2 text-xs text-slate-500">Chargement...</p>
      ) : session ? (
        <div className="mt-2 space-y-1 text-xs text-slate-600">
          <p>
            <span className="font-semibold">Phase :</span>{" "}
            Phase {session.phaseNumber} — Semaine {session.weekNumber}
          </p>
          <p>
            <span className="font-semibold">Type :</span>{" "}
            {session.type.toLowerCase()} ({session.modality.toLowerCase()})
          </p>
          <p>
            <span className="font-semibold">Durée prévue :</span>{" "}
            {session.plannedDurationMin} min
          </p>
          {session.intensityHint && (
            <p className="mt-1 text-[11px] text-slate-500">
              {session.intensityHint}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-2 text-xs text-slate-500">
          {error || "Aucune séance planifiée pour aujourd'hui."}
        </p>
      )}
    </div>
  );
}

