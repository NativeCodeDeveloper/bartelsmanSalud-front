"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Enfoque integral", href: "/#porque-elegirnos" },
  { label: "Especialidades", href: "/#servicios" },
  { label: "Resultados", href: "/#casos-clinicos" },
  { label: "Servicios", href: "/servicios" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId = null;

    const updateProgress = () => {
      const y = window.scrollY || 0;
      const next = Math.min(y / 240, 1);

      setScrollProgress((current) => {
        if (Math.abs(current - next) < 0.01) return current;
        return next;
      });
      rafId = null;
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const topAlpha = 0.02 + scrollProgress * 0.82;
  const middleAlpha = 0.01 + scrollProgress * 0.74;
  const bottomAlpha = scrollProgress * 0.62;
  const borderAlpha = scrollProgress * 0.24;
  const shadowAlpha = scrollProgress * 0.2;
  const blurPx = scrollProgress * 22;
  const borderWidth = scrollProgress > 0.02 ? 1 : 0;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,border-color,border-width,backdrop-filter] duration-300"
      style={{
        background: `linear-gradient(180deg, rgba(244,236,224,${topAlpha}) 0%, rgba(236,226,210,${middleAlpha}) 48%, rgba(230,217,197,${bottomAlpha}) 100%)`,
        borderBottomColor: `rgba(172, 135, 92, ${borderAlpha})`,
        borderBottomStyle: "solid",
        borderBottomWidth: `${borderWidth}px`,
        boxShadow: `0 16px 36px -26px rgba(0,0,0,${shadowAlpha})`,
        backdropFilter: `blur(${blurPx}px) saturate(130%)`,
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 md:h-24 md:px-8 lg:px-6">
        <Link href="/#inicio" aria-label="Ir al inicio" className="group flex shrink-0 items-center gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <Image
              src="/logofull.png"
              alt="Logo Centro Integral ESSENZA"
              width={84}
              height={84}
              priority
              className="h-[60px] w-[60px] object-contain sm:h-[72px] sm:w-[72px]"
            />
          </div>
        </Link>

        <nav aria-label="Menu principal" className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-9">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-[14px] font-medium uppercase tracking-[0.22em] text-[#6c5133]/88 transition-colors duration-300 hover:text-[#4a2f13]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/agendaProfesionales"
            aria-label="Agendar hora"
            className="hidden rounded-full border border-[#f5d7be]/45 bg-[linear-gradient(135deg,#f6deca_0%,#e7b987_100%)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#311a12] transition duration-300 ease-out hover:brightness-105 sm:inline-flex sm:px-5 sm:py-2.5 sm:text-xs"
          >
            Agendar hora
          </Link>

          <button
            type="button"
            aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d7bea0]/45 bg-[#f7ebda]/74 text-[#6d5232] transition hover:bg-[#f2e0c9] sm:h-10 sm:w-10 lg:hidden"
          >
            {isOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>

      <div
        className={[
          "overflow-hidden border-t border-[#dcc6a9]/35 bg-[#f2e5d4]/92 backdrop-blur-xl lg:hidden",
          isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
          "transition-all duration-300 ease-out",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 sm:gap-2 sm:px-5 sm:py-5 md:px-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-transparent px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6c5133]/92 transition duration-300 hover:border-[#d8c0a4]/45 hover:bg-[#ead6bc]/38 sm:text-xs"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/agendaProfesionales"
            onClick={() => setIsOpen(false)}
            aria-label="Agendar hora desde menu movil"
            className="mt-2 rounded-lg border border-[#f7dcc3]/45 bg-[linear-gradient(135deg,#f7dfcc_0%,#e7b07b_100%)] px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2f1a12] transition duration-300 hover:brightness-105 sm:text-xs"
          >
            Agendar hora
          </Link>
        </div>
      </div>
    </header>
  );
}
