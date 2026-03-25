import Navbar from "@/Componentes/Navbar";
import FooterPremiumMedico from "@/Componentes/Footer";
import ToasterClient from "@/Componentes/ToasterClient";
import WhatsAppFloatButton from "@/Componentes/WhatsAppFloatButton";
import CarritoProvider from "@/ContextosGlobales/CarritoContext";
import ObjetoPagarProvider from "@/ContextosGlobales/ObjetoPagarContext";

export default function PublicLayout({ children }) {
  return (
    <CarritoProvider>
      <ObjetoPagarProvider>
        <div className="relative min-h-screen bg-[#e7e3da] text-[#5f4730]">
          <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_12%_8%,rgba(249,213,217,0.22),transparent_34%),radial-gradient(circle_at_88%_4%,rgba(232,190,129,0.2),transparent_36%),linear-gradient(180deg,#dddcd8_0%,#e8e4dc_38%,#ece7dd_74%,#dfd9cf_100%)]" />
          <ToasterClient />
          <Navbar />
          <main className="relative z-10 pt-24 md:pt-20">{children}</main>
          <FooterPremiumMedico />
          <WhatsAppFloatButton />
        </div>
      </ObjetoPagarProvider>
    </CarritoProvider>
  );
}
