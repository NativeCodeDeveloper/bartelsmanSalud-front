"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Inicio", href: "/dashboard" },
  { label: "Calendario General", href: "/dashboard/calendarioGeneral" },
  { label: "Ingreso Agendamientos", href: "/dashboard/calendario" },
  { label: "Estado de Reservaciones", href: "/dashboard/agendaCitas" },
  { label: "Ingreso de Pacientes", href: "/dashboard/GestionPaciente" },
  { label: "Carpeta del paciente", href: "/dashboard/FichaClinica" },
  { label: "Publicaciones", href: "/dashboard/publicaciones" },
  { label: "Carrusel de Portada", href: "/dashboard/portadaEdit" },
];

const sections = [
  { title: "Principal", items: [links[0]] },
  { title: "Agenda Clínica", items: [links[1], links[2], links[3]] },
  { title: "Registros Clínicos", items: [links[4], links[5]] },
  { title: "Administración Web", items: [links[6], links[7]] },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden sticky top-0 z-40">
      {/* Top bar */}
      <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-400 to-blue-900">
              <span className="text-[10px] font-bold text-white leading-none">AC</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">AgendaClinica</span>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[52px] bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
          {/* Menu panel */}
          <div className="absolute left-0 right-0 z-50 mx-3 mt-1 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
            <nav className="p-3 space-y-3">
              {sections.map((section) => (
                <div key={section.title}>
                  <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    {section.title}
                  </div>
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Volver al sitio */}
              <div className="border-t border-slate-100 pt-2">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-cyan-600 hover:bg-cyan-50 transition-all"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                  </svg>
                  Volver al sitio
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
