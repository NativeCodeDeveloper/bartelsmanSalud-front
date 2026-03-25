"use client"

import React, { useState, useEffect } from "react";
import {toast, Toaster} from "react-hot-toast";
import {InfoButton} from "@/Componentes/InfoButton";

export default function Publicaciones() {
    const [file, setfile] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    // Estados para insertar nueva publicación (1 imagen)
    const [newDescripcion, setNewDescripcion] = useState("");
    const [newFile, setNewFile] = useState(null);
    const [newPreview, setNewPreview] = useState(null);
    const [isInserting, setIsInserting] = useState(false);


    const [descripcionPublicaciones, setDescripcionPublicaciones] = useState("");
    const [listaPublicaciones, setListaPublicaciones] = useState([]);
    const [id_publicaciones, setId_publicaciones] = useState("");



    // API INTERNA PARA HACER LOS FETH DIRECTO AL BACKEND NO USAR http://localhost:3001 PORQUE COMPLICA EL DESPLIEGUE EN LA NUBE
    const API = process.env.NEXT_PUBLIC_API_URL;
    // Límite de tamaño de Cloudinary (plan gratuito) ≈ 10 MB
    const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

    /**
     * Redimensiona/comprime una imagen usando canvas.
     * - Mantiene proporción.
     * - Convierte a JPEG para una mejor compresión.
     * @param {File|Blob} file
     * @param {number} maxW
     * @param {number} maxH
     * @param {number} quality 0..1
     * @returns {Promise<Blob>}
     */
    async function downscaleImage(file, maxW = 1600, maxH = 1600, quality = 0.8) {
        const img = document.createElement("img");
        const objectUrl = URL.createObjectURL(file);
        try {
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = objectUrl;
            });
            const { width, height } = img;
            const scale = Math.min(maxW / width, maxH / height, 1);
            const targetW = Math.max(1, Math.round(width * scale));
            const targetH = Math.max(1, Math.round(height * scale));

            const canvas = document.createElement("canvas");
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, targetW, targetH);

            return await new Promise((resolve) =>
                canvas.toBlob(
                    (blob) => resolve(blob),
                    "image/jpeg",
                    quality
                )
            );
        } finally {
            URL.revokeObjectURL(objectUrl);
        }
    }





    async function actuzalizarPublicaciones(
        descripcionPublicaciones,
        imagenPublicaciones_primera,
        imagenPublicaciones_segunda,
        imagenPublicaciones_tercera,
        id_publicaciones) {

        try {
            const res = await fetch(`${API}/publicaciones/actualizarPublicacion`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    descripcionPublicaciones,
                    imagenPublicaciones_primera,
                    imagenPublicaciones_segunda,
                    imagenPublicaciones_tercera,
                    id_publicaciones
                }),
                mode: "cors",
                cache: "no-cache"
            })
            const resultado = await res.json();
            if (!res.ok) {
                return toast.error(" ❌ No fue posible actulizar la publicacion seleccionada, porfavor contacte a soporte informatico de NativeCode.cl");

            }else{
                if (resultado.message === "sindato"){
                    return  toast.error(' ❌ No fue posible actulizar la publicacion / Debe llenar los campos obligartirios');
                }
                if (resultado.message === "true"){
                    return  toast.success(' ✅ Se ha actualizado con la publicacion de manera exitosa');
                }
            }
        }catch (error) {
            return toast.error(" ❌ No fue posible actulizar la publicacion seleccionada, porfavor contacte a soporte informatico de NativeCode.cl");
        }

    }





    async function eliminarPublicacion(id_publicaciones) {
        try {
            const res = await fetch(`${API}/publicaciones/eliminarPublicacion`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({id_publicaciones}),
                mode: "cors",
                cache: "no-cache"
            });

            const resultado = await res.json();

            if(!res.ok) {
                return toast.error(" ❌ No se ha podido eliminar publicacion consulte con soporte de NativeCode ");
            }else{

                if(resultado.message === "sindato"){
                    return toast.error(" ❌ No se ha podido eliminar publicacion / Debe seleccionar la publicacion que desea eliminar ");
                }

                if(resultado.message === true){
                    await listarPublicaciones();
                    return  toast.success(' ✅ Se ha eliminado la publicacion de manera exitosa');
                }
            }

        }catch (error) {
            return toast.error(" ❌ No se ha podido eliminar publicacion consulte con soporte de NativeCode ");        }
    }




    async function listarPublicaciones() {
        try {
            const res = await fetch(`${API}/publicaciones/seleccionarPublicaciones`, {
                method: "GET",
                headers: {Accept: "application/json"},
                mode: "cors",
                cache: "no-cache"
            })

            if(!res.ok) {
                console.error("No se han podido Listar Publicaciones / Falla en el fetch desde el frontEnd");
                setListaPublicaciones([])
                return[]
            }else {
                const publicaciones = await res.json();
                setListaPublicaciones(publicaciones);
                return publicaciones;
            }
        }catch(err) {
            console.error("Problema al consultar Backen desde la vista fronend:"+err);
        }
    }


    useEffect(() => {
        listarPublicaciones();
    }, []);


    async function insertarPublicacion(
        descripcionPublicaciones,
        imagenPublicaciones_primera,
        imagenPublicaciones_segunda,
        imagenPublicaciones_tercera
    ){
        if (!descripcionPublicaciones || !imagenPublicaciones_primera){
            toast.error("Campo descripcion obligatorio / Primera Imagen Obligatoria");
            return;
        }
        try {
            const res = await fetch(`${API}/publicaciones/insertarPublicacion`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    descripcionPublicaciones,
                    imagenPublicaciones_primera,
                    imagenPublicaciones_segunda,
                    imagenPublicaciones_tercera
                }),
                mode: "cors",
                cache: "no-store"
            })
            if(!res.ok){
                toast.error("Ha habido un problema al consultar el servidor. Consulte con el equipo de Soporte de NativeCode.")
            }else{
                const data = await res.json();
                if (data.message === "true" ){
                    toast.success('Se ha insertado una nueva publicacion con exito!');
                }
            }
        }catch (e) {
            console.error(e);
        }
    }


    // Nuevo: manejar selección de archivos dependiendo del id de publicación seleccionado
    function handleFileChange(e) {
        const files = Array.from(e.target.files || []);
        // Si la publicación seleccionada no es la 10 -> solo 1 imagen permitida
        if (id_publicaciones && Number(id_publicaciones) !== 10) {
            if (files.length > 1) {
                toast('Solo se permite 1 imagen para esta publicación. Se usará la primera seleccionada.', {icon: '⚠️'});
            }
            setfile(files.slice(0, 1));
            return;
        }
        // Si no hay id o si id === 10, permitir hasta 3 imágenes
        if (files.length > 3) {
            toast('Has seleccionado más de 3 imágenes. Se usarán las primeras 3.', {icon: '⚠️'});
        }
        setfile(files.slice(0, 3));
    }

    // Nuevo: controlar el archivo de inserción (solo 1 imagen)
    function handleNewFileChange(e) {
        const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        setNewFile(f);
        if (f) {
            try{
                const preview = URL.createObjectURL(f);
                setNewPreview(preview);
            }catch(err){
                setNewPreview(null);
            }
        } else {
            setNewPreview(null);
        }
    }

    // Tipos MIME permitidos por Cloudflare Images
    const ALLOWED_IMAGE_TYPES = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml"
    ];

    async function handleInsertSubmit(e){
        e.preventDefault();
        if (!newDescripcion || !newFile){
            toast.error('Descripción e imagen son obligatorios para insertar');
            return;
        }
        // Validar tipo MIME antes de subir
        if (!ALLOWED_IMAGE_TYPES.includes(newFile.type)) {
            toast.error('El archivo debe ser una imagen JPG, PNG, WEBP, GIF o SVG');
            return;
        }
        setIsInserting(true);
        try{
            let toUpload = newFile;
            if (toUpload.size > MAX_UPLOAD_SIZE){
                const compressed = await downscaleImage(toUpload, 1600, 1600, 0.82);
                if (compressed) toUpload = new File([compressed], (newFile.name || 'image') + '.jpg', {type: 'image/jpeg'});
            }
            // Validar tipo MIME tras compresión
            if (!ALLOWED_IMAGE_TYPES.includes(toUpload.type)) {
                toast.error('El archivo comprimido no es un tipo de imagen válido para Cloudflare');
                setIsInserting(false);
                return;
            }
            if (toUpload.size > MAX_UPLOAD_SIZE){
                toast.error('La imagen excede 10MB incluso tras compresión');
                setIsInserting(false);
                return;
            }
            const formData = new FormData();
            formData.append('image', toUpload); // el backend espera 'image'
            const res = await fetch(`${API}/cloudflare/subirimagenes`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok){
                const errText = await res.text();
                console.error('Error subiendo nueva imagen a Cloudflare:', res.status, errText);
                toast.error('Error subiendo imagen a Cloudflare');
                setIsInserting(false);
                return;
            }

            const data = await res.json();
            if (!data.ok || !data.imageId) {
                toast.error('Error al subir imagen a Cloudflare');
                setIsInserting(false);
                return;
            }

            const imageId = data.imageId;
            // Llamar a insertarPublicacion (usa la función existente)
            await insertarPublicacion(newDescripcion, imageId, "", "");
            await listarPublicaciones();
            setNewDescripcion("");
            setNewFile(null);
            if (newPreview) {
                URL.revokeObjectURL(newPreview);
                setNewPreview(null);
            }
            toast.success('Publicación insertada correctamente');
        }catch(err){
            console.error(err);
            toast.error('Error al insertar publicación');
        }finally{
            setIsInserting(false);
        }
    }

    // Ajuste: quitar selected del option para evitar warning de React controlado
    useEffect(() => {
        listarPublicaciones();
    }, []);




    //LLAMADA A HASH DE CLOUDFLARE
    const CLOUDFLARE_HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_HASH;
    const VARIANT_CARD = 'card';
    const VARIANT_FULL = 'full';
    const VARIANT_MINI = 'mini';
    const VARIANT_PORTADA = 'portada';

    // Utilidad para construir la URL de entrega de Cloudflare
    function cfToSrc(imageId, variant = VARIANT_CARD) {
        if (!imageId) return "";
        // Si ya es una URL completa (por compatibilidad), la retorna tal cual
        if (imageId.startsWith("http")) return imageId;
        return `https://imagedelivery.net/${CLOUDFLARE_HASH}/${imageId}/${variant}`;
    }



    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
            {/* Toaster global para esta página */}
            <Toaster position="top-right" reverseOrder={false} />
            {/* FORMULARIOS COMPACTOS: Actualizar e Insertar, lado a lado en pantallas medianas+ */}


<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="space-y-1">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">Publicaciones</h1>
        <p className="text-sm text-gray-500">
            Administra las imágenes que se muestran en el carrusel bajo la portada.
        </p>
    </div>

    <div className="flex justify-start sm:justify-end">
        <InfoButton informacion={'Nota informativa:\n' +
            'Este apartado está diseñado exclusivamente para la carga de imágenes que serán visualizadas en el carrusel ubicado debajo de la portada de la página principal.\n' +
            'Las imágenes cargadas en esta sección no se mostrarán en ninguna otra área del sitio.\n' +
            '\n' +
            'La carga se realiza de una imagen por vez.\n' +
            'En caso de presentar inconvenientes durante el proceso, se recomienda intentar nuevamente utilizando una imagen de menor tamaño.\n' +
            'Para un mejor rendimiento y compatibilidad, se sugiere utilizar formatos PNG o JPG.\n'}/>
    </div>
</div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Actualizar publicación */}
                <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <h2 className="text-base sm:text-lg font-semibold mb-4">Actualizar publicación</h2>

                    {/* Selector de publicación (antes estaba en "Administrar publicaciones") */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona una publicación</label>
                        <select
                            className="w-full h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                            value={id_publicaciones}
                            onChange={(e) => setId_publicaciones(e.target.value)}
                        >
                            <option value="" disabled>-- Selecciona una Publicacion --</option>
                            {listaPublicaciones.map((publicaciones) => (
                                <option value={publicaciones.id_publicaciones} key={publicaciones.id_publicaciones}>
                                    {publicaciones.descripcionPublicaciones}
                                </option>
                            ))}
                        </select>
                    </div>

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setIsUploading(true);
                            if (!file || file.length === 0) {
                                setIsUploading(false);
                                toast.error("Selecciona al menos una imagen");
                                return;
                            }
                            // Validar tipos MIME antes de subir
                            for (const f of file) {
                                if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
                                    setIsUploading(false);
                                    toast.error('Solo se permiten imágenes JPG, PNG, WEBP, GIF o SVG');
                                    return;
                                }
                            }
                            const uploadedIds = [];
                            for (const f of file) {
                                let toUpload = f;
                                if (toUpload.size > MAX_UPLOAD_SIZE) {
                                    console.warn("Imagen supera 10MB, intentando comprimir...", {
                                        nombre: toUpload.name,
                                        sizeMB: (toUpload.size / (1024*1024)).toFixed(2)
                                    });
                                    const compressed = await downscaleImage(toUpload, 1600, 1600, 0.82);
                                    if (compressed && compressed.size < toUpload.size) {
                                        toUpload = new File([compressed], (f.name || "image") + ".jpg", { type: "image/jpeg" });
                                    }
                                }
                                // Validar tipo MIME tras compresión
                                if (!ALLOWED_IMAGE_TYPES.includes(toUpload.type)) {
                                    setIsUploading(false);
                                    toast.error('El archivo comprimido no es un tipo de imagen válido para Cloudflare');
                                    return;
                                }
                                if (toUpload.size > MAX_UPLOAD_SIZE) {
                                    setIsUploading(false);
                                    toast.error("La imagen excede 10 MB incluso tras compresión. Por favor, súbela con menor resolución o peso.");
                                    return;
                                }
                                const formData = new FormData();
                                formData.append("image", toUpload);
                                const res = await fetch(`${API}/cloudflare/subirimagenes`, {
                                    method: "POST",
                                    body: formData,
                                });
                                if (!res.ok) {
                                    setIsUploading(false);
                                    const errText = await res.text();
                                    console.error("Error subiendo una imagen a Cloudflare:", res.status, errText);
                                    toast.error("Error subiendo una imagen a Cloudflare.");
                                    return;
                                }
                                const data = await res.json();
                                if (!data.ok || !data.imageId) {
                                    setIsUploading(false);
                                    toast.error("Error al subir imagen a Cloudflare");
                                    return;
                                }
                                uploadedIds.push(data.imageId);
                            }
                            await actuzalizarPublicaciones(
                                descripcionPublicaciones,
                                uploadedIds[0] || "",
                                uploadedIds[1] || "",
                                uploadedIds[2] || "",
                                id_publicaciones
                            );
                            await listarPublicaciones();
                            setfile([]);
                            setDescripcionPublicaciones("");
                            setIsUploading(false);
                        }}
                        className="space-y-4"
                    >
                        <div className="space-y-3">
                            <input
                                type="text"
                                name="descripcionPublicaciones"
                                value={descripcionPublicaciones || ""}
                                onChange={(e) => setDescripcionPublicaciones(e.target.value)}
                                className="w-full h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                placeholder="Nueva descripción"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm transition file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                            />
                            <div className="text-xs text-gray-500">
                                {id_publicaciones && Number(id_publicaciones) !== 10 ? (
                                    <span>Esta publicación admite una sola imagen.</span>
                                ) : (
                                    <span>Puede subir hasta 3 imágenes.</span>
                                )}
                            </div>

                            {isUploading && (
                                <div className="mt-1 flex items-center gap-2 text-blue-600 text-sm">
                                    <span className="inline-block h-4 w-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                                    <span>Subiendo imagen a la nube...</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <button
                                className={`inline-flex items-center justify-center h-11 px-6 rounded-2xl font-semibold shadow-sm transition active:scale-[0.99] ${isUploading ? "bg-blue-50 text-blue-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                                type="submit"
                                disabled={isUploading}
                            >
                                Actualizar publicación
                            </button>
                        </div>
                    </form>
                </section>

                {/* Insertar nueva publicación */}
                <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <h2 className="text-base sm:text-lg font-semibold mb-4">Insertar nueva publicación (1 imagen)</h2>
                    <form onSubmit={handleInsertSubmit} className="space-y-4">
                        <input
                            type="text"
                            className="w-full h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            placeholder="Descripción"
                            value={newDescripcion}
                            onChange={(e) => setNewDescripcion(e.target.value)}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleNewFileChange}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm transition file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                        />
                        {newPreview && (
                            <div className="w-full max-w-[220px] aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
                                <img src={newPreview} alt="preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div>
                            <button
                                type="submit"
                                disabled={isInserting}
                                className={`inline-flex items-center justify-center h-11 px-6 rounded-2xl font-semibold shadow-sm transition active:scale-[0.99] ${isInserting ? "bg-blue-50 text-blue-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                            >
                                {isInserting ? "Insertando..." : "Insertar publicación"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>

            <section aria-labelledby="publications-title" className="space-y-4">
                <h2 id="publications-title" className="text-2xl font-semibold tracking-tight">Publicaciones</h2>
                {listaPublicaciones.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-gray-500">Aún no hay publicaciones.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listaPublicaciones.map((publicaciones) => (
                            <article key={publicaciones.id_publicaciones} className="group rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-shadow">
                                <div className="p-4">
                                    <h3 className="text-base font-medium truncate" title={publicaciones.descripcionPublicaciones}>{publicaciones.descripcionPublicaciones}</h3>
                                </div>
                                <div className="p-4 pt-0">
                                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-black/5">
                                        {publicaciones.imagenPublicaciones_primera ? (
                                            <>
                                                <img
                                                    src={cfToSrc(publicaciones.imagenPublicaciones_primera, VARIANT_FULL)}
                                                    alt=""
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                                />
                                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />
                                            </>
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-300">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 flex items-center justify-between gap-3">

                                    </div>
                                </div>
                                <div className="p-4 flex gap-3">
                                    <button
                                        onClick={async () => {
                                            if (Number(publicaciones.id_publicaciones) === 10) {
                                                toast.error('No se puede eliminar la publicación con id 10');
                                                return;
                                            }
                                            if (!confirm('¿Deseas eliminar esta publicación?')) return;
                                            await eliminarPublicacion(publicaciones.id_publicaciones);
                                        }}
                                        className={`inline-flex items-center justify-center px-3 py-2 rounded-2xl text-white text-sm font-medium shadow-sm transition ${Number(publicaciones.id_publicaciones) === 10 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                                        disabled={Number(publicaciones.id_publicaciones) === 10}
                                    >Eliminar</button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>


        </div>)




}

