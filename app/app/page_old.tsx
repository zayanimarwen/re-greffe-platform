// app/app/page.tsx
import { VitalsCard } from "./components/VitalsCard";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 bg-zinc-50 p-4 font-sans">
      <header className="mt-6 space-y-1">
        <p className="text-xs text-slate-500">Salut 👋</p>
        <h1 className="text-xl font-semibold text-slate-900">
          Tableau de bord post-greffe
        </h1>
        <p className="text-xs text-slate-500">
          Suivi de tes constantes (tension, poids, fréquence cardiaque), de ton
          activité et de ton ressenti sur 12 semaines.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        {/* Carte connectée aux données Prisma via /api/v1/vitals */}
        <VitalsCard />

        {/* Cartes placeholder qu’on branchera plus tard */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            Séance du jour
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Bientôt : marche / tapis / vélo / piscine en fonction de ta semaine
            dans le programme.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Ressenti</h2>
          <p className="mt-1 text-xs text-slate-500">
            On ajoutera un petit journal : humeur, fatigue, sommeil, symptômes.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            Progression globale
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Plus tard : % de séances faites, moyenne tension, courbe du poids.
          </p>
        </div>
      </section>
    </main>
  );
}

