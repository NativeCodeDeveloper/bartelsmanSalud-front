import { MessageCircle } from "lucide-react";

export default function WhatsAppFloatButton() {
  return (
    <a
      href="https://wa.me/56987728500"
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir WhatsApp de Centro Integral ESSENZA"
      className="fixed bottom-5 right-5 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#f5dccb]/45 bg-[linear-gradient(145deg,#6b3f31_0%,#d6a16d_100%)] text-[#1f0f0b] shadow-[0_18px_45px_-20px_rgba(215,160,100,0.75)] transition duration-300 ease-out hover:scale-105 hover:brightness-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
