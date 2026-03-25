"use client"

import {useParams} from "next/navigation";
import {useState, useEffect} from "react";
import {toast} from "react-hot-toast";
import {Textarea} from "@/components/ui/textarea";
import ShadcnDatePicker from "@/Componentes/shadcnDatePicker";
import ToasterClient from "@/Componentes/ToasterClient";
import Link from "next/link";
import {ShadcnInput} from "@/Componentes/shadcnInput";
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {useRouter} from "next/navigation";

export default function NuevaFicha() {

    const {id_paciente} = useParams();
    const [dataPaciente, setDataPaciente] = useState([]);
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    function retroceder(id_paciente) {
        router.push(`/dashboard/FichasPacientes/${id_paciente}`);
    }

    const [tipoAtencion, setTipoAtencion] = useState("");
    const [motivoConsulta, setMotivoConsulta] = useState("");
    const [signosVitales, setSignosVitales] = useState("");
    const [observacionesPrecio, setObservacionesPrecio] = useState("");
    const [anotacionConsulta, setAnotacionConsulta] = useState("");
    const [anamnesis, setAnamnesis] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [indicaciones, setIndicaciones] = useState("");
    const [archivosAdjuntos, setArchivosAdjuntos] = useState("");
    const [fechaConsulta, setFechaConsulta] = useState("");
    const [consentimientoFirmado, setConsentimientoFirmado] = useState("");

    async function insertarFicha(
        id_paciente,
        tipoAtencion,
        motivoConsulta,
        signosVitales,
        observaciones,
        anotacionConsulta,
        anamnesis,
        diagnostico,
        indicaciones,
        archivosAdjuntos,
        fechaConsulta,
        consentimientoFirmado
    ) {
        try {
            if (!id_paciente) {
                return toast.error('Debe seleccionar un paciente para ingresar una nueva ficha.')
            } else {
                const res = await fetch(`${API}/ficha/insertarFichaClinica`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_paciente,
                        tipoAtencion,
                        motivoConsulta,
                        signosVitales,
                        observaciones,
                        anotacionConsulta,
                        anamnesis,
                        diagnostico,
                        indicaciones,
                        archivosAdjuntos,
                        fechaConsulta,
                        consentimientoFirmado
                    }),
                    mode: "cors"
                })

                if (!res.ok) {
                    return toast.error("Faltan datos para ingresar la nueva ficha.");
                }

                const respuestaQuery = await res.json();
                if (respuestaQuery.message === true) {
                    setConsentimientoFirmado("");
                    setArchivosAdjuntos("");
                    setIndicaciones("");
                    setDiagnostico("");
                    setAnamnesis("");
                    setAnotacionConsulta("");
                    setObservacionesPrecio("");
                    setSignosVitales("");
                    setMotivoConsulta("");
                    setTipoAtencion("");
                    return toast.success("Nueva ficha ingresada con Exito!");
                } else {
                    return toast.error("Faltan datos para ingresar la nueva ficha.");
                }
            }
        } catch (error) {
            console.log(error);
            return toast.error("Ha ocurrido un error en el servidor, Contacte a soporte tecnico de Medify");
        }
    }

    async function buscarPacientePorId(id_paciente) {
        try {
            if (!id_paciente) {
                return toast.error(
                    "No se puede cargar los datos del paciente seleccionado. Debe haber seleccionado el paciente para poder ver el detalle de los datos."
                );
            }

            const res = await fetch(`${API}/pacientes/pacientesEspecifico`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id_paciente}),
            });

            if (!res.ok) {
                return toast.error("No se puede cargar los datos del paciente seleccionado.");
            }

            const data = await res.json();
            setDataPaciente(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.log(error);
            return toast.error(
                "No se puede cargar los datos del paciente seleccionado. Por favor contacte a soporte de Medify"
            );
        }
    }

    useEffect(() => {
        if (!id_paciente) return;
        buscarPacientePorId(id_paciente);
    }, [id_paciente]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
            <ToasterClient/>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                                Nueva Ficha Clínica
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Complete los campos para registrar la atención del paciente
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href={"/dashboard/FichaClinica"}>
                                <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                    </svg>
                                    <span className="hidden sm:inline">Volver</span>
                                </button>
                            </Link>

                            {dataPaciente.map((ficha, index) => (
                                <ShadcnButton
                                    key={index}
                                    funcion={() => retroceder(ficha.id_paciente)}
                                    nombre={"Fichas"}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tarjeta datos paciente */}
                {dataPaciente.map((paciente) => (
                    <div
                        key={paciente.id_paciente}
                        className="mb-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
                    >
                        <div className="border-b border-slate-100 bg-gradient-to-r from-sky-600 to-cyan-500 px-5 py-3">
                            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
                                Datos del Paciente
                            </h2>
                        </div>
                        <div className="p-5 md:p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">ID</span>
                                    <span className="text-sm font-semibold text-sky-600">#{paciente.id_paciente}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Nombre</span>
                                    <span className="text-sm font-medium text-slate-800">{paciente.nombre}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Apellido</span>
                                    <span className="text-sm font-medium text-slate-800">{paciente.apellido}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">RUT</span>
                                    <span className="text-sm font-medium text-slate-800">{paciente.rut}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Formulario principal */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                    {/* Sección: Información General */}
                    <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
                        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                            Información de la Consulta
                        </h2>
                    </div>

                    <div className="p-5 md:p-6 space-y-5">

                        {/* Fecha */}
                        <div className="max-w-xs">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Fecha de Consulta
                            </label>
                            <ShadcnDatePicker
                                className="border-slate-300 focus:border-sky-500"
                                label=""
                                value={fechaConsulta}
                                onChange={(fecha) => setFechaConsulta(fecha)}
                            />
                        </div>

                        {/* Campos en grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Motivo Consulta
                                </label>
                                <p className="text-xs text-slate-400 mb-2">Motivo principal de la visita</p>
                                <ShadcnInput
                                    value={tipoAtencion}
                                    placeholder="Ej: Seguimiento, Tratamiento, Evaluación..."
                                    onChange={(e) => setTipoAtencion(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Profesional
                                </label>
                                <p className="text-xs text-slate-400 mb-2">Profesional a cargo de la atención</p>
                                <ShadcnInput
                                    value={observacionesPrecio}
                                    placeholder="Ej: Dra. Andrea Moran"
                                    onChange={(e) => setObservacionesPrecio(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección: Diagnóstico e Indicaciones */}
                    <div className="border-t border-b border-slate-100 bg-slate-50/50 px-5 py-3">
                        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                            Diagnóstico e Indicaciones
                        </h2>
                    </div>

                    <div className="p-5 md:p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Diagnóstico
                            </label>
                            <p className="text-xs text-slate-400 mb-2">Diagnóstico clínico del paciente</p>
                            <ShadcnInput
                                value={diagnostico}
                                placeholder="Ej: Caries dental activa en molar 3.6 (lesión oclusal)"
                                onChange={(e) => setDiagnostico(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Indicaciones
                            </label>
                            <p className="text-xs text-slate-400 mb-2">Indicaciones post-atención para el paciente</p>
                            <Textarea
                                className="min-h-[100px] resize-none border-slate-300 focus:border-sky-500 focus:ring-sky-500/20"
                                value={indicaciones}
                                onChange={(e) => setIndicaciones(e.target.value)}
                                placeholder="Ej: Mantener higiene oral estricta: cepillado suave 3 veces al día + uso de hilo dental nocturno."
                            />
                        </div>
                    </div>

                    {/* Sección: Anotaciones Clínicas */}
                    <div className="border-t border-b border-slate-100 bg-slate-50/50 px-5 py-3">
                        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                            Anotaciones Clínicas
                        </h2>
                    </div>

                    <div className="p-5 md:p-6">
                        <p className="text-xs text-slate-400 mb-3">
                            Registra hallazgos, procedimiento realizado, materiales/medicación indicada, evolución y plan de control.
                        </p>
                        <Textarea
                            className="min-h-[140px] resize-none border-slate-300 focus:border-sky-500 focus:ring-sky-500/20"
                            value={anotacionConsulta}
                            onChange={(e) => setAnotacionConsulta(e.target.value)}
                            placeholder="Ej: Odontograma: 3.6 caries O; se realiza resina; anestesia local; se indican cuidados y control en 7 días."
                        />
                    </div>
                </div>

                {/* Botón de acción */}
                <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <Link href={"/dashboard/FichaClinica"}>
                        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 shadow-sm">
                            Cancelar
                        </button>
                    </Link>

                    <button
                        onClick={() => insertarFicha(
                            id_paciente,
                            tipoAtencion,
                            motivoConsulta,
                            signosVitales,
                            observacionesPrecio,
                            anotacionConsulta,
                            anamnesis,
                            diagnostico,
                            indicaciones,
                            archivosAdjuntos,
                            fechaConsulta,
                            consentimientoFirmado
                        )}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-lg hover:from-sky-700 hover:to-cyan-600 transition-all duration-150 shadow-md hover:shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Guardar Ficha Clínica
                    </button>
                </div>

            </div>
        </div>
    );
}
