"use client";
import { FloatingWhatsApp } from "react-floating-whatsapp";

export default function WhatsAppButton() {
    return (
        <FloatingWhatsApp
            phoneNumber="+56987728500"
            accountName="Centro Integral ESSENZA"
            avatar="/logodifort.png" // opcional: logo o imagen en public/
            statusMessage=""
            chatMessage="Hola, gracias por contactar a Centro Integral ESSENZA. ¿En que podemos ayudarte?"
            placeholder="Escribe tu mensaje..."
            notification
            notificationSound
        />
    );
}
