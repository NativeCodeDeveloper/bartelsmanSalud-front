'use client'

import Link from "next/link";
import RevealOnScroll from "@/Componentes/RevealOnScroll";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Seccion2() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [infoData, setInfoData] = useState([]);
  const [carouselApi, setCarouselApi] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallbackServices = [
    {
      id: "srv-1",
      name: "Kinesiologia a domicilio",
      description: "Rehabilitacion funcional, manejo del dolor y mejora de movilidad con plan personalizado.",
      image: "/logo_transparent.png",
    },
    {
      id: "srv-2",
      name: "Terapia ocupacional",
      description: "Intervencion para promover independencia en actividades diarias y adaptacion del entorno.",
      image: "/logo_transparent.png",
    },
    {
      id: "srv-3",
      name: "Medicina general y geriatria",
      description: "Evaluacion, diagnostico y seguimiento clinico continuo en domicilio.",
      image: "/logo_transparent.png",
    },
  ];

  const services = infoData.map((item, index) => {
    const title = (item.publicacionesTitulo || "").trim();
    const description = (item.publicacionesDescripcion || "").trim();

    return {
      id: item.id_publicacionesTituloDescripcion,
      name: title || `Publicacion ${index + 1}`,
      description: description || "Atencion personalizada con acompanamiento profesional y seguimiento continuo para resultados sostenibles.",
      image: item.publicacionesTituloDescripcionImagen
        ? `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${item.publicacionesTituloDescripcionImagen}/card`
        : "/logo_transparent.png",
    };
  });

  async function loadServices() {
    try {
      const res = await fetch(`${API}/publicacionesTituloDetalle/seleccionarPublicacionesTituloDetalle`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (!res.ok) {
        return toast.error(`No ha sido posible cargar las imagenes del sistema contacte a soporte de NativeCode`);
      }

      const data = await res.json();
      const activeData = Array.isArray(data)
        ? data.filter((item) => Number(item.publicacionesTituloDescripcion_estado ?? 1) === 1)
        : [];
      setInfoData(activeData);
    } catch {
      return toast.error(`No ha sido posible cargar las imagenes del sistema contacte a soporte de NativeCode`);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const content = services.length > 0 ? services : fallbackServices;

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    onSelect();
    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi || content.length <= 1) return;

    const intervalId = setInterval(() => {
      carouselApi.scrollNext();
    }, 5200);

    return () => clearInterval(intervalId);
  }, [carouselApi, content.length]);

  return (
    <section id="servicios" className="relative scroll-mt-24 bg-transparent py-22 text-[#5d462d] sm:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/fondoblanco.png')",
          backgroundSize: "contain",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat",
          opacity: 0.45,
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#158a78]/80">Servicios coordinados</p>
              <h2 className="mt-4 max-w-4xl text-balance text-4xl font-semibold leading-[1.04] text-[#0f3f3a] sm:text-5xl">
                Atencion interdisciplinaria a domicilio para recuperar y mantener funcionalidad.
              </h2>
            </div>
            <Link
              href="/servicios"
              className="inline-flex justify-center rounded-full border border-[#23c7ad] bg-[#23c7ad] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#1cae97]"
            >
              Ver detalle completo
            </Link>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="mt-12">
          <div className="relative">
            <Carousel
              setApi={setCarouselApi}
              opts={{ align: "start", loop: content.length > 1 }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {content.map((service, index) => (
                  <CarouselItem
                    key={service.id ?? service.name}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <Link
                      href="/reserva-hora"
                      aria-label={`Agendar para ${service.name}`}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#bcefe2] bg-white shadow-[0_14px_34px_-24px_rgba(15,63,58,0.28)] transition duration-300 ease-out hover:-translate-y-1"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,35,31,0)_0%,rgba(7,35,31,0.34)_100%)]" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold tracking-[0.01em] text-[#0f3f3a]">
                          {service.name}
                        </h3>
                        <p className="mt-2 text-sm leading-7 tracking-[0.01em] text-[#2a6d66]">
                          {service.description || "Atencion personalizada con acompanamiento profesional y seguimiento continuo para resultados sostenibles."}
                        </p>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-2 top-[44%] -translate-y-1/2 border-[#bcefe2] bg-white text-[#158a78] hover:bg-[#effcf8] disabled:opacity-35" />
              <CarouselNext className="right-2 top-[44%] -translate-y-1/2 border-[#bcefe2] bg-white text-[#158a78] hover:bg-[#effcf8] disabled:opacity-35" />
            </Carousel>

            {content.length > 1 && (
              <div className="mt-5 flex items-center justify-center gap-2">
                {content.map((item, index) => (
                  <button
                    key={item.id ?? item.name}
                    type="button"
                    aria-label={`Ir a publicacion ${index + 1}`}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={[
                      "h-2 rounded-full transition-all duration-300",
                      currentIndex === index ? "w-7 bg-[#23c7ad]" : "w-2 bg-[#9fded2] hover:bg-[#7fd2c3]",
                    ].join(" ")}
                  />
                ))}
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
