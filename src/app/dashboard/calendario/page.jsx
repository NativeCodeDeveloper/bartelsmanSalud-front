"use client"

import {useState, useMemo, useEffect, useRef, Suspense} from "react";
import {useSearchParams} from "next/navigation";
import {Calendar, dateFnsLocalizer} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import ShadcnInput from "@/Componentes/shadcnInput2";
import ShadcnFechaHora from "@/Componentes/ShadcnFechaHora";
import ToasterClient from "@/Componentes/ToasterClient";
import {toast} from "react-hot-toast";

import es from "date-fns/locale/es";
import {InfoButton} from "@/Componentes/InfoButton";
import {SelectDinamic} from "@/Componentes/SelectDinamic";

const locales = {es: es};
const dfStartOfWeek = (date) => startOfWeek(date, {locale: es});
const localizer = dateFnsLocalizer({format, parse, startOfWeek: dfStartOfWeek, getDay, locales});
const DnDCalendar = withDragAndDrop(Calendar);

export default function Calendario() {
    return (
        <Suspense fallback={<div className="min-h-screen grid place-items-center"><span className="text-sm text-slate-400">Cargando calendario...</span></div>}>
            <CalendarioContent />
        </Suspense>
    );
}

function CalendarioContent() {

    const API = process.env.NEXT_PUBLIC_API_URL;
    const popupRef = useRef(null);
    const popupDragStateRef = useRef({dragging: false, offsetX: 0, offsetY: 0});
    const selectionGuardRef = useRef({missingProfessional: false, overlap: false});

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .rbc-calendar, .rbc-time-view, .rbc-month-view {
                border: 0 !important;
                background: transparent !important;
            }
            .rbc-toolbar {
                margin-bottom: 16px !important;
                gap: 10px !important;
            }
            .rbc-toolbar button {
                border-radius: 12px !important;
                border: 1px solid #e2e8f0 !important;
                background: #ffffff !important;
                color: #475569 !important;
                box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
            }
            .rbc-toolbar button:hover,
            .rbc-toolbar button:focus {
                background: #faf5ff !important;
                border-color: #c084fc !important;
                color: #7c3aed !important;
            }
            .rbc-toolbar button.rbc-active {
                background: linear-gradient(135deg, #9333ea, #7c3aed) !important;
                border-color: #7c3aed !important;
                color: #ffffff !important;
                box-shadow: 0 12px 24px rgba(124, 58, 237, 0.22) !important;
            }
            .rbc-header {
                padding: 12px 8px !important;
                border-bottom: 1px solid #e2e8f0 !important;
                color: #475569 !important;
                font-size: 12px !important;
                font-weight: 700 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.08em !important;
                background: rgba(248, 250, 252, 0.85) !important;
            }
            .rbc-time-header-content,
            .rbc-time-content,
            .rbc-time-view,
            .rbc-timeslot-group,
            .rbc-day-bg + .rbc-day-bg,
            .rbc-month-row + .rbc-month-row,
            .rbc-header + .rbc-header,
            .rbc-time-header-content + .rbc-time-header-content {
                border-color: #e2e8f0 !important;
            }
            .rbc-time-slot {
                transition: background-color 120ms ease !important;
            }
            .rbc-day-slot .rbc-time-slot:hover {
                background: rgba(168, 85, 247, 0.06) !important;
            }
            .rbc-today {
                background: rgba(237, 233, 254, 0.42) !important;
            }
            .rbc-current-time-indicator {
                background-color: #7c3aed !important;
                height: 2px !important;
            }
            .rbc-slot-selection {
                background: rgba(124, 58, 237, 0.22) !important;
                border: 1px solid rgba(124, 58, 237, 0.42) !important;
                border-radius: 16px !important;
                box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2) !important;
            }
            .rbc-selected-cell {
                background: rgba(124, 58, 237, 0.08) !important;
            }
            .rbc-event,
            .rbc-background-event {
                border-radius: 16px !important;
                border: 0 !important;
                box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08) !important;
            }
            .rbc-addons-dnd-resizable {
                border-radius: 16px !important;
            }
            .rbc-addons-dnd-resize-anchor {
                width: 100% !important;
                height: 6px !important;
            }
            .rbc-month-view .rbc-event {
                min-height: 28px !important; height: auto !important; padding: 6px 8px !important;
                line-height: 1.3 !important; white-space: normal !important; overflow: visible !important; word-break: break-word !important;
            }
            .rbc-time-view .rbc-event {
                min-height: 30px !important; height: auto !important; padding: 6px 8px !important;
                line-height: 1.3 !important; white-space: normal !important; overflow: visible !important; word-break: break-word !important;
            }
            .rbc-month-view .rbc-day-slot { min-height: 80px !important; }
            .rbc-row-segment { z-index: 1 !important; }
            .rbc-event-label, .rbc-event-content { white-space: normal !important; overflow: visible !important; word-break: break-word !important; }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState("week");

    const searchParams = useSearchParams();

    const [nombrePaciente, setNombrePaciente] = useState("");
    const [apellidoPaciente, setApellidoPaciente] = useState("");
    const [rut, setRut] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");

    // Precargar datos del paciente si vienen por query params
    useEffect(() => {
        const nombre = searchParams.get("nombre");
        if (nombre) setNombrePaciente(nombre);
        const apellido = searchParams.get("apellido");
        if (apellido) setApellidoPaciente(apellido);
        const rutParam = searchParams.get("rut");
        if (rutParam) setRut(rutParam);
        const tel = searchParams.get("telefono");
        if (tel) setTelefono(tel);
        const correo = searchParams.get("email");
        if (correo) setEmail(correo);
    }, []);
    const [fechaInicio, setfechaInicio] = useState("");
    const [fechaFinalizacion, setfechaFinalizacion] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFinalizacion, setHoraFinalizacion] = useState("");
    const [estadoReserva, setEstadoReserva] = useState("");
    const [id_reserva, setid_reserva] = useState(0);
    const [dataAgenda, setDataAgenda] = useState([]);
    const [dataBloqueos, setDataBloqueos] = useState([]);
    const [listaProfesionales, setListaProfesionales] = useState([]);
    const [id_profesional, setId_profesional] = useState("");
    const [selectionPreview, setSelectionPreview] = useState(null);
    const [selectionDraft, setSelectionDraft] = useState(null);
    const [floatingDraft, setFloatingDraft] = useState(null);
    const [popupPosition, setPopupPosition] = useState({x: 0, y: 0});
    const [draggingPopup, setDraggingPopup] = useState(false);
    const [popupForm, setPopupForm] = useState({
        nombrePaciente: "",
        apellidoPaciente: "",
        rut: "",
        telefono: "",
        email: "",
    });

    async function seleccionarTodosProfesionalesCalendario() {
        try {
            const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`, {
                method: 'GET',
                headers: {Accept: 'application/json'},
                mode: 'cors'
            })

            if (!res.ok) {
                return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');

            }else{
                const respustaBackend = await res.json();

                if(respustaBackend && respustaBackend.length > 0){
                    setListaProfesionales(respustaBackend);
                    if (!id_profesional) {
                        setId_profesional(respustaBackend[0].id_profesional);
                    }
                }else{
                    return toast.error('No hay profesionales o servicios ingresados en el sistema');
                }
            }
        }catch (error) {
            return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
        }
    }

    useEffect(() => {
        seleccionarTodosProfesionalesCalendario();
    }, []);




    function formatearFechaLocal(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    }

    const manejarFechaHoraInicio = (dateTime) => {
        setfechaInicio(formatearFechaLocal(dateTime));
        setHoraInicio(dateTime.toTimeString().slice(0, 8));
    };

    const manejarFechaHoraFinalizacion = (dateTime) => {
        setfechaFinalizacion(formatearFechaLocal(dateTime));
        setHoraFinalizacion(dateTime.toTimeString().slice(0, 8));
    };

    function convertirAFechaCalendario(fechaISO, hora) {
        const soloFecha = fechaISO.slice(0, 10);
        return new Date(`${soloFecha}T${hora}`);
    }

    function isOverlapping(start, end, ignoredReservaId = null) {
        // Verificar contra reservas existentes
        if (dataAgenda && dataAgenda.length > 0) {
            for (const cita of dataAgenda) {
                if (ignoredReservaId && cita.id_reserva === ignoredReservaId) continue;
                const evStart = convertirAFechaCalendario((cita.fechaInicio ?? "").slice(0, 10), (cita.horaInicio ?? "00:00:00"));
                const evEnd = convertirAFechaCalendario((cita.fechaFinalizacion ?? "").slice(0, 10), (cita.horaFinalizacion ?? "00:00:00"));
                if (start < evEnd && end > evStart) return true;
            }
        }
        // Verificar contra bloqueos existentes (expandidos por día)
        if (dataBloqueos && dataBloqueos.length > 0) {
            for (const bloqueo of dataBloqueos) {
                const horaIni = bloqueo.horaInicio ?? "00:00:00";
                const horaFin = bloqueo.horaFinalizacion ?? "23:59:00";
                const fechaIniStr = (bloqueo.fechaInicio ?? "").slice(0, 10);
                const fechaFinStr = (bloqueo.fechaFinalizacion ?? "").slice(0, 10);
                const primerDia = new Date(fechaIniStr + "T00:00:00");
                const ultimoDia = new Date(fechaFinStr + "T00:00:00");
                if (isNaN(primerDia.getTime()) || isNaN(ultimoDia.getTime())) continue;

                let cursor = new Date(primerDia);
                while (cursor <= ultimoDia) {
                    const y = cursor.getFullYear();
                    const m = String(cursor.getMonth() + 1).padStart(2, "0");
                    const d = String(cursor.getDate()).padStart(2, "0");
                    const fechaDia = `${y}-${m}-${d}`;
                    const bStart = new Date(`${fechaDia}T${horaIni}`);
                    const bEnd = new Date(`${fechaDia}T${horaFin}`);
                    if (start < bEnd && end > bStart) return true;
                    cursor = new Date(y, cursor.getMonth(), cursor.getDate() + 1, 0, 0, 0);
                }
            }
        }
        return false;
    }

    function formatHoraCorta(date) {
        return format(date, "HH:mm", {locale: es});
    }

    function formatFechaLarga(date) {
        return format(date, "EEEE d 'de' MMMM", {locale: es});
    }

    function obtenerNombreProfesionalSeleccionado() {
        return listaProfesionales.find((p) => p.id_profesional === id_profesional)?.nombreProfesional ?? "Sin profesional";
    }

    function limpiarSeleccionTemporal() {
        setSelectionPreview(null);
        setSelectionDraft(null);
        setFloatingDraft(null);
        setPopupForm({
            nombrePaciente: "",
            apellidoPaciente: "",
            rut: "",
            telefono: "",
            email: "",
        });
    }

    function abrirPopupSeleccion(slotInfo) {
        const start = slotInfo.start ?? slotInfo;
        const end = slotInfo.end ?? slotInfo;

        setfechaInicio(formatearFechaLocal(start));
        setHoraInicio(start.toTimeString().slice(0, 8));
        setfechaFinalizacion(formatearFechaLocal(end));
        setHoraFinalizacion(end.toTimeString().slice(0, 8));

        const nextDraft = {
            start,
            end,
            profesional: obtenerNombreProfesionalSeleccionado(),
        };

        setSelectionDraft(nextDraft);
        setPopupForm({
            nombrePaciente,
            apellidoPaciente,
            rut,
            telefono,
            email,
        });
        setFloatingDraft({
            id: "draft-selection",
            title: "Nuevo agendamiento",
            start,
            end,
            tipo: "seleccion",
        });

        const bounds = slotInfo?.bounds;
        const centerX = typeof window !== "undefined" ? window.innerWidth / 2 - 140 : 320;
        const centerY = typeof window !== "undefined" ? window.innerHeight / 2 - 120 : 220;

        setPopupPosition({
            x: bounds ? Math.min(bounds.left + 24, window.innerWidth - 320) : centerX,
            y: bounds ? Math.max(bounds.top - 10, 90) : centerY,
        });
    }

    function validarSeleccionPrevia(start, end, ignoredReservaId = null) {
        if (!id_profesional) {
            if (!selectionGuardRef.current.missingProfessional) {
                selectionGuardRef.current.missingProfessional = true;
                toast.error("Primero debes seleccionar un profesional.");
                setTimeout(() => {
                    selectionGuardRef.current.missingProfessional = false;
                }, 1200);
            }
            setSelectionPreview(null);
            return false;
        }

        if (isOverlapping(start, end, ignoredReservaId)) {
            if (!selectionGuardRef.current.overlap) {
                selectionGuardRef.current.overlap = true;
                toast.error("Horario no disponible. El rango se superpone con otra reserva o bloqueo.");
                setTimeout(() => {
                    selectionGuardRef.current.overlap = false;
                }, 1200);
            }
            setSelectionPreview(null);
            return false;
        }

        return true;
    }

    async function cargarDataAgenda() {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarReservados`, {
                method: "GET",
                headers: {Accept: "application/json"}
            });
            if (!res.ok) return toast.error('No fue posible cargar las agendas, Contacte a soporte de Medify');
            const data = await res.json();
            setDataAgenda(data);
        } catch (err) {
            return toast.error(err.message);
        }
    }

    async function cargarDataPorProfesional(idProf) {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarPorProfesional`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_profesional: idProf})
            });
            if (!res.ok) return toast.error('No fue posible cargar las agendas del profesional');
            const data = await res.json();
            setDataAgenda(Array.isArray(data) ? data : []);
        } catch (err) {
            return toast.error(err.message);
        }
    }

    async function cargarBloqueosPorProfesional(id_profesional) {
        try {
            const res = await fetch(`${API}/bloqueoAgenda/seleccionarBloqueosPorProfesional`, {
                method: "POST",
                headers: {Accept: "application/json",
                "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_profesional})
            });

            if (!res.ok) return;
            const data = await res.json();
            setDataBloqueos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log(err);
        }
    }

    async function refrescarCalendario() {
        if (id_profesional) {
            await cargarDataPorProfesional(id_profesional);
            await cargarBloqueosPorProfesional(id_profesional)
        }

    }

    useEffect(() => { cargarDataAgenda(); }, []);

    useEffect(() => {
        if (id_profesional) {
            cargarDataPorProfesional(id_profesional);
            cargarBloqueosPorProfesional(id_profesional);
        } else {
            cargarDataAgenda();
        }
    }, [id_profesional]);

    useEffect(() => {
        if (!draggingPopup) return;

        function handleMove(event) {
            if (!popupDragStateRef.current.dragging) return;
            setPopupPosition({
                x: Math.max(16, event.clientX - popupDragStateRef.current.offsetX),
                y: Math.max(16, event.clientY - popupDragStateRef.current.offsetY),
            });
        }

        function handleUp() {
            popupDragStateRef.current.dragging = false;
            setDraggingPopup(false);
            document.body.style.userSelect = "";
        }

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        };
    }, [draggingPopup]);
    

    async function insertarNuevaReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion,id_profesional) {
        try {
            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !horaFinalizacion || !id_profesional) {
                toast.error('Debe llenar todos los campos');
                return false;
            }
            const ahora = new Date();
            const inicio = new Date(`${fechaInicio}T${horaInicio}`);
            const final = new Date(`${fechaFinalizacion}T${horaFinalizacion}`);
            if (inicio < ahora) {
                toast.error("No es posible agendar en fechas NO vigentes");
                return false;
            }
            if (final < inicio) {
                toast.error("No es posible en fechas irreales");
                return false;
            }
            if (isOverlapping(inicio, final)) {
                toast.error('La hora seleccionada ya está ocupada (verifique otras horas)');
                return false;
            }

            if (fechaInicio === fechaFinalizacion) {
                const res = await fetch(`${API}/reservaPacientes/insertarReservaPacienteFicha`, {
                    method: "POST",
                    headers: {Accept: "application/json", "Content-Type": "application/json"},
                    mode: "cors",
                    body: JSON.stringify({nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva: "reservada" ,id_profesional})
                });
                const respuestaBackend = await res.json();
                if (respuestaBackend.message === true) {
                    setNombrePaciente(""); setApellidoPaciente(""); setTelefono(""); setRut(""); setEmail("");
                    await refrescarCalendario();
                    toast.success("Se ha ingresado correctamente el agendamiento");
                    return true;
                } else if (respuestaBackend.message === "conflicto" || respuestaBackend.message.includes("conflicto")) {
                    toast.error("No puede agendar una hora que ya esta ocupada");
                    return false;
                } else if (respuestaBackend.message === false) {
                    toast.error('Asegure que no esta ocupada la Hora');
                    return false;
                }
            } else {
                toast.error("Solo se permite agendar si es en el mismo dia");
                return false;
            }
        } catch (error) {
            console.log(error);
            toast.error('Sin respuesta del servidor contacte a soporte.');
            return false;
        }
        return false;
    }

    async function actualizarReservaDesdeCalendario(reservaOriginal, start, end) {
        if (!reservaOriginal?.id_reserva) return toast.error("No fue posible identificar la reserva a mover.");
        if (!validarSeleccionPrevia(start, end, reservaOriginal.id_reserva)) return;

        await actualizarInformacionReserva(
            reservaOriginal.nombrePaciente,
            reservaOriginal.apellidoPaciente,
            reservaOriginal.rut,
            reservaOriginal.telefono,
            reservaOriginal.email,
            formatearFechaLocal(start),
            start.toTimeString().slice(0, 8),
            formatearFechaLocal(end),
            end.toTimeString().slice(0, 8),
            reservaOriginal.estadoReserva,
            reservaOriginal.id_profesional,
            reservaOriginal.id_reserva
        );
    }

    const messages = useMemo(() => ({
        next: "Siguiente", previous: "Anterior", today: "Hoy", month: "Mes", week: "Semana", day: "Día", agenda: "Agenda", noEventsInRange: "No hay eventos",
    }), []);

    // Expande bloqueos multi-día en segmentos por día para que
    // react-big-calendar los muestre en la grilla horaria (no en all-day).
    // Cada día del rango usa el MISMO horario (horaInicio → horaFinalizacion).
    function expandirBloqueosPorDia(bloqueos) {
        const resultado = [];
        for (const bloqueo of bloqueos) {
            const horaIni = bloqueo.horaInicio ?? "00:00:00";
            const horaFin = bloqueo.horaFinalizacion ?? "23:59:00";
            const fechaIniStr = (bloqueo.fechaInicio ?? "").slice(0, 10);
            const fechaFinStr = (bloqueo.fechaFinalizacion ?? "").slice(0, 10);

            const primerDia = new Date(fechaIniStr + "T00:00:00");
            const ultimoDia = new Date(fechaFinStr + "T00:00:00");

            if (isNaN(primerDia.getTime()) || isNaN(ultimoDia.getTime())) continue;

            let cursor = new Date(primerDia);
            while (cursor <= ultimoDia) {
                const y = cursor.getFullYear();
                const m = String(cursor.getMonth() + 1).padStart(2, "0");
                const d = String(cursor.getDate()).padStart(2, "0");
                const fechaDia = `${y}-${m}-${d}`;

                resultado.push({
                    id_bloqueo: bloqueo.id_bloqueo,
                    title: "BLOQUEADO" + (bloqueo.motivo ? " - " + bloqueo.motivo : ""),
                    start: new Date(`${fechaDia}T${horaIni}`),
                    end: new Date(`${fechaDia}T${horaFin}`),
                    allDay: false,
                    tipo: "bloqueo",
                    resource: bloqueo,
                });

                cursor = new Date(y, cursor.getMonth(), cursor.getDate() + 1, 0, 0, 0);
            }
        }
        return resultado;
    }

    useEffect(() => {
        const eventosReservas = (dataAgenda || []).map((cita) => ({
            id_reserva: cita.id_reserva,
            title: cita.nombrePaciente + " " + cita.apellidoPaciente,
            start: convertirAFechaCalendario(cita.fechaInicio, cita.horaInicio),
            end: convertirAFechaCalendario(cita.fechaFinalizacion, cita.horaFinalizacion),
            allDay: false,
            tipo: "reserva",
            resource: cita,
        }));
        const eventosBloqueos = expandirBloqueosPorDia(dataBloqueos || []);
        setEvents([...eventosReservas, ...eventosBloqueos]);
    }, [dataAgenda, dataBloqueos]);

    const eventStyleGetter = (event) => {
        const esBloqueo = event.tipo === "bloqueo";
        const esSeleccion = event.tipo === "seleccion";
        const estadoReservaNormalizado = event.resource?.estadoReserva?.toLowerCase?.() ?? "";
        const paletteReserva = estadoReservaNormalizado === "confirmada"
            ? {backgroundColor: "#16a34a", color: "#ffffff"}
            : estadoReservaNormalizado === "anulada"
                ? {backgroundColor: "#9f1239", color: "#ffffff"}
                : {backgroundColor: "#7c3aed", color: "#ffffff"};

        return {
            style: {
                display: 'flex', alignItems: 'center', height: 'auto', minHeight: '28px', maxHeight: 'none',
                whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', lineHeight: '1.3',
                padding: '6px 8px', fontSize: '0.8rem', boxSizing: 'border-box', borderRadius: '16px',
                backgroundColor: esSeleccion ? 'rgba(124, 58, 237, 0.24)' : esBloqueo ? '#dc2626' : paletteReserva.backgroundColor,
                color: esSeleccion ? '#5b21b6' : esBloqueo ? '#fff' : paletteReserva.color,
                fontWeight: '600', wordBreak: 'break-word',
                border: esSeleccion ? '1px solid rgba(124, 58, 237, 0.45)' : 'none',
                boxShadow: esSeleccion ? 'none' : '0 12px 24px rgba(15, 23, 42, 0.12)',
            },
        };
    };

    const EventComponent = ({event}) => (
        <div title={event.title} className="break-words text-[13px] leading-snug w-full flex items-center gap-1" style={{whiteSpace: 'normal', overflow: 'visible', wordBreak: 'break-word', hyphens: 'auto'}}>
            {event.tipo === "bloqueo" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )}
            {event.title}
        </div>
    );

    const TitleOnlyEvent = ({event}) => (
        <div title={event.title} className="break-words text-[13px] leading-snug font-medium w-full flex items-center gap-1" style={{whiteSpace: 'normal', overflow: 'visible', wordBreak: 'break-word'}}>
            {event.tipo === "bloqueo" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )}
            {event.title}
        </div>
    );

    async function actualizarInformacionReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva, id_profesional, id_reserva) {
        try {
            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !fechaFinalizacion || !horaFinalizacion || !estadoReserva || !id_profesional || !id_reserva) {
                return toast.error("Debe llenar todos los campos para poder actualizar la reserva");
            }
            const res = await fetch(`${API}/reservaPacientes/actualizarReservacion`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva, id_profesional, id_reserva})
            });
            if (!res.ok) return toast.error("El servidor no responde");
            const respuestaBackend = await res.json();
            if (respuestaBackend.message === true) {
                setNombrePaciente(""); setApellidoPaciente(""); setTelefono(""); setRut(""); setEmail("");
                await refrescarCalendario();
                return toast.success("Se ha actualizado la reserva correctamente");
            }
        } catch (error) {
            console.log(error);
            return toast.error(error.message);
        }
    }

    async function seleccionarReservaEspecifica(id_reserva) {
        try {
            if (!id_reserva) return toast.error("Debe seleccionar una Reserva");
            const res = await fetch(`${API}/reservaPacientes/seleccionarEspecifica`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_reserva})
            });
            if (!res.ok) return toast.error("El servidor no responde");
            const data = await res.json();
            let reserva = Array.isArray(data) ? data[0] : data;
            if (!reserva) return toast.error("Sin Data");

            setNombrePaciente(reserva.nombrePaciente ?? "");
            setApellidoPaciente(reserva.apellidoPaciente ?? "");
            setRut(reserva.rut ?? "");
            setEmail(reserva.email ?? "");
            setTelefono(reserva.telefono ?? "");
            setfechaInicio((reserva.fechaInicio ?? "").slice(0, 10));
            setHoraInicio(reserva.horaInicio ?? "");
            setfechaFinalizacion((reserva.fechaFinalizacion ?? "").slice(0, 10));
            setHoraFinalizacion(reserva.horaFinalizacion ?? "");
            setEstadoReserva(reserva.estadoReserva ?? "");
            setId_profesional(reserva.id_profesional ?? "");
        } catch (error) {
            console.log(error);
            return toast.error("El servidor no responde");
        }
    }

    useEffect(() => {
        if (id_reserva) seleccionarReservaEspecifica(id_reserva);
    }, [id_reserva]);

    function limpiarData() {
        setNombrePaciente(""); setApellidoPaciente(""); setTelefono(""); setRut(""); setEmail("");
    }

    function iniciarDragPopup(event) {
        if (!popupRef.current) return;
        const rect = popupRef.current.getBoundingClientRect();
        popupDragStateRef.current = {
            dragging: true,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top,
        };
        setDraggingPopup(true);
        document.body.style.userSelect = "none";
    }

    async function confirmarAgendamientoDesdePopup() {
        if (!selectionDraft) return;
        const created = await insertarNuevaReserva(
            popupForm.nombrePaciente,
            popupForm.apellidoPaciente,
            popupForm.rut,
            popupForm.telefono,
            popupForm.email,
            formatearFechaLocal(selectionDraft.start),
            selectionDraft.start.toTimeString().slice(0, 8),
            formatearFechaLocal(selectionDraft.end),
            selectionDraft.end.toTimeString().slice(0, 8),
            id_profesional
        );
        if (created) {
            setNombrePaciente(popupForm.nombrePaciente);
            setApellidoPaciente(popupForm.apellidoPaciente);
            setRut(popupForm.rut);
            setTelefono(popupForm.telefono);
            setEmail(popupForm.email);
            limpiarSeleccionTemporal();
        }
    }




    async function eliminadoReserva(id_reserva) {
        try {
            if (!id_reserva) {
                return toast.error("Debe seleccionar al menos una reserva valida para realizar la eliminacion")
            }

            const res = await fetch(`${API}/reservaPacientes/eliminarReserva`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_reserva}),
                mode: "cors"
            })

            if (!res.ok) {
                return toast.error("No hay conexion con el servidor por favor contacte a Soporte");
            } else {

                const respuestaBackend = await res.json();
                if (respuestaBackend.message === true) {
                    return toast.success("Se ha eliminado con exito la reserva");
                } else if (respuestaBackend.message === false) {
                    return toast.success("No se ha podido eliminar la reserva. Intente mas tarde.");
                } else {
                    return toast.error("No hay conexion con el servidor por favor contacte a Soporte");
                }
            }

        } catch (error) {
            console.log(error);
            return toast.error("No hay conexion con el servidor por favor contacte a Soporte");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
            <ToasterClient/>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-1">Planificación</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                            Módulo de Agenda
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Gestiona reservas, revisa disponibilidad y actualiza datos en un solo lugar</p>
                    </div>
                    <InfoButton informacion={"En este apartado, usted puede ingresar pacientes de manera manual directamente en la agenda o sistema de citas. Además, es posible editar los datos de los pacientes ya registrados, permitiéndole mantener la información siempre actualizada y correcta.\n\nAsimismo, este módulo le permite bloquear períodos específicos de la agenda cuando no se encuentre disponible para atender.\nPara bloquear un período, solo debe seleccionar el rango horario que desea bloquear dentro del mismo día y luego presionar el botón \"Bloquear\". El sistema marcará automáticamente ese período como no disponible para nuevas citas.\n\nEsta funcionalidad le entrega un control total sobre la agenda, facilitando la organización de horarios, la gestión de pacientes y la administración de tiempos no disponibles."}/>
                </div>

                {/* Formulario + Fechas */}
                <div className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.9fr]">

                    {/* Datos del paciente */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Datos del Paciente</h2>
                        </div>
                        <div className="space-y-3 p-4 md:p-5">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Nombre</label>
                                    <ShadcnInput value={nombrePaciente ?? ""} onChange={(e) => setNombrePaciente(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Apellido</label>
                                    <ShadcnInput value={apellidoPaciente ?? ""} onChange={(e) => setApellidoPaciente(e.target.value)}/>
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">RUT</label>
                                <ShadcnInput
                                    value={rut}
                                    onChange={(e) => { const value = e.target.value.replace(/[^a-zA-Z0-9]/g, ""); setRut(value); }}
                                    placeholder="12345678K (Sin puntos ni guion)"
                                    className="w-full"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Correo</label>
                                    <ShadcnInput value={email ?? ""} onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Teléfono</label>
                                    <ShadcnInput value={telefono ?? ""} onChange={(e) => setTelefono(e.target.value)}/>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Profesional</label>
                                    <SelectDinamic
                                        value={id_profesional}
                                        onChange={(e) => setId_profesional(Number(e.target.value))}
                                        options={listaProfesionales.map(profesional => ({
                                            value: profesional.id_profesional,
                                            label: profesional.nombreProfesional
                                        }))}
                                        placeholder="Selecciona un profesional"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fecha/hora + acciones */}
                    <div className="space-y-3.5">
                        {/* Inicio */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                                <h3 className="text-sm font-semibold text-slate-700">Inicio</h3>
                                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Fecha y hora</span>
                            </div>
                            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
                                <div className="flex-1">
                                    <ShadcnFechaHora onChange={manejarFechaHoraInicio}/>
                                </div>
                                <div className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 md:w-44">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400 uppercase">Fecha</span>
                                        <span className="text-xs font-medium text-slate-800">{fechaInicio || "--"}</span>
                                    </div>
                                    <div className="mt-1.5 flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400 uppercase">Hora</span>
                                        <span className="text-xs font-semibold text-emerald-600">{horaInicio || "--"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Final */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                                <h3 className="text-sm font-semibold text-slate-700">Final</h3>
                                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Debe ser el mismo día</span>
                            </div>
                            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
                                <div className="flex-1">
                                    <ShadcnFechaHora onChange={manejarFechaHoraFinalizacion}/>
                                </div>
                                <div className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 md:w-44">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400 uppercase">Fecha</span>
                                        <span className="text-xs font-medium text-slate-800">{fechaFinalizacion || "--"}</span>
                                    </div>
                                    <div className="mt-1.5 flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400 uppercase">Hora</span>
                                        <span className="text-xs font-semibold text-sky-600">{horaFinalizacion || "--"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-wrap gap-2 pt-0.5">
                            <button
                                onClick={() => insertarNuevaReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, id_profesional)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:from-sky-700 hover:to-cyan-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                                </svg>
                                Agregar
                            </button>

                            <button
                                onClick={() => actualizarInformacionReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva, id_profesional, id_reserva)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2.5 text-sm font-medium text-sky-700 transition-colors duration-150 hover:bg-sky-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                                Actualizar
                            </button>

                            <button
                                onClick={() => limpiarData()}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                Limpiar
                            </button>

                            <button
                                onClick={() => eliminadoReserva(id_reserva)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                                </svg>
                                Eliminar Reservacion
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendario */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Calendario de Reservas</h2>
                            {id_profesional && (
                                <span className="text-xs text-violet-600 font-medium ml-2">
                                    — Agenda de: {listaProfesionales.find(p => p.id_profesional === id_profesional)?.nombreProfesional ?? ""}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded bg-violet-600"></span>
                                <span className="text-xs text-slate-500">Reservada</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded bg-green-600"></span>
                                <span className="text-xs text-slate-500">Confirmada</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded bg-rose-800"></span>
                                <span className="text-xs text-slate-500">Anulada</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded bg-red-600"></span>
                                <span className="text-xs text-slate-500">Bloqueado</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded bg-violet-200 border border-violet-400"></span>
                                <span className="text-xs text-slate-500">Selección</span>
                            </div>
                            <span className="text-xs text-slate-400">Vista: <span className="font-medium text-slate-600 capitalize">{currentView}</span></span>
                        </div>
                    </div>
                    <div className="relative p-4 md:p-6 h-[700px]">
                        {selectionPreview && (
                            <div className="pointer-events-none absolute right-6 top-6 z-20 rounded-2xl border border-violet-200 bg-white/95 px-4 py-3 text-xs shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur">
                                <div className="font-semibold text-violet-700">Seleccionando horario</div>
                                <div className="mt-1 text-slate-600">
                                    {formatFechaLarga(selectionPreview.start)}
                                </div>
                                <div className="mt-1 font-medium text-slate-800">
                                    {formatHoraCorta(selectionPreview.start)} - {formatHoraCorta(selectionPreview.end)}
                                </div>
                            </div>
                        )}

                        <DnDCalendar
                            localizer={localizer}
                            events={events}
                            backgroundEvents={floatingDraft ? [floatingDraft] : []}
                            eventPropGetter={eventStyleGetter}
                            components={{
                                event: EventComponent,
                                day: {event: TitleOnlyEvent},
                                agenda: {event: TitleOnlyEvent}
                            }}
                            startAccessor="start"
                            endAccessor="end"
                            messages={messages}
                            culture="es"
                            date={currentDate}
                            onNavigate={(nextDate) => setCurrentDate(nextDate)}
                            view={currentView}
                            onView={(nextView) => setCurrentView(nextView)}
                            defaultView="week"
                            views={["month", "week", "day", "agenda"]}
                            style={{height: "100%"}}
                            selectable
                            resizable
                            popup
                            step={30}
                            timeslots={2}
                            longPressThreshold={10}
                            onSelecting={(slot) => {
                                const start = slot.start ?? slot;
                                const end = slot.end ?? slot;
                                setSelectionPreview({start, end});
                                if (!validarSeleccionPrevia(start, end)) {
                                    return false;
                                }
                                return true;
                            }}
                            onSelectEvent={(event) => {
                                limpiarSeleccionTemporal();
                                if (event.tipo === "bloqueo") {
                                    return toast("Bloqueo: " + (event.title || "Sin motivo"), {icon: "🔒"});
                                }
                                if (!event?.id_reserva) { toast.error("No se encontró el ID de la reserva"); return; }
                                setid_reserva(event.id_reserva);
                                seleccionarReservaEspecifica(event.id_reserva);
                                toast.success(`Reserva: Numero # ${event.id_reserva}`);
                            }}
                            onSelectSlot={(slotInfo) => {
                                const start = slotInfo.start ?? slotInfo;
                                const end = slotInfo.end ?? slotInfo;
                                if (!validarSeleccionPrevia(start, end)) {
                                    limpiarSeleccionTemporal();
                                    return;
                                }
                                abrirPopupSeleccion(slotInfo);
                                setSelectionPreview(null);
                            }}
                            onEventDrop={async ({event, start, end}) => {
                                if (event.tipo === "bloqueo") {
                                    toast("Los bloqueos aun no soportan movimiento desde la grilla.", {icon: "🔒"});
                                    return;
                                }
                                await actualizarReservaDesdeCalendario(event.resource, start, end);
                            }}
                            onEventResize={async ({event, start, end}) => {
                                if (event.tipo === "bloqueo") {
                                    toast("Los bloqueos aun no soportan redimensionamiento desde la grilla.", {icon: "🔒"});
                                    return;
                                }
                                await actualizarReservaDesdeCalendario(event.resource, start, end);
                            }}
                        />
                    </div>
                </div>

            </div>

            {selectionDraft && (
                <div className="fixed inset-0 z-[80] bg-transparent" onMouseDown={(e) => e.preventDefault()}>
                    <div
                        ref={popupRef}
                        className="absolute w-[420px] rounded-3xl border border-violet-200 bg-white/95 shadow-[0_28px_80px_rgba(76,29,149,0.18)] backdrop-blur-xl"
                        style={{left: popupPosition.x, top: popupPosition.y}}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div
                            className="flex cursor-move items-center justify-between rounded-t-3xl border-b border-violet-100 bg-[linear-gradient(135deg,rgba(245,243,255,0.98),rgba(237,233,254,0.98))] px-4 py-3"
                            onMouseDown={iniciarDragPopup}
                        >
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700">Nuevo agendamiento</p>
                                <p className="mt-1 text-sm font-semibold text-slate-800">Confirma el rango seleccionado</p>
                            </div>
                            <button
                                type="button"
                                onClick={limpiarSeleccionTemporal}
                                className="rounded-full border border-violet-100 bg-white px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="max-h-[58vh] space-y-3 overflow-y-auto px-4 py-4 text-sm text-slate-600">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Inicio</div>
                                    <div className="mt-1 font-semibold text-violet-700">{formatHoraCorta(selectionDraft.start)}</div>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Termino</div>
                                    <div className="mt-1 font-semibold text-violet-700">{formatHoraCorta(selectionDraft.end)}</div>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Fecha</div>
                                    <div className="mt-1 truncate font-semibold capitalize text-slate-800">{formatFechaLarga(selectionDraft.start)}</div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Profesional</div>
                                <div className="mt-1 font-semibold text-slate-800">{selectionDraft.profesional}</div>
                            </div>

                            <div className="rounded-2xl border border-violet-100 bg-[linear-gradient(180deg,rgba(250,245,255,0.9),rgba(255,255,255,0.96))] px-3 py-3">
                                <div className="mb-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">Paciente</p>
                                    <p className="mt-1 text-xs text-slate-500">Completa los datos para crear el agendamiento.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-[11px] text-slate-500">Nombre</label>
                                        <input
                                            value={popupForm.nombrePaciente}
                                            onChange={(e) => setPopupForm((prev) => ({...prev, nombrePaciente: e.target.value}))}
                                            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] text-slate-800 outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                                            placeholder="Nombre"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] text-slate-500">Apellido</label>
                                        <input
                                            value={popupForm.apellidoPaciente}
                                            onChange={(e) => setPopupForm((prev) => ({...prev, apellidoPaciente: e.target.value}))}
                                            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] text-slate-800 outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                                            placeholder="Apellido"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] text-slate-500">RUT</label>
                                        <input
                                            value={popupForm.rut}
                                            onChange={(e) => setPopupForm((prev) => ({...prev, rut: e.target.value.replace(/[^a-zA-Z0-9]/g, "")}))}
                                            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] text-slate-800 outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                                            placeholder="12345678K"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] text-slate-500">Teléfono</label>
                                        <input
                                            value={popupForm.telefono}
                                            onChange={(e) => setPopupForm((prev) => ({...prev, telefono: e.target.value}))}
                                            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] text-slate-800 outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                                            placeholder="+56..."
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[11px] text-slate-500">Correo</label>
                                        <input
                                            type="email"
                                            value={popupForm.email}
                                            onChange={(e) => setPopupForm((prev) => ({...prev, email: e.target.value}))}
                                            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] text-slate-800 outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                                            placeholder="correo@dominio.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-4">
                            <button
                                type="button"
                                onClick={limpiarSeleccionTemporal}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmarAgendamientoDesdePopup}
                                className="rounded-xl bg-gradient-to-r from-violet-700 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(124,58,237,0.24)] transition-all hover:from-violet-600 hover:to-purple-500"
                            >
                                Agendar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
