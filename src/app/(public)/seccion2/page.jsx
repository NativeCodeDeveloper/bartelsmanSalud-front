'use client'

import Link from "next/link";
import RevealOnScroll from "@/Componentes/RevealOnScroll";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function Seccion2() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [infoData, setInfoData] = useState([]);

  const fallbackServices = [
    {
      id: "srv-1",
      name: "Atencion medica general y familiar",
      description: "Evaluacion integral de salud, orientacion profesional y acompanamiento continuo.",
      image: "/fondo2.png",
    },
    {
      id: "srv-2",
      name: "Atencion psicologica para ninos y adultos",
      description: "Apoyo emocional para ansiedad, estres y procesos personales en todas las etapas.",
      image: "/fondo3.png",
    },
    {
      id: "srv-3",
      name: "Nutricion y bienestar metabolico",
      description: "Planes personalizados para mejorar habitos, energia y salud a largo plazo.",
      image: "/fondo1.png",
    },
  ];

  const services = infoData.map((item) => ({
    id: item.id_publicacionesTituloDescripcion,
    name: item.publicacionesTitulo,
    description: item.publicacionesDescripcion,
    image: `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${item.publicacionesTituloDescripcionImagen}/card`,
  }));

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
      setInfoData(data);
    } catch {
      return toast.error(`No ha sido posible cargar las imagenes del sistema contacte a soporte de NativeCode`);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const content = services.length > 0 ? services : fallbackServices;

  return (
    <section id="servicios" className="scroll-mt-24 bg-transparent py-22 text-[#5d462d] sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9a7750]/72">Especialidades integrales</p>
              <h2 className="mt-4 max-w-4xl text-balance text-4xl leading-[1] text-[#4f361d] sm:text-5xl">
                Medicina, psicologia, estetica y terapias en un mismo ecosistema de bienestar.
              </h2>
            </div>
            <Link
              href="/servicios"
              className="inline-flex justify-center rounded-full border border-[#d7b792]/48 bg-[#f2ddc2]/36 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#5b4228] transition hover:bg-[#e8cfac]/44"
            >
              Ver detalle completo
            </Link>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-4 lg:grid-cols-6">
          {content.map((service, index) => {
            const large = index === 0;
            const medium = index === 1 || index === 2;

            return (
              <RevealOnScroll
                key={service.id ?? service.name}
                delayClass={index % 2 === 0 ? "delay-100" : "delay-150"}
                className={[
                  "h-full",
                  large ? "lg:col-span-3 lg:row-span-2" : medium ? "lg:col-span-3" : "lg:col-span-2",
                ].join(" ")}
              >
                <Link
                  href="/reserva-hora"
                  aria-label={`Agendar para ${service.name}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#d8bc9c]/35 bg-[linear-gradient(180deg,rgba(252,245,234,0.95)_0%,rgba(243,230,211,0.9)_100%)] shadow-[0_16px_36px_-22px_rgba(122,91,55,0.28)] transition duration-300 ease-out hover:-translate-y-1"
                >
                  <div className={large ? "relative min-h-[20rem] flex-1 overflow-hidden" : "relative aspect-[16/10] overflow-hidden"}>
                    <img
                      src={service.image}
                      alt={service.name}
                      className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,28,20,0.03)_0%,rgba(42,28,20,0.34)_100%)]" />
                  </div>
                  <div className={large ? "p-7" : "p-5"}>
                    <h3 className={large ? "text-3xl font-medium tracking-[0.02em] text-[#573e24]" : "text-xl font-medium tracking-[0.02em] text-[#573e24]"}>
                      {service.name}
                    </h3>
                    <p className={large ? "mt-3 text-base leading-8 tracking-[0.02em] text-[#6b5233]/86" : "mt-2 text-sm leading-7 tracking-[0.02em] text-[#6b5233]/82"}>
                      {service.description || "Atencion personalizada con acompanamiento profesional y seguimiento continuo para resultados sostenibles."}
                    </p>
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
