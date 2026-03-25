import Image from "next/image";
import RevealOnScroll from "@/Componentes/RevealOnScroll";

const pillars = [
  {
    title: "Enfoque realmente integral",
    text: "Unificamos medicina, psicologia y estetica para abordar cada proceso desde la raiz y no solo los sintomas.",
    logoSrc: "/logo1.png",
  },
  {
    title: "Atencion profesional cercana",
    text: "Nuestro equipo acompana cada etapa con escucha activa, criterio clinico y seguimiento continuo.",
    logoSrc: "/logo1.png",
  },
  {
    title: "Bienestar emocional y mental",
    text: "La salud psicologica forma parte del tratamiento para lograr avances sostenibles y equilibrio real.",
    logoSrc: "/logo1.png",
  },
  {
    title: "Resultados visibles y conscientes",
    text: "Disenamos experiencias de transformacion personalizadas para potenciar tu mejor version.",
    logoSrc: "/logo1.png",
  },
];

export default function Seccion1() {
  return (
    <section id="porque-elegirnos" className="scroll-mt-24 bg-transparent py-22 text-[#5d462d] sm:py-28">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 md:px-8 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <RevealOnScroll className="lg:col-span-4">
          <div className="sticky top-28 rounded-[2rem] bg-[linear-gradient(165deg,rgba(74,46,39,0.48)_0%,rgba(26,16,13,0.9)_100%)] p-7 shadow-[0_30px_80px_-56px_rgba(228,175,110,0.55)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#f4dbcd]/68">Por que elegir ESSENZA</p>
            <h2 className="mt-4 text-balance text-4xl leading-[1] text-[#fff3ea] sm:text-5xl">
              Te atendemos de forma completa, no fragmentada.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#f6dfd4]/82 sm:text-base">
              En Centro Integral ESSENZA no ofrecemos servicios aislados. Construimos planes
              personalizados para que avances con claridad, seguimiento y resultados sostenibles.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {pillars.map((item, index) => {
            const shifted = index % 2 === 0 ? "sm:-translate-y-3" : "sm:translate-y-3";

            return (
              <RevealOnScroll key={item.title} className="h-full">
                <article
                  className={[
                    "h-full rounded-3xl border border-[#d9bea0]/35 bg-[linear-gradient(180deg,rgba(253,246,236,0.92)_0%,rgba(244,232,214,0.9)_100%)] p-6 text-[#5d452c] shadow-[0_16px_36px_-24px_rgba(126,94,58,0.32)] transition duration-300 ease-out hover:-translate-y-1",
                    shifted,
                  ].join(" ")}
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edd4b1]/45">
                    {item.logoSrc ? (
                      <Image
                        src={item.logoSrc}
                        alt="Logo Essenza"
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : null}
                  </div>
                  <h3 className="mt-5 text-2xl font-medium tracking-[0.01em] text-[#5a4127]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 tracking-[0.02em] text-[#705739]/86">{item.text}</p>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
