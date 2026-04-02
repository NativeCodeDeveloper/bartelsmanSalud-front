"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Modelo integral", href: "/#porque-elegirnos" },
  { label: "Atencion coordinada", href: "/#servicios" },
  { label: "Cobertura", href: "/#casos-clinicos" },
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
        background: `linear-gradient(180deg, rgba(239,252,248,${topAlpha}) 0%, rgba(232,251,245,${middleAlpha}) 48%, rgba(220,247,239,${bottomAlpha}) 100%)`,
        borderBottomColor: `rgba(35, 199, 173, ${borderAlpha})`,
        borderBottomStyle: "solid",
        borderBottomWidth: `${borderWidth}px`,
        boxShadow: `0 12px 30px -24px rgba(15,63,58,${shadowAlpha})`,
        backdropFilter: `blur(${blurPx}px) saturate(110%)`,
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 md:h-24 md:px-8 lg:px-6">
        <Link href="/#inicio" aria-label="Ir al inicio" className="group flex shrink-0 items-center gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <Image
              src="/logo_transparent.png"
              alt="Logo SaludB"
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
                  className="text-[14px] font-medium uppercase tracking-[0.22em] text-[#146d60] transition-colors duration-300 hover:text-[#0f4b44]"
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
            aria-label="Agendar evaluacion"
            className="hidden rounded-full border border-[#23c7ad] bg-[#23c7ad] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition duration-300 ease-out hover:bg-[#1cae97] sm:inline-flex sm:px-5 sm:py-2.5 sm:text-xs"
          >
            Agendar evaluacion
          </Link>

          <button
            type="button"
            aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#8fe4d4] bg-white text-[#146d60] transition hover:bg-[#effcf8] sm:h-10 sm:w-10 lg:hidden"
          >
            {isOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>

      <div
        className={[
          "overflow-hidden border-t border-[#bcefe2] bg-[#f8fffd] backdrop-blur-xl lg:hidden",
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
              className="rounded-lg border border-transparent px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#146d60] transition duration-300 hover:border-[#bcefe2] hover:bg-[#effcf8] sm:text-xs"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/agendaProfesionales"
            onClick={() => setIsOpen(false)}
            aria-label="Agendar evaluacion desde menu movil"
            className="mt-2 rounded-lg border border-[#23c7ad] bg-[#23c7ad] px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:bg-[#1cae97] sm:text-xs"
          >
            Agendar evaluacion
          </Link>
        </div>
      </div>
    </header>
  );
}
