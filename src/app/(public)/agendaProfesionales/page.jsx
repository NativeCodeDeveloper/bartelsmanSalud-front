"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AgendaProfesionales() {
  const API = process.env.NEXT_PUBLIC_API_URL || "https://bartelsmansalud.nativecode.cl";
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
    <div className="relative min-h-screen overflow-hidden px-4 py-24 text-[#eafff9] sm:px-6 sm:py-32 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          backgroundImage: "url('/fondoverde.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,26,23,0.3)_0%,rgba(6,26,23,0.38)_58%,rgba(6,26,23,0.44)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.12),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(138,223,206,0.14),transparent_34%)]" />

      <div className="mx-auto max-w-6xl">
        <div className="animate-reveal-up text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/82">
            Agenda SaludB
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Equipo Profesional
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/90">
            Selecciona un profesional para revisar disponibilidad y coordinar una primera evaluacion domiciliaria.
          </p>
          <div className="mx-auto mt-6 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/72" />
            <div className="h-1 w-1 rounded-full bg-white/82" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/72" />
          </div>
        </div>

        <div className="animate-reveal-up-delay mt-16 grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listaProfesionales.map((profesional, index) => (
            <button
              key={profesional.id_profesional}
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => irAgendaProfesional(profesional.id_profesional)}
              className="animate-reveal-up group relative flex min-h-[248px] w-full flex-col overflow-hidden rounded-3xl border border-[#8adfce]/78 bg-white p-7 opacity-0 text-left shadow-[0_20px_44px_-24px_rgba(15,90,82,0.3)] ring-1 ring-[#d8f6ef] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#34cdb4] hover:shadow-[0_26px_52px_-24px_rgba(15,90,82,0.36)] sm:p-8"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#34cdb4]/0 blur-3xl transition-all duration-500 group-hover:bg-[#34cdb4]/20" />
              <div className="absolute left-0 top-0 h-[3px] w-0 bg-gradient-to-r from-[#34cdb4]/90 to-[#8adfce]/60 transition-all duration-500 group-hover:w-full" />

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#8adfce]/42 bg-[#d8f6ef]/58 text-base font-bold text-[#1a756a] transition-all duration-500 group-hover:border-[#34cdb4]/52 group-hover:bg-[#c8eee5]/68">
                {profesional.nombreProfesional?.charAt(0)}
              </div>

              <h2 className="mt-5 text-lg font-semibold tracking-[0.01em] text-[#0f5a52]">
                {profesional.nombreProfesional}
              </h2>
              <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-[#2b7268]/88">
                {profesional.descripcionProfesional}
              </p>

              <div className="mt-6 flex w-full items-center justify-between border-t border-[#bfeee3]/36 pt-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1f8f7d] transition-colors duration-300 group-hover:text-[#0f5a52]">
                  Ver agenda
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#8adfce]/42 bg-[#d8f6ef]/54 transition-all duration-300 group-hover:border-[#34cdb4]/56 group-hover:bg-[#c8eee5]/66">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#1a756a] transition-all duration-300 group-hover:translate-x-px group-hover:text-[#0f5a52]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="hero-wave" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,320L24,314.7C48,309,96,299,144,293.3C192,288,240,288,288,293.3C336,299,384,309,432,277.3C480,245,528,171,576,154.7C624,139,672,181,720,202.7C768,224,816,224,864,218.7C912,213,960,203,1008,208C1056,213,1104,235,1152,218.7C1200,203,1248,149,1296,160C1344,171,1392,245,1416,282.7L1440,320L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
