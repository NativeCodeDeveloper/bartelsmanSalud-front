"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RevealOnScroll from "@/Componentes/RevealOnScroll";

const FALLBACK_CASE_IMAGE = "/ac3.png";

export default function Seccion3() {
  const scrollerRef = useRef(null);
  const [imageErrors, setImageErrors] = useState({});
  const [listaPublicaciones, setListaPublicaciones] = useState([]);
  const API = process.env.NEXT_PUBLIC_API_URL;

  async function listarPublicacionesSeccion3() {
    try {
      const res = await fetch(`${API}/publicaciones/seleccionarPublicaciones`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (!res.ok) {
        console.error("No se han podido listar publicaciones.");
        setListaPublicaciones([]);
        return [];
      }

      const publicaciones = await res.json();
      setListaPublicaciones(publicaciones);
      return publicaciones;
    } catch (err) {
      console.error("Problema al consultar backend desde la vista frontend:" + err);
      setListaPublicaciones([]);
      return [];
    }
  }

  useEffect(() => {
    listarPublicacionesSeccion3();
  }, []);

  const clinicalCases = listaPublicaciones.map((publicaciones) => ({
    title: publicaciones.descripcionPublicaciones,
    image: `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${publicaciones.imagenPublicaciones_primera}/card`,
  }));

  const scrollByAmount = (direction) => {
    const container = scrollerRef.current;
    if (!container) return;

    const firstCardWidth = container.firstElementChild?.clientWidth ?? 0;
    const styles = window.getComputedStyle(container);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");
    const amount =
      firstCardWidth > 0 ? Math.round(firstCardWidth + gap) : Math.round(container.clientWidth * 0.82);
    const nextLeft = direction === "left" ? -amount : amount;

    container.scrollBy({ left: nextLeft, behavior: "smooth" });
  };

  return (
    <>
      <section id="casos-clinicos" className="scroll-mt-24 bg-transparent py-22 text-[#5d462d] sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
          <RevealOnScroll>
            <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#9a7750]/72">Experiencias y resultados</p>
                <h2 className="mt-4 max-w-4xl text-balance text-4xl leading-[1] text-[#4f361d] sm:text-5xl">
                  Historias reales de personas que eligieron un enfoque integral.
                </h2>
              </div>
              <div className="rounded-3xl border border-[#d9bea0]/35 bg-[linear-gradient(180deg,rgba(252,245,234,0.95)_0%,rgba(243,230,211,0.9)_100%)] p-5 shadow-[0_16px_36px_-22px_rgba(122,91,55,0.28)]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#8e6e47]/76">Acompanamiento</p>
                <p className="mt-2 text-sm leading-7 text-[#6a5032]/86">
                  Trabajamos con objetivos claros, seguimiento profesional y una mirada humana en cada etapa.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <div className="mt-8 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              aria-label="Desplazar resultados hacia la izquierda"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e6d0b0]/58 text-[#664b2d] transition duration-300 hover:bg-[#dbc29e]/72"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              aria-label="Desplazar resultados hacia la derecha"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e6d0b0]/58 text-[#664b2d] transition duration-300 hover:bg-[#dbc29e]/72"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollerRef} className="hide-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2">
            {clinicalCases.map((item, index) => (
              <RevealOnScroll
                key={item.title}
                className="w-[86%] shrink-0 snap-start sm:w-[66%] lg:w-[41%]"
                delayClass={index === 0 ? "delay-100" : "delay-150"}
              >
                <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#d8bc9d]/35 bg-[linear-gradient(180deg,rgba(252,245,234,0.95)_0%,rgba(243,230,211,0.9)_100%)] shadow-[0_16px_36px_-22px_rgba(122,91,55,0.28)]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={imageErrors[item.image] ? FALLBACK_CASE_IMAGE : item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover object-center"
                      onError={() =>
                        setImageErrors((current) => ({
                          ...current,
                          [item.image]: true,
                        }))
                      }
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,28,20,0.03)_0%,rgba(42,28,20,0.34)_100%)]" />
                  </div>
                  <div className="flex justify-center p-6">
                    <h3 className="text-center text-2xl font-medium leading-7 tracking-[0.02em] text-[#573e24]">
                      {item.title}
                    </h3>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="agenda" className="scroll-mt-24 bg-transparent py-20 text-[#5d462d] sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
          <RevealOnScroll>
            <div className="rounded-[2rem] border border-[#d8bc9d]/35 bg-[linear-gradient(160deg,rgba(252,245,234,0.95)_0%,rgba(243,230,211,0.9)_100%)] px-6 py-14 text-center shadow-[0_18px_40px_-24px_rgba(122,91,55,0.3)] sm:px-10">
              <p className="text-xs uppercase tracking-[0.24em] text-[#9a7750]/72">Agenda ESSENZA</p>
              <h2 className="mx-auto mt-4 max-w-3xl text-balance text-4xl leading-[1] text-[#4f361d] sm:text-5xl">
                Reserva tu evaluacion y recibe un plan integral personalizado.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 tracking-[0.02em] text-[#6a5032]/86 sm:text-base">
                Te guiamos con un enfoque completo para que avances con claridad, confianza y acompanamiento profesional constante.
              </p>
              <Link
                href="/reserva-hora"
                aria-label="Reservar hora"
                className="mt-8 inline-flex w-full max-w-xs justify-center rounded-full border border-[#f6dcc7]/45 bg-[linear-gradient(135deg,#f7dfcc_0%,#e7b27c_100%)] px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#2f1a12] transition duration-300 ease-out hover:brightness-105"
              >
                Reservar evaluacion
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
