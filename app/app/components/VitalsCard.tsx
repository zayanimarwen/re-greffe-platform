// app/app/components/VitalsCard.tsx
"use client";

import { useEffect, useState } from "react";

type Vital = {
  id: string;
  measuredAt: string;
  systolic: number | null;
  diastolic: number | null;
  heartRate: number | null;
  weightKg: number | null;
};

export function VitalsCard() {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [weightKg, setWeightKg] = useState("");

  async function loadVitals() {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/vitals?days=7");
      if (!res.ok) throw new Error("Erreur chargement Vitals");
      const data = await res.json();
      setVitals(data);
    } catch (e) {
      setError("Impossible de charger les constantes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVitals();
  }, []);

  const last = vitals.length > 0 ? vitals[vitals.length - 1] : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systolic: systolic ? Number(systolic) : null,
          diastolic: diastolic ? Number(diastolic) : null,
          heartRate: heartRate ? Number(heartRate) : null,
          weightKg: weightKg ? Number(weightKg) : null,
        }),
      });

      if (!res.ok) throw new Error("Erreur sauvegarde");

      // reset fields
      setSystolic("");
      setDiastolic("");
      setHeartRate("");
      setWeightKg("");

      await loadVitals();
    } catch (e) {
      setError("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-800">
        Santé du jour (Tension / Poids / FC)
      </h2>

      {loading ? (
        <p className="mt-2 text-xs text-slate-500">Chargement...</p>
      ) : last ? (
        <div className="mt-2 space-y-1 text-xs text-slate-600">
          <p>
            <span className="font-semibold">Dernière mesure :</span>{" "}
            {new Date(last.measuredAt).toLocaleString()}
          </p>
          <p>
            Tension :{" "}
            {last.systolic && last.diastolic
              ? `${last.systolic}/${last.diastolic}`
              : "—"}
          </p>
          <p>FC repos : {last.heartRate ?? "—"} bpm</p>
          <p>Poids : {last.weightKg ?? "—"} kg</p>
        </div>
      ) : (
        <p className="mt-2 text-xs text-slate-500">
          Aucune mesure pour l'instant. Ajoute-en une ci-dessous.
        </p>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="block text-[11px] text-slate-500">Tension SYS</label>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            placeholder="120"
          />
        </div>

        <div>
          <label className="block text-[11px] text-slate-500">Tension DIA</label>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            placeholder="80"
          />
        </div>

        <div>
          <label className="block text-[11px] text-slate-500">FC (bpm)</label>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            placeholder="72"
          />
        </div>

        <div>
          <label className="block text-[11px] text-slate-500">Poids (kg)</label>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            placeholder="78.5"
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full rounded-full border border-slate-300 py-1 font-medium text-slate-700 disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer une nouvelle mesure"}
          </button>
        </div>
      </form>
    </div>
  );
}

