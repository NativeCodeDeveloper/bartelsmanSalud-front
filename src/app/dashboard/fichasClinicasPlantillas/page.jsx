"use client"

import {useEffect, useState} from "react"
import {toast} from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import {useRouter} from "next/navigation";

export default function FichasClinicasPlantillas() {

    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    // =============================================
    // ESTADOS
    // =============================================
    const [plantillas, setPlantillas] = useState([])

    // Modal nueva plantilla
    const [modalPlantilla, setModalPlantilla] = useState(false)
    const [nuevaPlantillaNombre, setNuevaPlantillaNombre] = useState("")
    const [nuevaPlantillaDescripcion, setNuevaPlantillaDescripcion] = useState("")

    // Modal editar plantilla
    const [modalEditarPlantilla, setModalEditarPlantilla] = useState(false)
    const [plantillaEditando, setPlantillaEditando] = useState(null)
    const [id_plantilla, setId_plantilla] = useState(null)

    // =============================================
    // HANDLERS
    // =============================================
    function abrirModalNuevaPlantilla() {
        setNuevaPlantillaNombre("")
        setNuevaPlantillaDescripcion("")
        setModalPlantilla(true)
    }

    function abrirModalEditarPlantilla(plantilla) {
        setPlantillaEditando(plantilla);
        setId_plantilla(plantilla.id_plantilla);
        setNuevaPlantillaNombre(plantilla.nombre);
        setNuevaPlantillaDescripcion(plantilla.descripcion);
        setModalEditarPlantilla(true);
    }

  async function insertarNuevaPlantilla(nombre,descripcion) {
        try {
            if (!nombre || !descripcion) {
                return toast.error(`Debe completar todos los campos para ingresar una nueva plantilla.`);
            }
            const res = await fetch(`${API}/fichaPlantilla/insertarPlantilla`, {
                method: "POST",
                headers: {Accept: "application/json",
                "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({nombre, descripcion})
            })
        if (!res.ok) {
            return toast.error(`Ha ocurrido un error en el servidor. Contacte a soporte.`);
        }
        const respuestaBackend = await res.json();
        if (respuestaBackend.message === true) {
            await limpiarFormularioIngreso();
            return toast.success(`Se ha ingresado correctamente una nueva plantilla de fichas clinicas.`);
        }else if (respuestaBackend.message === false) {
            return toast.error(`Ha ocurrido un error en el servidor. Informacion recibida no es correcta`);
        }else{
            return toast.error(`Ha ocurrido un error en el servidor. Contacte a soporte.`);
        }
        }catch(err) {
            console.log(err);
            return toast.error(`Ha ocurrido un error en el servidor. Contacte a soporte.`);
        }
    }

    async function editarPlantilla(nombre,descripcion, id_plantilla) {
        try {
            if (!nombre || !descripcion || !id_plantilla) {
                return toast.error(`Debe completar todos los campos para ingresar una nueva plantilla.`);
            }
            const res = await fetch(`${API}/fichaPlantilla/actualizarPlantilla`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({nombre, descripcion ,id_plantilla})
            })
            if (!res.ok) {
                return toast.error(`Ha ocurrido un error en el servidor. Contacte a soporte.`);
            }
            const respuestaBackend = await res.json();
            if (respuestaBackend.message === true) {
                await limpiarFormularioIngreso();
                return toast.success(`Se ha actualizado correctamente plantilla.`);
            }else if (respuestaBackend.message === false) {
                return toast.error(`Ha ocurrido un error en el servidor. Informacion recibida no es correcta`);
            }else{
                return toast.error(`Ha ocurrido un error en el servidor. Contacte a soporte.`);
            }
        }catch(err) {
            console.log(err);
            return toast.error(`Ha ocurrido un error en el servidor. Contacte a soporte.`);
        }
    }

    async function eliminarPlantilla(id_plantilla) {
        try {
            if (!id_plantilla) {
                return toast.error(`Debe seleccionar una platilla para eliminarla.`);
            }
            const res = await fetch(`${API}/fichaPlantilla/eliminarPlantilla`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_plantilla})
            })
            if (!res.ok) {
                return toast.error(`Ha ocurrido un error en el servidor. Contacte a soporte.`);
            }
            const respuestaBackend = await res.json();
            if (respuestaBackend.message === true) {
                await limpiarFormularioIngreso();
                return toast.success(`Se ha eliminado correctamente plantilla.`);
            }else if (respuestaBackend.message === false) {
                return toast.error(`Ha ocurrido un error en el servidor. Informacion recibida no es correcta`);
            }else{
                return toast.error(`Ha ocurrido un error en el servidor. Contacte a soporte.`);
            }
        }catch(err) {
            console.log(err);
            return toast.error(`Ha ocurrido un error en el servidor. Contacte a soporte.`);
        }
    }

    function seleccionarPlantilla(plantilla) {
        // TODO: Navegar a detalle o abrir categorías/campos
        console.log("Seleccionar plantilla:", plantilla.id_plantilla, plantilla.nombre)
    }

    // =============================================
    // FETCH
    // =============================================
    async function listarPlantillas(){
        try {
            const res = await fetch(`${API}/fichaPlantilla/listarPlantillas`, {
                method: "GET",
                headers: {Accept: "application/json"},
                mode: "cors"
            })
            const respuestaDataBackend = await res.json();
            if (Array.isArray(respuestaDataBackend) && respuestaDataBackend.length > 0) {
                setPlantillas(respuestaDataBackend)
            } else {
                setPlantillas([])
            }
        } catch(err) {
            console.log(err);
            return toast.error(`Ha ocurrido un problema contacte al equipo de soporte`);
        }
    }

    useEffect(() => {
        listarPlantillas()
    },[])


    async function limpiarFormularioIngreso(){
        await listarPlantillas();
        setNuevaPlantillaNombre("");
        setNuevaPlantillaDescripcion("");
    }


    function irACategoriaPlatilla(id_plantilla) {
        router.push(`/dashboard/fichasClinicasCategorias/${id_plantilla}`);
    }
    // =============================================
    // RENDER
    // =============================================
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 relative overflow-hidden">
<ToasterClient/>
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sky-100/40 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 -left-48 h-80 w-80 rounded-full bg-cyan-100/30 blur-3xl" />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                {/* ========== HEADER ========== */}
                <div className="mb-8 sm:mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 mb-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-600">Configuraci&oacute;n</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                                Plantillas de Ficha Cl&iacute;nica
                            </h1>
                            <p className="text-sm text-slate-500 mt-1.5 max-w-lg leading-relaxed">
                                Crea y administra las plantillas que usar&aacute;n los profesionales al registrar fichas cl&iacute;nicas.
                            </p>
                        </div>

                        <button
                            onClick={abrirModalNuevaPlantilla}
                            className="group inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-xl hover:from-sky-700 hover:to-cyan-600 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 self-start sm:self-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                            </svg>
                            Nueva Plantilla
                        </button>
                    </div>
                </div>

                {/* ========== LISTA DE PLANTILLAS ========== */}
                <div className="space-y-3 sm:space-y-4">

                    {/* Empty state */}
                    {plantillas.length === 0 && (
                        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] p-10 sm:p-14 text-center">
                            <div className="mx-auto mb-5 flex items-center justify-center h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <p className="text-slate-600 text-sm font-medium">No hay plantillas creadas todav&iacute;a</p>
                            <p className="text-slate-400 text-xs mt-1.5">Haz clic en &quot;Nueva Plantilla&quot; para crear la primera.</p>
                        </div>
                    )}

                    {plantillas.map((plantilla) => (
                        <div
                            key={plantilla.id_plantilla}
                            className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-[0_4px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.07)] transition-all duration-200 overflow-hidden"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 sm:py-5 gap-4">

                                {/* Info de la plantilla */}
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                    <div className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 shadow-sm shadow-sky-500/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm sm:text-base font-semibold text-slate-800 truncate">{plantilla.nombre}</h3>
                                        <p className="text-xs text-slate-400 mt-0.5 truncate">{plantilla.descripcion}</p>
                                    </div>
                                </div>

                                {/* Botones de accion */}
                                <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 pl-14 sm:pl-0">
                                    <button
                                        onClick={() => irACategoriaPlatilla(plantilla.id_plantilla)}
                                        className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-3 sm:px-4 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-lg hover:from-sky-700 hover:to-cyan-600 active:scale-[0.97] transition-all duration-150 shadow-sm shadow-sky-500/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                        <span>Seleccionar</span>
                                    </button>

                                    <button
                                        onClick={() => abrirModalEditarPlantilla(plantilla)}
                                        className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 active:scale-[0.97] transition-all duration-150"
                                        title="Editar plantilla"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                        <span className="hidden sm:inline">Editar</span>
                                    </button>

                                    <button
                                        onClick={() => eliminarPlantilla(plantilla.id_plantilla)}
                                        className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 text-xs font-medium text-red-500 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 active:scale-[0.97] transition-all duration-150"
                                        title="Eliminar plantilla"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                        <span className="hidden sm:inline">Eliminar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ========== MODAL: NUEVA PLANTILLA ========== */}
            {modalPlantilla && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalPlantilla(false)}/>
                    <div className="relative bg-white rounded-2xl shadow-[0_24px_80px_rgba(15,23,42,0.18)] w-full max-w-md overflow-hidden border border-slate-200/50">
                        {/* Header */}
                        <div className="relative px-6 py-5 bg-gradient-to-r from-sky-600 to-cyan-500 overflow-hidden">
                            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/10" />
                            <div className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5" />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-white/20 backdrop-blur-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Nueva Plantilla</h3>
                                </div>
                                <p className="text-sm text-white/70">Define el nombre y descripci&oacute;n de la plantilla</p>
                            </div>
                        </div>
                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    value={nuevaPlantillaNombre}
                                    onChange={(e) => setNuevaPlantillaNombre(e.target.value)}
                                    placeholder="Ej: Dermatolog&iacute;a, Pediatr&iacute;a..."
                                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 focus:bg-white transition-all placeholder:text-slate-400"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Descripci&oacute;n</label>
                                <textarea
                                    value={nuevaPlantillaDescripcion}
                                    onChange={(e) => setNuevaPlantillaDescripcion(e.target.value)}
                                    placeholder="Descripci&oacute;n breve de para qu&eacute; sirve esta plantilla..."
                                    rows={3}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 focus:bg-white transition-all resize-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                            <button
                                onClick={() => setModalPlantilla(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all duration-150"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={()=> insertarNuevaPlantilla(nuevaPlantillaNombre,nuevaPlantillaDescripcion)}
                                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-xl hover:from-sky-700 hover:to-cyan-600 active:scale-[0.97] transition-all duration-150 shadow-sm shadow-sky-500/25"
                            >
                                Crear Plantilla
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== MODAL: EDITAR PLANTILLA ========== */}
            {modalEditarPlantilla && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalEditarPlantilla(false)}/>
                    <div className="relative bg-white rounded-2xl shadow-[0_24px_80px_rgba(15,23,42,0.18)] w-full max-w-md overflow-hidden border border-slate-200/50">
                        {/* Header */}
                        <div className="relative px-6 py-5 bg-gradient-to-r from-sky-600 to-cyan-500 overflow-hidden">
                            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/10" />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-white/20 backdrop-blur-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Editar Plantilla</h3>
                                </div>
                                <p className="text-sm text-white/70">Modifica el nombre o descripci&oacute;n</p>
                            </div>
                        </div>
                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    value={nuevaPlantillaNombre}
                                    onChange={(e) => setNuevaPlantillaNombre(e.target.value)}
                                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 focus:bg-white transition-all placeholder:text-slate-400"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Descripci&oacute;n</label>
                                <textarea
                                    value={nuevaPlantillaDescripcion}
                                    onChange={(e) => setNuevaPlantillaDescripcion(e.target.value)}
                                    rows={3}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 focus:bg-white transition-all resize-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                            <button
                                onClick={() => setModalEditarPlantilla(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all duration-150"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={()=>  editarPlantilla(nuevaPlantillaNombre,nuevaPlantillaDescripcion,id_plantilla)}
                                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-xl hover:from-sky-700 hover:to-cyan-600 active:scale-[0.97] transition-all duration-150 shadow-sm shadow-sky-500/25"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
