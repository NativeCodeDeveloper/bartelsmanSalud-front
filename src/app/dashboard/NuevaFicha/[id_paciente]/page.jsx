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

function transformarPlantilla(filas) {
    if (!filas || filas.length === 0) return null
    const primera = filas[0]
    const categoriasMap = {}

    filas.forEach(fila => {
        if (!fila.id_categoria) return
        if (!categoriasMap[fila.id_categoria]) {
            categoriasMap[fila.id_categoria] = {
                id_categoria: fila.id_categoria,
                nombre: fila.categoria_nombre,
                orden: fila.categoria_orden,
                campos: []
            }
        }
        if (fila.id_campo) {
            categoriasMap[fila.id_categoria].campos.push({
                id_campo: fila.id_campo,
                nombre: fila.campo_nombre,
                requerido: fila.requerido,
                orden: fila.campo_orden
            })
        }
    })

    return {
        id_plantilla: primera.id_plantilla,
        nombre: primera.plantilla_nombre,
        categorias: Object.values(categoriasMap).sort((a, b) => a.orden - b.orden)
    }
}

export default function NuevaFicha() {

    const {id_paciente} = useParams();
    const [dataPaciente, setDataPaciente] = useState([]);
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    function retroceder(id_paciente) {
        router.push(`/dashboard/FichasPacientes/${id_paciente}`);
    }

    // Campos base
    const [fechaConsulta, setFechaConsulta] = useState("");
    const [observacionesPrecio, setObservacionesPrecio] = useState("");

    // Plantilla dinámica
    const [plantillas, setPlantillas] = useState([])
    const [idPlantilla, setIdPlantilla] = useState("")
    const [plantillaCompleta, setPlantillaCompleta] = useState(null)
    const [datosDinamicos, setDatosDinamicos] = useState({})

    // Cargar lista de plantillas al montar
    async function listarPlantillas() {
        try {
            const res = await fetch(`${API}/fichaPlantilla/listarPlantillas`)
            if (!res.ok) return
            const data = await res.json()
            if (Array.isArray(data)) {
                setPlantillas(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Cargar plantilla completa cuando se selecciona
    async function seleccionarPlantilla(id_plantilla) {
        setIdPlantilla(id_plantilla)
        setDatosDinamicos({})
        setPlantillaCompleta(null)

        if (!id_plantilla) return

        try {
            const res = await fetch(`${API}/fichaPlantilla/obtenerPlantillaCompleta`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_plantilla})
            })

            if (!res.ok) {
                return toast.error("No se pudo cargar la plantilla seleccionada.")
            }

            const filas = await res.json()
            const estructura = transformarPlantilla(filas)
            setPlantillaCompleta(estructura)
        } catch (error) {
            console.log(error)
            return toast.error("Error al cargar la plantilla.")
        }
    }

    async function insertarFicha() {
        try {
            if (!id_paciente) {
                return toast.error('Debe seleccionar un paciente para ingresar una nueva ficha.')
            }

            if (!idPlantilla || !plantillaCompleta) {
                return toast.error('Debe seleccionar una plantilla para la ficha.')
            }

            // Validar campos requeridos
            const camposFaltantes = []
            plantillaCompleta.categorias.forEach(cat => {
                cat.campos.forEach(campo => {
                    if (campo.requerido === 1 && !datosDinamicos[campo.id_campo]?.trim()) {
                        camposFaltantes.push(campo.nombre)
                    }
                })
            })

            if (camposFaltantes.length > 0) {
                return toast.error(`Debe completar los campos obligatorios: ${camposFaltantes.join(", ")}`)
            }

            const res = await fetch(`${API}/ficha/insertarFichaClinica`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_paciente,
                    tipoAtencion: "",
                    motivoConsulta: "",
                    signosVitales: "",
                    observaciones: observacionesPrecio,
                    anotacionConsulta: "",
                    anamnesis: "",
                    diagnostico: "",
                    indicaciones: "",
                    archivosAdjuntos: "",
                    fechaConsulta,
                    consentimientoFirmado: "",
                    id_plantilla: idPlantilla,
                    datosDinamicos
                }),
                mode: "cors"
            })

            if (!res.ok) {
                return toast.error("Faltan datos para ingresar la nueva ficha.");
            }

            const respuestaQuery = await res.json();
            if (respuestaQuery.message === true) {
                setObservacionesPrecio("");
                setFechaConsulta("");
                setDatosDinamicos({});
                setIdPlantilla("");
                setPlantillaCompleta(null);
                return toast.success("Nueva ficha ingresada con Exito!");
            } else {
                return toast.error("Faltan datos para ingresar la nueva ficha.");
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
        listarPlantillas();
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
                                Nueva Ficha Cl&iacute;nica
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Complete los campos para registrar la atenci&oacute;n del paciente
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
                                    <span className="text-sm font-medium text-slate-800 break-words whitespace-pre-wrap">{paciente.rut}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tel&eacute;fono</span>
                                    <span className="text-sm font-medium text-slate-800 break-words whitespace-pre-wrap">{paciente.telefono || "-"}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Correo</span>
                                    <span className="text-sm font-medium text-slate-800 break-words whitespace-pre-wrap">{paciente.correo || "-"}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Apoderado</span>
                                    <span className="text-sm font-medium text-slate-800 break-words whitespace-pre-wrap">{paciente.apoderado || "-"}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">RUT Apoderado</span>
                                    <span className="text-sm font-medium text-slate-800 break-words whitespace-pre-wrap">{paciente.apoderado_rut || "-"}</span>
                                </div>
                                <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-1">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Medicamentos Usados</span>
                                    <span className="text-sm font-medium text-slate-800 break-words whitespace-pre-wrap">{paciente.medicamentosUsados || "-"}</span>
                                </div>
                                <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-1">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">H&aacute;bitos</span>
                                    <span className="text-sm font-medium text-slate-800 break-words whitespace-pre-wrap">{paciente.habitos || "-"}</span>
                                </div>
                                <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-1">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Comentarios Adicionales</span>
                                    <span className="text-sm font-medium text-slate-800 break-words whitespace-pre-wrap">{paciente.comentariosAdicionales || "-"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Formulario principal */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                    {/* Secci&oacute;n: Informaci&oacute;n General */}
                    <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
                        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                            Informaci&oacute;n de la Consulta
                        </h2>
                    </div>

                    <div className="p-5 md:p-6 space-y-5">

                        {/* Selector de Plantilla */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Plantilla de Ficha <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-slate-400 mb-2">Seleccione el tipo de ficha cl&iacute;nica a completar</p>
                            <select
                                value={idPlantilla}
                                onChange={(e) => seleccionarPlantilla(e.target.value)}
                                className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all text-slate-700"
                            >
                                <option value="">Seleccione una plantilla...</option>
                                {plantillas.map((p) => (
                                    <option key={p.id_plantilla} value={p.id_plantilla}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fecha + Profesional */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
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

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Profesional
                                </label>
                                <p className="text-xs text-slate-400 mb-2">Profesional a cargo de la atenci&oacute;n</p>
                                <ShadcnInput
                                    value={observacionesPrecio}
                                    placeholder="Ej: Dra. Andrea Moran"
                                    onChange={(e) => setObservacionesPrecio(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Campos din&aacute;micos de la plantilla */}
                    {plantillaCompleta && plantillaCompleta.categorias.map(categoria => (
                        <div key={categoria.id_categoria}>
                            {/* Header de categor&iacute;a */}
                            <div className="border-t border-b border-slate-100 bg-slate-50/50 px-5 py-3">
                                <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                                    {categoria.nombre}
                                </h2>
                            </div>

                            <div className="p-5 md:p-6 space-y-5">
                                {categoria.campos.map(campo => (
                                    <div key={campo.id_campo}>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            {campo.nombre}
                                            {campo.requerido === 1 && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        <Textarea
                                            className="min-h-[100px] resize-y border-slate-300 focus:border-sky-500 focus:ring-sky-500/20"
                                            value={datosDinamicos[campo.id_campo] || ""}
                                            onChange={(e) => setDatosDinamicos(prev => ({
                                                ...prev,
                                                [campo.id_campo]: e.target.value
                                            }))}
                                            placeholder={`Ingrese ${campo.nombre.toLowerCase()}...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Mensaje cuando no hay plantilla seleccionada */}
                    {!plantillaCompleta && (
                        <div className="p-8 text-center border-t border-slate-100">
                            <div className="mx-auto mb-3 flex items-center justify-center h-12 w-12 rounded-xl bg-slate-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Seleccione una plantilla para ver los campos del formulario</p>
                        </div>
                    )}
                </div>

                {/* Bot&oacute;n de acci&oacute;n */}
                <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <Link href={"/dashboard/FichaClinica"}>
                        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 shadow-sm">
                            Cancelar
                        </button>
                    </Link>

                    <button
                        onClick={() => insertarFicha()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-lg hover:from-sky-700 hover:to-cyan-600 transition-all duration-150 shadow-md hover:shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Guardar Ficha Cl&iacute;nica
                    </button>
                </div>

            </div>
        </div>
    );
}
