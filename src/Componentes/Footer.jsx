import Link from "next/link";
import { ArrowRight, Globe, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const footerLinks = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Modelo integral", href: "/#porque-elegirnos" },
  { label: "Atencion coordinada", href: "/#servicios" },
  { label: "Cobertura", href: "/#casos-clinicos" },
  { label: "Servicios", href: "/servicios" },
  { label: "Contacto", href: "/contacto" },
];

const serviceHighlights = [
  "Kinesiologia",
  "Terapia ocupacional",
  "Fonoaudiologia",
  "Medicina general y geriatria",
  "Enfermeria y TENS",
  "Cuidadores y podologia",
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/saludb.cl",
    icon: Instagram,
  },
  {
    label: "Sitio web",
    href: "https://www.saludb.cl",
    icon: Globe,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/56985278325",
    icon: MessageCircle,
  },
];

export default function FooterPremiumMedico() {
  return (
    <footer id="footer" className="relative overflow-hidden border-t border-[#c8efe5] bg-[#f8fffd] text-[#0f3f3a]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(35,199,173,0.1),transparent_35%),radial-gradient(circle_at_86%_12%,rgba(35,199,173,0.06),transparent_36%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-14 md:px-8 lg:px-10">
        <div className="grid gap-10 border-b border-[#c8efe5] pb-10 lg:grid-cols-12 lg:gap-8">
          <section className="lg:col-span-5">
            <img
              src="/logo_transparent.png"
              alt="Logo SaludB"
              width={92}
              height={92}
              className="h-[76px] w-[76px] object-contain"
            />

            <h3 className="mt-5 max-w-md text-3xl font-semibold leading-tight tracking-tight text-[#0f3f3a] sm:text-4xl">
              Cuidado integral en casa, coordinado por un solo equipo.
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#2a6d66]">
              Acompanamos a pacientes y familias con una red interdisciplinaria que organiza cada paso del proceso de atencion domiciliaria.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/agendaProfesionales"
                className="inline-flex items-center gap-2 rounded-full border border-[#23c7ad] bg-[#23c7ad] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1cae97]"
              >
                Agendar evaluacion
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-[#8fe4d4] bg-transparent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#146d60] transition hover:bg-[#effcf8]"
              >
                Hablar con el equipo
              </Link>
            </div>
          </section>

          <section className="lg:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#46a898]">Navegacion</p>
            <nav aria-label="Links del pie de pagina" className="mt-4">
              <ul className="space-y-2.5">
                {footerLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="inline-flex text-sm tracking-[0.05em] text-[#2a6d66] transition hover:text-[#0f3f3a]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="mt-7 text-[11px] uppercase tracking-[0.22em] text-[#46a898]">Servicios clave</p>
            <ul className="mt-4 space-y-2">
              {serviceHighlights.map((item) => (
                <li key={item} className="text-sm text-[#2a6d66]">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="lg:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#46a898]">Contacto</p>

            <div className="mt-4 space-y-3 text-sm text-[#2a6d66]">
              <a href="tel:+56985278325" className="inline-flex items-center gap-2 transition hover:text-[#0f3f3a]">
                <Phone className="h-4 w-4" />
                +56 9 8527 8325
              </a>
              <a href="mailto:Contacto@saludb.cl" className="flex items-center gap-2 transition hover:text-[#0f3f3a]">
                <Mail className="h-4 w-4" />
                Contacto@saludb.cl
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Region Metropolitana (sin direccion fisica)
              </div>
            </div>

            <div className="mt-6 text-sm text-[#2a6d66]">
              <p className="font-semibold uppercase tracking-[0.12em] text-[#158a78]">Horario de atencion</p>
              <p className="mt-2">Lunes a Viernes: 08:00 a 21:30</p>
              <p>Sabados: 09:00 a 13:00 (segun disponibilidad)</p>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c8efe5] bg-transparent text-[#1cae97] transition hover:bg-[#effcf8] hover:text-[#158a78]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-[11px] text-[#46a898] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Bartelsman Salud Integral a Casa. Todos los derechos reservados.</p>
          <a
            href="https://nativecode.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold uppercase tracking-[0.16em] text-[#158a78] underline decoration-[#8fe4d4] underline-offset-2 transition hover:text-[#0f3f3a]"
          >
            Desarrollado por nativecode.cl
          </a>
        </div>
      </div>
    </footer>
  );
}
