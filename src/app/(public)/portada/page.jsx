"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const fallbackSlides = [
  {
    id: "fallback-1",
    image: "/fondo1.png",
    alt: "Centro Integral ESSENZA",
    badge: "Centro Integral ESSENZA",
    title: "Bienestar completo con atencion profesional y cercana.",
    text: "Integramos medicina, psicologia, estetica y terapias complementarias para ayudarte a construir equilibrio entre cuerpo, mente y belleza.",
  },
  {
    id: "fallback-2",
    image: "/fondo2.png",
    alt: "Atencion personalizada en ESSENZA",
    badge: "Enfoque integral",
    title: "Experiencias de transformacion con seguimiento real.",
    text: "Cada plan es personalizado segun tus necesidades, con acompanamiento continuo y asesoria especializada para resultados sostenibles.",
  },
];

const ENABLE_LOGO_HERO = true;

export default function Portada() {
  const [dataPortada, setDataPortada] = useState([]);
  const [logoVisible, setLogoVisible] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;

  async function cargarPortada() {
    try {
      const res = await fetch(`${API}/carruselPortada/seleccionarCarruselPortada`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setDataPortada(data);
      } else {
        setDataPortada([]);
      }
    } catch (err) {
      return toast.error("No se ha podido cargar portada, contacte al administrador del sistema.");
    }
  }

  useEffect(() => {
    cargarPortada();
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setLogoVisible(true), 80);
    return () => window.clearTimeout(id);
  }, []);

  const defaultHeroSlides = dataPortada.map((portada) => ({
    id: portada.tituloPortadaCarrusel,
    image: `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${portada.imagenPortada}/portada`,
    alt: portada.tituloPortadaCarrusel,
    badge: "Centro Integral ESSENZA",
    title: portada.tituloPortadaCarrusel,
    text: portada.descripcionPublicacionesPortada,
  }));

  const safeSlides = useMemo(
    () => (defaultHeroSlides.length > 0 ? defaultHeroSlides : fallbackSlides),
    [defaultHeroSlides]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (safeSlides.length <= 1) return undefined;

    const intervalId = setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeSlides.length);
    }, 5200);

    return () => clearInterval(intervalId);
  }, [safeSlides.length]);

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + safeSlides.length) % safeSlides.length);
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % safeSlides.length);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current == null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;

    if (Math.abs(distance) > 45) {
      if (distance > 0) {
        goPrev();
      } else {
        goNext();
      }
    }

    touchStartX.current = null;
  };

  const renderLegacyCarouselHero = () => (
    <section id="inicio" className="relative -mt-24 min-h-screen scroll-mt-24 overflow-hidden text-[#fff4ee] md:-mt-28">
      <div className="relative min-h-screen" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {safeSlides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              key={slide.id}
              className={[
                "absolute inset-0 transition-opacity duration-700 ease-out",
                isActive ? "opacity-100" : "pointer-events-none opacity-0",
              ].join(" ")}
            >
              <img src={slide.image} alt={slide.alt} className="absolute inset-0 h-full w-full object-cover object-center" />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(249,213,217,0.22),transparent_32%),linear-gradient(180deg,rgba(14,9,8,0.48)_0%,rgba(15,9,8,0.74)_58%,rgba(10,7,6,0.9)_100%)]" />

              <div className="absolute inset-0 flex items-center justify-center px-6 pt-24 pb-24 text-center md:px-12 md:pt-28">
                <div className="mx-auto max-w-4xl">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[#f8ddd2]/84">{slide.badge}</p>
                  <h1 className="mt-5 text-balance text-4xl leading-[0.96] tracking-[0.03em] text-[#fff4ee] sm:text-6xl lg:text-7xl">
                    Salud integral para cuerpo, mente y belleza.
                  </h1>
                  <h2 className="mx-auto mt-5 max-w-3xl text-balance text-2xl font-medium leading-tight tracking-[0.02em] text-[#ffe9de]/96 sm:text-3xl lg:text-4xl">
                    {slide.title}
                  </h2>
                  <p className="mx-auto mt-6 max-w-3xl text-base leading-8 tracking-[0.02em] text-[#f5dfd4]/90 sm:text-lg">
                    {slide.text}
                  </p>

                  <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      href="/agendaProfesionales"
                      aria-label="Agendar hora"
                      className="inline-flex w-full justify-center rounded-full border border-[#f6dcc8]/45 bg-[linear-gradient(135deg,#f7dfcc_0%,#e7b27c_100%)] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#2f1a12] transition duration-300 ease-out hover:brightness-105 sm:w-auto"
                    >
                      Reservar atencion
                    </Link>
                    <Link
                      href="/servicios"
                      aria-label="Ver servicios integrales"
                      className="inline-flex w-full justify-center rounded-full border border-[#f7ddd0]/40 bg-[#2f1e18]/56 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffece2] transition duration-300 ease-out hover:bg-[#3b251e]/70 sm:w-auto"
                    >
                      Ver especialidades
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        <div className="absolute inset-x-0 bottom-7 z-20 flex items-center justify-between px-4 sm:px-8 md:px-12">
          <div className="flex items-center gap-2">
            {safeSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Mostrar slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={[
                  "h-2.5 rounded-full transition-all duration-300",
                  activeIndex === index ? "w-8 bg-[#ffe8de]" : "w-2.5 bg-[#f3dad0]/50 hover:bg-[#fde7dd]/80",
                ].join(" ")}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Slide anterior"
              onClick={goPrev}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#f5dbc9]/34 bg-[#1f1310]/60 text-[#ffe9df] transition duration-300 hover:bg-[#2d1c17]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Siguiente slide"
              onClick={goNext}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#f5dbc9]/34 bg-[#1f1310]/60 text-[#ffe9df] transition duration-300 hover:bg-[#2d1c17]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  if (!ENABLE_LOGO_HERO) {
    return renderLegacyCarouselHero();
  }

  // Legacy hero preserved for rollback:
  // return renderLegacyCarouselHero();
  return (
    <section id="inicio" className="relative -mt-24 h-screen scroll-mt-24 overflow-hidden md:-mt-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#dddddb_0%,#e7e3da_40%,#ece6db_76%,#dfd9cf_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(255,255,255,0.74),transparent_38%),radial-gradient(circle_at_88%_14%,rgba(234,220,194,0.55),transparent_40%)]" />

      <div className="relative flex h-screen items-center justify-center px-5 pt-24 pb-10 md:pt-28">
        <div
          className={[
            "flex w-full max-w-[min(1040px,92vw)] flex-col items-center transition-all duration-[1400ms] ease-[cubic-bezier(0.2,0.75,0.16,1)]",
            logoVisible ? "translate-y-0 scale-100 opacity-100 blur-0" : "translate-y-10 scale-[0.9] opacity-0 blur-[3px]",
          ].join(" ")}
        >
          <Image
            src="/logofull.png"
            alt="Centro Integral ESSENZA"
            width={1600}
            height={900}
            priority
            className="h-auto max-h-[62vh] w-full object-contain drop-shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
          />

          <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/agendaProfesionales"
              aria-label="Agendar hora"
              className="inline-flex w-full justify-center rounded-full border border-[#d2b27f]/55 bg-[linear-gradient(135deg,#e6cfaa_0%,#d9b07b_100%)] px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#2f1a12] transition duration-300 ease-out hover:brightness-105 sm:w-auto"
            >
              Reservar atencion
            </Link>
            <Link
              href="/servicios"
              aria-label="Ver servicios integrales"
              className="inline-flex w-full justify-center rounded-full border border-[#b99f7a]/45 bg-[#6e5b45]/12 px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#6f5128] transition duration-300 ease-out hover:bg-[#6e5b45]/20 sm:w-auto"
            >
              Ver especialidades
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
