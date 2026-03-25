// app/dashboard/layout.jsx
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import MobileNav from "./MobileNav";
import SignOutBtn from "./SignOutBtn";

export const metadata = {
    title: "Dashboard",
    description: "Panel de administración",
};

export default function DashboardLayout({ children }) {
    return (
        <ClerkProvider>
        <div className="h-screen w-full overflow-hidden bg-white">
            <div className="flex h-full w-full">
                {/* Sidebar */}
                <aside className="hidden md:flex h-screen w-[230px] shrink-0 flex-col bg-gray-900 text-white border-r border-white/[0.04] selection:bg-violet-500/30 font-[family-name:var(--font-inter)]">

                    {/* ── Brand ── */}
                    <div className="relative px-5 py-4 shrink-0">
                        <div className="relative flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/20">
                                <span className="text-[10px] font-black text-white leading-none tracking-tight">AC</span>
                            </div>
                            <div className="leading-none">
                                <div className="text-[13px] font-medium tracking-[-0.01em] text-white/90">AgendaClinica</div>
                                <div className="mt-[3px] text-[10px] font-light text-white/30">Panel admin</div>
                            </div>
                        </div>
                    </div>

                    {/* ── Navigation ── */}
                    <nav className="flex-1 px-3 py-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="space-y-4">

                            {/* — Principal — */}
                            <details className="group" open>
                                <summary className="flex items-center justify-between px-2 py-1 text-[11px] font-medium text-white/30 hover:text-white/45 transition-colors duration-200 cursor-pointer list-none select-none tracking-normal">
                                    <span>principal</span>
                                    <svg className="h-3 w-3 text-white/15 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 space-y-0.5">
                                    <Link
                                        href="/dashboard"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Inicio Panel
                                    </Link>
                                </div>
                            </details>

                            {/* — Agenda Clínica — */}
                            <details className="group">
                                <summary className="flex items-center justify-between px-2 py-1 text-[11px] font-medium text-white/30 hover:text-white/45 transition-colors duration-200 cursor-pointer list-none select-none tracking-normal">
                                    <span>Agenda clinica</span>
                                    <svg className="h-3 w-3 text-white/15 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 space-y-0.5">
                                    <Link
                                        href="/dashboard/calendarioGeneral"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Calendario General
                                    </Link>
                                    <Link
                                        href="/dashboard/calendario"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Ingreso Agendamientos
                                    </Link>
                                    <Link
                                        href="/dashboard/agendaCitas"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Estado de Reservaciones
                                    </Link>


                                    <Link
                                        href="/dashboard/bloqueosAgenda"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Bloqueos Agenda
                                    </Link>
                                </div>
                            </details>

                            {/* — Registros Clínicos — */}
                            <details className="group">
                                <summary className="flex items-center justify-between px-2 py-1 text-[11px] font-medium text-white/30 hover:text-white/45 transition-colors duration-200 cursor-pointer list-none select-none tracking-normal">
                                    <span>Registros clinicos</span>
                                    <svg className="h-3 w-3 text-white/15 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 space-y-0.5">
                                    <Link
                                        href="/dashboard/GestionPaciente"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Ingreso de Pacientes
                                    </Link>
                                    <Link
                                        href="/dashboard/FichaClinica"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Carpeta del paciente
                                    </Link>
                                </div>
                            </details>



                            {/* — Presupuesto — */}
                            <details className="group">
                                <summary className="flex items-center justify-between px-2 py-1 text-[11px] font-medium text-white/30 hover:text-white/45 transition-colors duration-200 cursor-pointer list-none select-none tracking-normal">
                                    <span>Presupuesto</span>
                                    <svg className="h-3 w-3 text-white/15 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 space-y-0.5">

                                    <Link
                                        href="/dashboard/ingresoProductos"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Tratamientos y Servicios
                                    </Link>


                                    <Link
                                        href="/dashboard/categoriasProductos"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Categorias Servicios Tratamientos
                                    </Link>

                                    <Link
                                        href="/dashboard/presupuestoTratamiento"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Generacion de Presupuesto
                                    </Link>
                                </div>
                            </details>



                            {/* — Administración Web — */}
                            <details className="group">
                                <summary className="flex items-center justify-between px-2 py-1 text-[11px] font-medium text-white/30 hover:text-white/45 transition-colors duration-200 cursor-pointer list-none select-none tracking-normal">
                                    <span>Administracion web</span>
                                    <svg className="h-3 w-3 text-white/15 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 space-y-0.5">

                                    <Link
                                        href="/dashboard/portadaEdit"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Carrusel de Portada
                                    </Link>



                                    <Link
                                        href="/dashboard/publicacionesTituloDescripcion"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Carrusel Seccion 1
                                    </Link>


                                    <Link
                                        href="/dashboard/publicaciones"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Carrusel seccion 2
                                    </Link>
                                </div>
                            </details>

                            {/* — Cobro por Consulta — */}
                            <details className="group">
                                <summary className="flex items-center justify-between px-2 py-1 text-[11px] font-medium text-white/30 hover:text-white/45 transition-colors duration-200 cursor-pointer list-none select-none tracking-normal">
                                    <span>Cobro por consulta</span>
                                    <svg className="h-3 w-3 text-white/15 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-1 space-y-0.5">
                                    <Link
                                        href="/dashboard/profesionales"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Registro de Profesionales
                                    </Link>
                                    <Link
                                        href="/dashboard/serviciosAgendamiento"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Prestaciones en Agenda
                                    </Link>
                                    <Link
                                        href="/dashboard/tarifaServicio"
                                        className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                    >
                                        <span className="h-[3px] w-[3px] rounded-full bg-white/15 group-hover/link:bg-violet-400 group-hover/link:shadow-[0_0_6px_rgba(139,92,246,0.6)] transition-all duration-200" />
                                        Cobro por Consulta
                                    </Link>
                                </div>
                            </details>

                        </div>

                        {/* ── Atajos ── */}
                        <div className="mt-6 pt-4 relative">
                            <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                            <div className="px-2 text-[11px] font-medium text-white/30 tracking-normal">Atajos</div>
                            <div className="mt-1.5 space-y-0.5">
                                <Link
                                    href="/"
                                    className="group/link flex items-center gap-2.5 rounded-md px-2 py-[6px] text-[12.5px] font-light text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all duration-200"
                                >
                                    <svg className="h-3.5 w-3.5 text-white/20 group-hover/link:text-violet-400 transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                                    </svg>
                                    Volver al sitio
                                </Link>
                                <SignOutBtn />
                            </div>
                        </div>
                    </nav>

                    {/* ── Footer status ── */}
                    <div className="relative px-3 py-3 shrink-0">
                        <div className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                        <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/[0.05] px-3 py-2.5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-light text-white/25 tracking-normal">Sistema</div>
                                    <div className="mt-0.5 text-[12px] font-light text-white/60">Operativo</div>
                                </div>
                                <div className="relative flex items-center gap-1.5">
                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-emerald-400/10 animate-ping" />
                                    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400 block shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0 h-full overflow-y-auto">
                    <MobileNav />

                    <main className="min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
        </ClerkProvider>
    );
}
