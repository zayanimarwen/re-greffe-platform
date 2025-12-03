// app/app/components/JournalCard.tsx
"use client";

import { useEffect, useState } from "react";

type JournalEntry = {
  id: string;
  date: string;
  mood: number | null;
  fatigue: number | null;
  sleepQuality: number | null;
  notes: string | null;
};

export function JournalCard() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mood, setMood] = useState("3");
  const [fatigue, setFatigue] = useState("3");
  const [sleepQuality, setSleepQuality] = useState("3");
  const [notes, setNotes] = useState("");

  async function loadJournal() {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/journal?days=7");
      if (!res.ok) throw new Error("Erreur chargement journal");
      const data = await res.json();
      setEntries(data);
    } catch (e) {
      setError("Impossible de charger le journal.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJournal();
  }, []);

  const last = entries.length > 0 ? entries[entries.length - 1] : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: Number(mood),
          fatigue: Number(fatigue),
          sleepQuality: Number(sleepQuality),
          notes: notes || null,
        }),
      });

      if (!res.ok) throw new Error("Erreur sauvegarde journal");
      await loadJournal();
    } catch (_e) {
      setError("Erreur lors de l&apos;enregistrement du ressenti.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-800">Ressenti du jour</h2>

      {loading ? (
        <p className="mt-2 text-xs text-slate-500">Chargement...</p>
      ) : last ? (
        <div className="mt-2 space-y-1 text-xs text-slate-600">
          <p>
            <span className="font-semibold">Dernier enregistrement :</span>{" "}
            {new Date(last.date).toLocaleDateString()}
          </p>
          <p>Humeur : {last.mood ?? "—"}/5</p>
          <p>Fatigue : {last.fatigue ?? "—"}/5</p>
          <p>Sommeil : {last.sleepQuality ?? "—"}/5</p>
          {last.notes && <p className="italic">“{last.notes}”</p>}
        </div>
      ) : (
        <p className="mt-2 text-xs text-slate-500">
          Aucune entrée encore. Tu peux commencer par remplir ton ressenti
          d&apos;aujourd&apos;hui.
        </p>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="mt-3 grid grid-cols-3 gap-2 text-xs"
      >
        <div>
          <label className="block text-[11px] text-slate-500">Humeur</label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="1">1 - Très mauvaise</option>
            <option value="2">2</option>
            <option value="3">3 - Moyenne</option>
            <option value="4">4</option>
            <option value="5">5 - Très bonne</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-slate-500">Fatigue</label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1"
            value={fatigue}
            onChange={(e) => setFatigue(e.target.value)}
          >
            <option value="1">1 - Épuisé</option>
            <option value="2">2</option>
            <option value="3">3 - Normal</option>
            <option value="4">4</option>
            <option value="5">5 - En pleine forme</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-slate-500">Sommeil</label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1"
            value={sleepQuality}
            onChange={(e) => setSleepQuality(e.target.value)}
          >
            <option value="1">1 - Très mauvais</option>
            <option value="2">2</option>
            <option value="3">3 - Correct</option>
            <option value="4">4</option>
            <option value="5">5 - Très bon</option>
          </select>
        </div>

        <div className="col-span-3">
          <label className="block text-[11px] text-slate-500">
            Notes (symptômes, événements…)
          </label>
          <textarea
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex : petite douleur thoracique, nuit coupée, marche OK..."
          />
        </div>

        <div className="col-span-3">
          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full rounded-full border border-slate-300 py-1 font-medium text-slate-700 disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer mon ressenti du jour"}
          </button>
        </div>
      </form>
    </div>
  );
}

