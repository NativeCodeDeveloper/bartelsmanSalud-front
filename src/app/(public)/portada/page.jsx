"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const fallbackSlides = [
  {
    id: "fallback-1",
    image: "/fondoverde.png",
    alt: "SaludB atencion domiciliaria",
    badge: "SaludB",
    title: "Atencion integral a domicilio con coordinacion clinica real.",
    text: "Acompanamos a pacientes y familias con un equipo interdisciplinario que trabaja de forma coordinada y personalizada.",
  },
  {
    id: "fallback-2",
    image: "/logo_transparent.png",
    alt: "Atencion domiciliaria SaludB",
    badge: "Region Metropolitana",
    title: "Reducimos barreras de acceso para mejorar calidad de vida.",
    text: "Llevamos atencion de salud al hogar para evitar traslados innecesarios y favorecer la continuidad del cuidado.",
  },
];

const ENABLE_LOGO_HERO = false;

export default function Portada() {
  const [dataPortada, setDataPortada] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
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

  const defaultHeroSlides = dataPortada
    .filter((portada) => Number(portada.estadoPublicacionPortada ?? 1) === 1)
    .map((portada) => ({
      id: portada.id_publicacionesPortada ?? portada.tituloPortadaCarrusel,
      image: `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${portada.imagenPortada}/portada`,
      alt: portada.tituloPortadaCarrusel,
      badge: "SaludB",
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
    <section id="inicio" className="relative -mt-24 min-h-[100svh] scroll-mt-24 overflow-hidden md:-mt-28">
      <div className="relative min-h-[100svh]" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
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
              <img
                src={imageErrors[slide.id] ? "/fondoverde.png" : slide.image}
                alt={slide.alt}
                className="absolute inset-0 h-full w-full object-cover object-center"
                onError={() =>
                  setImageErrors((current) => ({
                    ...current,
                    [slide.id]: true,
                  }))
                }
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(35,199,173,0.16),transparent_34%),linear-gradient(180deg,rgba(4,17,15,0.52)_0%,rgba(6,22,20,0.72)_52%,rgba(6,22,20,0.84)_100%)]" />

              <div className="absolute inset-0 flex items-center justify-center px-6 pt-24 pb-24 text-center md:px-12 md:pt-28">
                <div className="mx-auto max-w-5xl rounded-3xl border border-white/20 bg-black/20 px-5 py-8 backdrop-blur-[2px] sm:px-8 sm:py-10">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/88" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}>
                    {slide.badge}
                  </p>
                  <h1 className="mt-5 text-balance text-4xl leading-[1.02] tracking-[0.02em] sm:text-5xl lg:text-6xl" style={{ color: "#ffffff", textShadow: "0 8px 30px rgba(0,0,0,0.45)" }}>
                    Salud integral a domicilio para cada etapa del cuidado.
                  </h1>
                  <h2 className="mx-auto mt-4 max-w-3xl text-balance text-xl font-medium leading-tight tracking-[0.01em] sm:text-2xl lg:text-3xl" style={{ color: "#ebfffa", textShadow: "0 6px 24px rgba(0,0,0,0.42)" }}>
                    {slide.title}
                  </h2>
                  <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 tracking-[0.01em] sm:text-base" style={{ color: "#e8fff8", textShadow: "0 5px 18px rgba(0,0,0,0.38)" }}>
                    {slide.text}
                  </p>

                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      href="/agendaProfesionales"
                      aria-label="Agendar evaluacion"
                      className="inline-flex w-full justify-center rounded-full border border-[#23c7ad] bg-[#23c7ad] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition duration-300 ease-out hover:bg-[#1cae97] sm:w-auto"
                    >
                      Agendar evaluacion
                    </Link>
                    <Link
                      href="/servicios"
                      aria-label="Ver servicios integrales"
                      className="inline-flex w-full justify-center rounded-full border border-white/45 bg-white/18 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition duration-300 ease-out hover:bg-white/26 sm:w-auto"
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
                  activeIndex === index ? "w-8 bg-[#23c7ad]" : "w-2.5 bg-white/55 hover:bg-white/85",
                ].join(" ")}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Slide anterior"
              onClick={goPrev}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white transition duration-300 hover:bg-black/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Siguiente slide"
              onClick={goNext}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white transition duration-300 hover:bg-black/50"
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
    <section id="inicio" className="relative -mt-24 min-h-[100svh] scroll-mt-24 overflow-hidden md:-mt-28">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/fondoverde.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 22% 16%, rgba(255,255,255,0.28), transparent 40%), radial-gradient(circle at 88% 14%, rgba(255,255,255,0.2), transparent 42%)",
        }}
      />

      <div className="relative flex min-h-[100svh] items-center justify-center px-0 pt-24 pb-10 md:pt-28">
        <div
          className={[
            "flex w-full flex-col items-center transition-all duration-[1400ms] ease-[cubic-bezier(0.2,0.75,0.16,1)]",
            logoVisible ? "translate-y-0 scale-100 opacity-100 blur-0" : "translate-y-10 scale-[0.9] opacity-0 blur-[3px]",
          ].join(" ")}
        >
          <div className="w-full px-2 sm:px-6 lg:px-10">
            <Image
              src="/logofull.png"
              alt="SaludB"
              width={2200}
              height={1100}
              priority
              className="mx-auto h-auto max-h-[66svh] w-full max-w-[1800px] object-contain drop-shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
            />
          </div>

          <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:px-6 lg:px-10">
            <Link
              href="/agendaProfesionales"
              aria-label="Agendar evaluacion"
              className="inline-flex w-full justify-center rounded-full border border-[#d2b27f]/55 bg-[linear-gradient(135deg,#e6cfaa_0%,#d9b07b_100%)] px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#2f1a12] transition duration-300 ease-out hover:brightness-105 sm:w-auto"
            >
              Agendar evaluacion
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
