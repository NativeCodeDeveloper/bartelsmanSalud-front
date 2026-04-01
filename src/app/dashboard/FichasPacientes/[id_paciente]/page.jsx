"use client"
import {useParams} from "next/navigation";
import {useState, useEffect} from "react";
import {toast} from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import formatearFecha from "@/FuncionesTranversales/funcionesTranversales.js"
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {useRouter} from "next/navigation";
import {ShadcnInput} from "@/Componentes/shadcnInput";
import {ShadcnSelect} from "@/Componentes/shadcnSelect";
import ShadcnDatePicker from "@/Componentes/shadcnDatePicker";
import * as React from "react";
import {CheckboxIcon} from "@radix-ui/react-icons";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {InfoButton} from "@/Componentes/InfoButton";


export default function Paciente() {

    const {id_paciente} = useParams();
    const [detallePaciente, setDetallePaciente] = useState([])
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    function nuevaFichaClinica() {
        router.push(`/dashboard/NuevaFicha/${id_paciente}`);
    }


    function verOdontogramas() {
        router.push(`/dashboard/odontogramasPaciente/${id_paciente}`);
    }

    function editarFichaClinica(id_ficha) {
        router.push(`/dashboard/EdicionFicha/${id_ficha}`);
    }

    function agendarPaciente() {
        const paciente = detallePaciente[0];
        if (!paciente) return;
        const params = new URLSearchParams({
            nombre: paciente.nombre || "",
            apellido: paciente.apellido || "",
            rut: paciente.rut || "",
            telefono: paciente.telefono || "",
            email: paciente.correo || "",
        });
        router.push(`/dashboard/calendario?${params.toString()}`);
    }

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [rut, setRut] = useState("");
    const [nacimiento, setNacimiento] = useState("");
    const [sexo, setSexo] = useState("");
    const [prevision, setPrevision] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [pais, setPais] = useState("");

    const [checked, setChecked] = useState(true);

    const [tipoAtencion, setTipoAtencion] = useState("");
    const [motivoConsulta, setMotivoConsulta] = useState("");
    const [signosVitales, setSignosVitales] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [anotacionConsulta, setAnotacionConsulta] = useState("");
    const [anamnesis, setAnamnesis] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [indicaciones, setIndicaciones] = useState("");
    const [archivosAdjuntos, setArchivosAdjuntos] = useState("");
    const [fechaConsulta, setFechaConsulta] = useState("");
    const [estadoFicha, setEstadoFicha] = useState("");
    const [consentimientoFirmado, setConsentimientoFirmado] = useState("");

    const [listaFichas, setListaFichas] = useState([]);

    async function eliminarFicha(id_ficha) {
        try {
            if (!id_ficha) {
                return toast.error("Debe seleccionar al menos una ficha clinica");
            }

            const res = await fetch(`${API}/ficha/eliminarFichaClinica`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_ficha}),
                mode: "cors",
                cache: "no-cache"
            })

            if (!res.ok) {
                return toast.error("No se puedo eliminar la ficha , contacte a soporte informatico");
            } else {
                const resultadoBackend = await res.json();
                if (resultadoBackend.message === true) {
                    await listarFichasClinicasPaciente(id_paciente)
                    return toast.success("Se ha eliminado la ficha con exito!")
                } else {
                    return toast.error("No se ha podido eliminar la ficha por favor intente mas tarde")
                }
            }
        } catch (error) {
            return toast.error("Ha ocurrido un error contacte a soporte tecnico");
        }
    }

    async function listarFichasClinicasPaciente(id_paciente) {
        try {
            if (!id_paciente) {
                return toast.error("No se ha seleccionado ningun Id, si el problema persiste contcate a soporte de Medify")
            } else {
                const res = await fetch(`${API}/ficha/seleccionarFichasPaciente`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({id_paciente}),
                    mode: "cors"
                })

                if (!res.ok) {
                    return toast.error("Ha ocurrido un error Contacte a soporte de Medify")
                }

                const dataFichasClinicas = await res.json();
                setListaFichas(dataFichasClinicas);
            }
        } catch (e) {
            console.log(e)
            return toast.error("Ha ocurrido un error en el servidor: " + e)
        }
    }

    function volverAFichas() {
        router.push("/dashboard/FichaClinica");
    }

    async function actualizarDatosPacientes(nombre, apellido, rut, nacimiento, sexo, prevision, telefono, correo, direccion, pais, id_paciente) {

        let prevision_id = null;

        if (prevision.includes("FONASA")) {
            prevision_id = 1
        } else if (prevision.includes("ISAPRE")) {
            prevision_id = 2
        } else {
            prevision_id = 0
        }

        try {
            if (!nombre || !apellido || !rut || !nacimiento || !sexo || !prevision_id || !telefono || !correo || !direccion || !pais || !id_paciente) {
                return toast.error("Debe llenar todos los campos para proceder con la actualziacion")
            }

            const res = await fetch(`${API}/pacientes/pacientesActualizar`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                mode: "cors",
                body: JSON.stringify({
                    nombre,
                    apellido,
                    rut,
                    nacimiento,
                    sexo,
                    prevision_id,
                    telefono,
                    correo,
                    direccion,
                    pais,
                    id_paciente
                })
            })

            if (!res.ok) {
                return toast.error("Debe llenar todos los campos para proceder con la actualziacion")
            } else {
                const resultadoQuery = await res.json();
                if (resultadoQuery.message === true) {
                    setNombre("");
                    setApellido("");
                    setNacimiento("");
                    setTelefono("");
                    setCorreo("");
                    setDireccion("");
                    setRut("");
                    setSexo("");
                    setPais("");
                    await buscarPacientePorId(id_paciente);
                    return toast.success("Datos del paciente actualizados con Exito!");
                } else {
                    return toast.error("No se han podido Actualizar los datos del paciente. Intente mas tarde.")
                }
            }
        } catch (err) {
            console.log(err);
            return toast.error("Ha ocurrido un problema en el servidor")
        }
    }

    async function buscarPacientePorId(id_paciente) {
        try {
            if (!id_paciente) {
                return toast.error("No se puede cargar los datos del paciente seleccionado. Debe haber seleccionado el paciente para poder ver el detalle de los datos.");
            }
            const res = await fetch(`${API}/pacientes/pacientesEspecifico`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_paciente})
            })

            if (!res.ok) {
                return toast.error("No se puede cargar los datos del paciente seleccionado.");
            }

            const dataPaciente = await res.json();
            setDetallePaciente(Array.isArray(dataPaciente) ? dataPaciente : [dataPaciente]);

        } catch (error) {
            console.log(error);
            return toast.error("No se puede cargar los datos del paciente seleccionado. Por favor contacte a soporte de Medify");
        }
    }

    useEffect(() => {
        if (!id_paciente) return;
        buscarPacientePorId(id_paciente)
    }, [id_paciente]);

    function calcularEdad(fechaNacimiento) {
        if (!fechaNacimiento) return '-';
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }

    function previsionDeterminacion(id_prevision) {
        if (id_prevision === 1) return "NO APLICA";
        if (id_prevision === 2) return "ISAPRE";
        return "SIN DEFINIR";
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
            <ToasterClient/>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-1">Historial del paciente</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                            Carpeta Clinica de :
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <InfoButton informacion={'En este apartado se mostrarán las fichas clínicas del paciente, ordenadas desde la más reciente a la más antigua, incluyendo tanto las fichas como sus anotaciones asociadas.\n\nPara editar una ficha clínica, debe seleccionarse el botón Editar, lo que lo llevará al formulario correspondiente donde podrá modificar la información de la ficha seleccionada.\n\nEn caso de eliminar una ficha clínica, deberá presionar el botón Eliminar. Esta acción removerá la ficha seleccionada del sistema.\n\nSi desea crear una nueva ficha clínica, debe seleccionar el botón Nueva Ficha, el cual lo dirigirá al formulario de ingreso para registrar una nueva ficha clínica.'}/>
                        <button
                            onClick={() => volverAFichas()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                            Volver
                        </button>
                    </div>
                </div>

                {/* Tarjeta paciente */}
                {detallePaciente.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400 shadow-sm">
                        Cargando datos del paciente...
                    </div>
                ) : (
                    detallePaciente.map(paciente => (
                        <div key={paciente.id_paciente} className="mb-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-sky-600 to-cyan-500 px-5 md:px-6 py-3.5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <span className="text-sm font-bold text-white">
                                            {paciente.nombre?.charAt(0)}{paciente.apellido?.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">
                                            {paciente.nombre} {paciente.apellido}
                                        </h2>
                                        <p className="text-base text-sky-100">RUT: {paciente.rut}</p>
                                    </div>
                                </div>
                                <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                                   Prevision : {previsionDeterminacion(paciente.prevision_id)}
                                </span>
                            </div>

                            <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                                <div className="bg-slate-50 rounded-lg px-4 py-3">
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Nacimiento</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1 break-words whitespace-pre-wrap">{formatearFecha(paciente.nacimiento)}</p>
                                </div>
                                <div className="bg-sky-50 rounded-lg px-4 py-3 border border-sky-100">
                                    <p className="text-[11px] font-medium text-sky-400 uppercase tracking-wider">Edad</p>
                                    <p className="text-sm font-bold text-sky-700 mt-1">{calcularEdad(paciente.nacimiento)} años</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg px-4 py-3">
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Sexo</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1 break-words whitespace-pre-wrap">{paciente.sexo}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg px-4 py-3">
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Teléfono</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1 break-words whitespace-pre-wrap">{paciente.telefono || '-'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg px-4 py-3">
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Correo</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1 break-words whitespace-pre-wrap">{paciente.correo || '-'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg px-4 py-3 col-span-2 sm:col-span-1">
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Dirección</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1 break-words whitespace-pre-wrap">{paciente.direccion || '-'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg px-4 py-3">
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">País</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1 break-words whitespace-pre-wrap">{paciente.pais || '-'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg px-4 py-3">
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Apoderado</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1 break-words whitespace-pre-wrap">{paciente.apoderado || '-'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg px-4 py-3">
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">RUT Apoderado</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1 break-words whitespace-pre-wrap">{paciente.apoderado_rut || '-'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg px-4 py-3 xl:col-span-3">
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Medicamentos Usados</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1 break-words whitespace-pre-wrap">{paciente.medicamentosUsados || '-'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg px-4 py-3 xl:col-span-3">
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Hábitos</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1 break-words whitespace-pre-wrap">{paciente.habitos || '-'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg px-4 py-3 xl:col-span-6">
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Observación</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1 break-words whitespace-pre-wrap">{paciente.observacion1 || '-'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg px-4 py-3 xl:col-span-6">
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Comentarios Adicionales</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1 break-words whitespace-pre-wrap">{paciente.comentariosAdicionales || '-'}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Barra de acciones */}
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3.5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl text-green-800 font-bold">Fichas registradas</span>
                        <span className="inline-flex items-center justify-center h-8 min-w-[24px] px-2 rounded-full text-base font-bold bg-green-100 text-green-700">
                            {listaFichas.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={agendarPaciente}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-500 rounded-lg hover:from-violet-700 hover:to-purple-600 transition-all duration-150 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Agendar ahora
                        </button>

                        <button
                            onClick={() => listarFichasClinicasPaciente(id_paciente)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all duration-150">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                            Cargar Fichas
                        </button>




                        <button
                            onClick={() =>  verOdontogramas()}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all duration-150">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                            Odontogramas
                        </button>
                        <button
                            onClick={() => nuevaFichaClinica(id_paciente)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-lg hover:from-sky-700 hover:to-cyan-600 transition-all duration-150 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                            </svg>
                            Nueva Ficha
                        </button>
                    </div>
                </div>

                {/* Listado de fichas */}
                <div className="space-y-4">
                    {listaFichas.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p className="text-sm font-medium text-slate-400">No hay fichas cargadas</p>
                            <p className="text-xs text-slate-300 mt-1">Presione "Cargar Fichas" para visualizar el historial</p>
                        </div>
                    ) : (
                        listaFichas.map((ficha) => (
                            <div key={ficha.id_ficha} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">

                                {/* Cabecera ficha */}
                                <div className="flex flex-col gap-2 px-5 md:px-6 py-3.5 border-b border-slate-100 bg-slate-50/60">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-sky-100 text-sky-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                                </svg>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-base font-semibold text-green-800">Ficha Clinica № {ficha.id_ficha}</span>
                                                <span className="text-slate-200">|</span>
                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                    <span className="text-sm font-semibold text-sky-700">{formatearFecha(ficha.fechaConsulta)}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-11 sm:ml-0">
                                        <button
                                            onClick={() => editarFichaClinica(ficha.id_ficha)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors duration-150">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => eliminarFicha(ficha.id_ficha)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-150">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                            Eliminar
                                        </button>
                                        </div>
                                    </div>
                                    {/* Chips: Motivo + Profesional */}
                                    <div className="flex flex-wrap items-center gap-2 ml-11 sm:ml-0">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 border border-sky-100 text-xs font-medium text-sky-700">
                                            <span className="text-sky-400">Motivo Consulta:</span> {ficha.tipoAtencion || '-'}
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-50 border border-cyan-100 text-xs font-medium text-cyan-700">
                                            <span className="text-cyan-400">Profesional:</span> {ficha.observaciones || '-'}
                                        </span>
                                    </div>
                                </div>

                                {/* Cuerpo ficha */}
                                <div className="px-5 md:px-6 py-4">

                                    {/* Diagnóstico e Indicaciones */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                        <div className="flex flex-col gap-0.5 px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Diagnóstico</span>
                                            <span className="text-sm font-medium text-slate-700">{ficha.diagnostico || '-'}</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5 px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Indicaciones</span>
                                            <span className="text-sm font-medium text-slate-700">{ficha.indicaciones || '-'}</span>
                                        </div>
                                    </div>

                                    {/* Anotación clínica */}
                                    <div className="border-t border-slate-100 pt-4">
                                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Anotación Clínica</p>
                                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 rounded-lg px-4 py-3 border border-slate-100">
                                            {ficha.anotacionConsulta || 'Sin anotaciones registradas.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    )
}
