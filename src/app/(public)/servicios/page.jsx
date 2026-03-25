"use client";

import Link from "next/link";

const servicios = [
  "Atencion medica general",
  "Medicina familiar",
  "Atencion psicologica para ninos y adultos",
  "Atencion nutricional completa",
  "Fonoaudiologia y apoyo en problemas del habla infantil",
  "Lavado de oidos y otoscopia",
  "Cosmetologia y limpiezas faciales",
  "Tratamientos faciales antiedad, acne e hiperpigmentacion",
  "Tratamientos esteticos corporales reductivos y reafirmantes",
  "Masajes relajacion, descontracturante, terapeutico y drenaje linfatico",
  "Auriculoterapia",
  "Terapias holisticas",
];

export default function ServicioPage() {
  return (
    <main className="bg-transparent text-[#5d462d]">
      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-24 md:px-10 md:pb-24 md:pt-28 xl:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7750]/74">
          Servicios
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl leading-tight text-[#4f361d] sm:text-5xl">
          Especialidades integrales para tu salud, bienestar y equilibrio.
        </h1>
        <p className="mt-7 max-w-3xl text-base leading-relaxed text-[#6b5233]/86">
          En Centro Integral ESSENZA integramos psicologia, medicina y estetica para ofrecer atencion personalizada con resultados visibles y sostenibles.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-7 px-6 pb-28 md:grid-cols-2 md:px-10 md:pb-32 xl:grid-cols-3 xl:px-12">
        {servicios.map((servicio, index) => (
          <article
            key={servicio}
            className="group rounded-3xl border border-[#d8bc9d]/36 bg-[linear-gradient(170deg,rgba(253,246,236,0.94)_0%,rgba(243,230,211,0.9)_100%)] p-7 shadow-[0_16px_36px_-24px_rgba(122,91,55,0.26)] transition hover:-translate-y-0.5 hover:border-[#cfa780]/42"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8e6e47]/70">
              Servicio {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-4 text-xl leading-snug text-[#553b20]">{servicio}</h2>
            <p className="mt-5 text-sm leading-relaxed text-[#6b5233]/84">
              Atencion profesional con enfoque humano, planificacion individual y acompanamiento continuo.
            </p>
          </article>
        ))}
      </section>

      <section className="border-t border-[#d8bc9d]/34 bg-transparent">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-center md:px-10 md:py-20 xl:px-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7750]/72">
              Siguiente paso
            </p>
            <h3 className="mt-4 text-3xl leading-tight text-[#4f361d]">
              Agenda una evaluacion y recibe orientacion personalizada.
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contacto"
              className="rounded-full border border-[#f8dcc5]/45 bg-[linear-gradient(135deg,#f7dfcc_0%,#e7b27c_100%)] px-7 py-3 text-sm font-semibold text-[#2f1a12] transition hover:brightness-105"
            >
              Solicitar cita
            </Link>
            <a
              href="https://wa.me/56987728500"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#d8bc9d]/42 bg-[#f6e9d8]/72 px-7 py-3 text-sm font-medium text-[#5b4228] transition hover:border-[#cfa780]/56"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
