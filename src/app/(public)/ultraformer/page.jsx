"use client";

import Image from "next/image";
import Link from "next/link";

const beneficios = [
  "Atencion en domicilio sin traslados innecesarios",
  "Planificacion personalizada por caso",
  "Coordinacion activa entre profesionales",
  "Mayor continuidad en tratamientos",
  "Apoyo claro para paciente y familia",
  "Seguimiento funcional sostenido",
];

export default function UltraformerPage() {
  return (
    <main className="bg-slate-950 text-white">
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-20 pt-24 md:px-10 md:pb-24 md:pt-28 lg:grid-cols-[1.15fr_1fr] lg:items-center xl:px-12 xl:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Coordinacion clinica
          </p>
          <h1 className="mt-5 text-4xl leading-tight sm:text-5xl">Evaluacion domiciliaria con enfoque integral</h1>
          <p className="mt-7 text-sm leading-relaxed text-slate-300 sm:text-base">
            En SaludB utilizamos evaluacion clinica estructurada para definir prioridades y coordinar acciones entre distintas disciplinas.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-base">
            Nuestro modelo busca reducir barreras de acceso, evitar traslados innecesarios y sostener un seguimiento continuo en el hogar.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-base">
            Cada evaluacion se adapta al caso individual para definir objetivos realistas y un plan de atencion personalizado.
          </p>

          <Link
            href="/contacto"
            className="mt-10 inline-flex rounded-full bg-white px-7 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
          >
            Solicitar evaluacion
          </Link>
        </div>

        <div className="relative aspect-[6/5] overflow-hidden rounded-[2rem] border border-white/20 bg-slate-900 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.85)]">
          <Image
            src="/ultraformer.avif"
            alt="Tecnologia para evaluacion integral"
            fill
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </div>
      </section>

      <section className="border-t border-white/15 bg-slate-900/60">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-24 xl:px-12">
          <h2 className="text-3xl leading-tight text-white sm:text-4xl">Beneficios clave</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {beneficios.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-sm text-slate-200"
              >
                {item}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
