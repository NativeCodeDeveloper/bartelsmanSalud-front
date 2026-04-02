"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AgendaProfesionales() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [listaProfesionales, setListaProfesionales] = useState([]);

  function irAgendaProfesional(id_profesional) {
    router.push(`/agendaEspecificaProfersional/${id_profesional}`);
  }

  async function seleccionarProfesionales() {
    try {
      const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      const dataProfesionales = await res.json();
      setListaProfesionales(dataProfesionales);
    } catch {
      return toast.error("No ha sido posible listar profesionales, contacte a soporte IT");
    }
  }

  useEffect(() => {
    seleccionarProfesionales();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-24 text-[#5d462d] sm:px-6 sm:py-32 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(244,199,212,0.22),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(229,184,124,0.2),transparent_34%),linear-gradient(180deg,rgba(228,223,213,0.5)_0%,rgba(236,231,220,0.66)_100%)]" />

      <div className="mx-auto max-w-5xl">
        <div className="animate-reveal-up text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9a7750]/74">
            Agenda SaludB
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#4f361d] sm:text-5xl lg:text-6xl">
            Equipo Profesional
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[#6b5233]/84">
            Selecciona un profesional para revisar disponibilidad y coordinar una primera evaluacion domiciliaria.
          </p>
          <div className="mx-auto mt-6 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d2aa7f]/54" />
            <div className="h-1 w-1 rounded-full bg-[#c89a67]/72" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d2aa7f]/54" />
          </div>
        </div>

        <div className="animate-reveal-up-delay mt-16 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listaProfesionales.map((profesional, index) => (
            <button
              key={profesional.id_profesional}
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => irAgendaProfesional(profesional.id_profesional)}
              className="animate-reveal-up group relative flex w-full flex-col overflow-hidden rounded-3xl border border-[#d8bc9d]/35 bg-[linear-gradient(170deg,rgba(253,246,236,0.94)_0%,rgba(243,230,211,0.9)_100%)] p-7 opacity-0 text-left shadow-[0_16px_36px_-24px_rgba(122,91,55,0.26)] transition-all duration-500 hover:-translate-y-1 hover:border-[#cfa780]/42 sm:p-8"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#e8be90]/0 blur-3xl transition-all duration-500 group-hover:bg-[#e8be90]/14" />
              <div className="absolute left-0 top-0 h-[2px] w-0 bg-gradient-to-r from-[#d9b186]/70 to-[#e8d0b2]/45 transition-all duration-500 group-hover:w-full" />

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#cfab83]/28 bg-[#ecd2ad]/32 text-base font-bold text-[#8a653a] transition-all duration-500 group-hover:border-[#bf9568]/40 group-hover:bg-[#e9c49b]/46">
                {profesional.nombreProfesional?.charAt(0)}
              </div>

              <h2 className="mt-5 text-base font-semibold tracking-wide text-[#553b20]">
                {profesional.nombreProfesional}
              </h2>
              <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-[#6b5233]/82">
                {profesional.descripcionProfesional}
              </p>

              <div className="mt-6 flex w-full items-center justify-between border-t border-[#d8bc9d]/36 pt-5">
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a663d] transition-colors duration-300 group-hover:text-[#6f4d28]">
                  Ver agenda
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d4b38f]/36 bg-[#efdbc0]/42 transition-all duration-300 group-hover:border-[#bf9568]/44 group-hover:bg-[#e8c7a1]/48">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#7a5a35] transition-all duration-300 group-hover:translate-x-px group-hover:text-[#5f411f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
