"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Clock3, Instagram, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactCards = [
  {
    title: "Ubicación",
    value: "12 de Febrero 926, Pitrufquen, Novena region",
    href: null,
    icon: MapPin,
  },
  {
    title: "WhatsApp",
    value: "+56 9 8772 8500",
    href: "https://wa.me/56987728500",
    icon: MessageCircle,
  },
  {
    title: "Email",
    value: "Centrointegral.essenza@gmail.com",
    href: "mailto:Centrointegral.essenza@gmail.com",
    icon: Mail,
  },
  {
    title: "Instagram",
    value: "@essenza.centrointegral",
    href: "https://www.instagram.com/essenza.centrointegral?igsh=czR0NXFnMHl1bzR5",
    icon: Instagram,
  },
];

export default function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const API = process.env.NEXT_PUBLIC_API_URL;

  async function enviarCorreo() {
    try {
      if (!nombre || !email || !mensaje) {
        return toast.error("Completa todos los campos para enviar tu mensaje.");
      }

      const res = await fetch(`${API}/correo/contacto`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, email, mensaje }),
        mode: "cors",
        cache: "no-cache",
      });

      if (!res.ok) {
        return toast.error("No se pudo enviar tu solicitud. Intenta nuevamente.");
      }

      const respuestaBackend = await res.json();

      if (respuestaBackend.message === true) {
        setNombre("");
        setEmail("");
        setMensaje("");
        return toast.success("Tu consulta fue enviada correctamente.");
      }

      return toast.error("Correo no válido. Verifica e intenta otra vez.");
    } catch (error) {
      console.error(error);
      return toast.error("Ocurrió un error inesperado. Intenta nuevamente.");
    }
  }

  return (
    <main className="bg-transparent text-[#fff4ee]">
      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(247,205,212,0.2),transparent_34%),radial-gradient(circle_at_88%_2%,rgba(226,182,120,0.16),transparent_42%)]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-6 md:px-10 lg:grid-cols-[1fr_1.05fr] xl:px-12 xl:gap-14">
          <aside className="rounded-[2rem] border border-[#f4d7c8]/16 bg-[linear-gradient(160deg,rgba(67,40,34,0.55)_0%,rgba(28,17,14,0.85)_100%)] p-7 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.55)] backdrop-blur md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f0d7cb]/72">
              Contacto
            </p>
            <h1 className="mt-4 text-4xl leading-[1.02] text-[#fff1e9] sm:text-5xl">
              Agenda tu atencion en Centro Integral ESSENZA.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#f7e0d5]/82 sm:text-base">
              Te orientamos sobre medicina, psicologia, nutricion, fonoaudiologia, cosmetologia y terapias complementarias.
            </p>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-[#f0d5ca]/68 sm:text-sm">
              Nuestro equipo te acompana en cada etapa con atencion cercana y seguimiento profesional.
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {contactCards.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8dcc8]/18 text-[#fde9dd]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f3d9cc]/68">
                      {item.title}
                    </p>
                    <p
                      className={[
                        "mt-2 min-w-0 text-sm font-medium leading-relaxed text-[#ffefe5]",
                        item.title === "Email" ? "break-all" : "break-words",
                      ].join(" ")}
                    >
                      {item.value}
                    </p>
                  </>
                );

                if (item.href) {
                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                      className="rounded-2xl border border-[#f3d7ca]/16 bg-[#f9ddca]/8 p-5 transition hover:-translate-y-0.5 hover:border-[#f5dece]/28"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-[#f3d7ca]/16 bg-[#f9ddca]/8 p-5"
                  >
                    {content}
                  </article>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl border border-[#f3d7ca]/16 bg-[#f9ddca]/8 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f1d8cb]/70">
                Horario de atención
              </p>
              <div className="mt-3 flex items-start gap-3 text-sm text-[#f7e0d5]/82">
                <Clock3 className="mt-0.5 h-4 w-4 text-[#f0d7ca]/74" />
                <div className="space-y-1.5">
                  <p>Lunes a Viernes: 9:00 a 19:00</p>
                  <p>Sábado: 10:00 a 14:00</p>
                  <p>Domingo: Cerrado</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-[#f4d7c8]/16 bg-[linear-gradient(160deg,rgba(64,38,33,0.6)_0%,rgba(25,15,13,0.9)_100%)] p-7 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.55)] md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f0d7cb]/72">
              Formulario de contacto
            </p>
            <h2 className="mt-4 text-3xl leading-tight text-[#fff1e9] sm:text-4xl">
              Cuentanos tu caso y te responderemos a la brevedad.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#f6dfd3]/82">
              Indicanos si prefieres respuesta por WhatsApp, correo o llamada telefonica.
            </p>

            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                enviarCorreo();
              }}
            >
              <div className="space-y-2">
                <label htmlFor="nombre" className="text-sm font-medium text-[#f7e0d5]/86">
                  Nombre
                </label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Camila Perez"
                  className="h-11 rounded-xl border-[#f0d2c3]/30 bg-[#f7dcc8]/10 text-[#fff1e8] placeholder:text-[#f2d6c8]/55"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[#f7e0d5]/86">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej: correo@ejemplo.com"
                  className="h-11 rounded-xl border-[#f0d2c3]/30 bg-[#f7dcc8]/10 text-[#fff1e8] placeholder:text-[#f2d6c8]/55"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="mensaje" className="text-sm font-medium text-[#f7e0d5]/86">
                  Mensaje
                </label>
                <Textarea
                  id="mensaje"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Escribe tu consulta..."
                  className="min-h-[150px] rounded-xl border-[#f0d2c3]/30 bg-[#f7dcc8]/10 text-[#fff1e8] placeholder:text-[#f2d6c8]/55"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-[#f8dcc5]/45 bg-[linear-gradient(135deg,#f7dfcc_0%,#e7b27c_100%)] px-7 py-3 text-sm font-semibold text-[#2f1a12] transition hover:brightness-105"
              >
                Enviar mensaje
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
