"use client"
import {useEffect, useState} from "react";
import ShadcnInput from "@/Componentes/shadcnInput2";
import ShadcnButton2 from "@/Componentes/shadcnButton2";
import {useAgenda} from "@/ContextosGlobales/AgendaContext";
import {toast} from "react-hot-toast";
import {useParams, useRouter} from "next/navigation";
import {SelectDinamic} from "@/Componentes/SelectDinamic";

export default function FormularioReservaProfesional() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [nombrePaciente, setNombrePaciente] = useState("");
    const [apellidoPaciente, setApellidoPaciente] = useState("");
    const [rut, setRut] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const {horaInicio, horaFin, fechaInicio, fechaFinalizacion,} = useAgenda();
    const [listaTarifasProfesionales, setListaTarifasProfesionales] = useState([]);

    const [profesionalSeleccionado, setProfesionalSeleccionado] = useState("");
    const [servicioSeleccionado, setServicioSeleccionado] = useState("");
    const [tarifaSeleccionadaIndex, setTarifaSeleccionadaIndex] = useState("");
    const[descripcionProfesional, setDescripcionProfesional] = useState("");

    const {id_profesional} = useParams();

    const [totalPago, setTotalPago] = useState("");
    const router = useRouter();

    async function seleccionarProfesionalDatos(id_profesional) {
        try {
            const res = await fetch(`${API}/profesionales/seleccionarProfesional`, {
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json',},
                mode: 'cors',
                body: JSON.stringify({id_profesional}),
            })

            if (!res.ok) {
                return toast.error('Error al cargar los Tarifas y Servicios Profesionales, por favor intente nuevamente.');
            }else{

                const respustaBackend = await res.json();
                if(respustaBackend){
                    setProfesionalSeleccionado(respustaBackend[0].nombreProfesional);
                    setDescripcionProfesional(respustaBackend[0].descripcionProfesional);
                }else{
                    return toast.error('Error al cargar los Tarifas y Servicios Profesionales, por favor intente nuevamente .');
                }
            }
        }catch (error) {

            return toast.error('Error al cargar los tarifas y Servicios Profesionales, por favor intente nuevamente.');
        }
    }



    async function seleccionarTodasTarifasProfesionales(profesional_id) {
        try {
            const res = await fetch(`${API}/tarifasProfesional/seleccionarTarifasPorProfesional`, {
                method: 'POST',
                headers: {Accept: 'application/json',
                'Content-Type': 'application/json',},
                mode: 'cors',
                body: JSON.stringify({profesional_id}),
            })

            if (!res.ok) {
                return toast.error('Error al cargar los Tarifas y Servicios Profesionales, por favor intente nuevamente.');
            }else{

                const respustaBackend = await res.json();
                if(respustaBackend){
                    setListaTarifasProfesionales(respustaBackend);

                }else{
                    return toast.error('Error al cargar los Tarifas y Servicios Profesionales, por favor intente nuevamente .');
                }
            }
        }catch (error) {

            return toast.error('Error al cargar los tarifas y Servicios Profesionales, por favor intente nuevamente.');
        }
    }

    useEffect(() => {
        seleccionarTodasTarifasProfesionales(id_profesional);
        seleccionarProfesionalDatos(id_profesional)
    }, [id_profesional]);








    // handleSubmit: se ejecuta al enviar el formulario
    // Envía los datos al backend que crea la preferencia de Mercado Pago
    async function pagarMercadoPago(
        nombrePaciente,
        apellidoPaciente,
        rut,
        telefono,
        email,
        fechaInicio,
        horaInicio,
        fechaFinalizacion,
        horaFin,
        totalPago,
        profesionalSeleccionado,
        servicioSeleccionado,
        id_profesional
    ) {
        try {
            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !fechaFinalizacion || !horaFin || !id_profesional) {
                return toast.error("Debe completar toda la informacion para realizar la reserva")
            }

            if (totalPago <= 0) {
                return toast.error("Debe completar toda la informacion para realizar la reserva")
            }

            let horaFinalizacion = horaFin;

            const res = await fetch(`${API}/pagosMercadoPago/create-order`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tituloProducto: `Reserva Consulta: ${servicioSeleccionado} con ${profesionalSeleccionado}`,
                    precio: Number(totalPago),
                    cantidad: 1,
                    nombrePaciente,
                    apellidoPaciente,
                    rut,
                    telefono,
                    email,
                    fechaInicio,
                    horaInicio,
                    fechaFinalizacion,
                    horaFinalizacion,
                    estadoReserva : 'reservada',
                    totalPago,
                    id_profesional
                }),
                mode: "cors",
            });

            if (!res.ok) {
                return toast.error("No se puede procesar el pago por favor evalue otro medio de pago contactandonos por WhatsApp")
            }

            const data = await res.json();
            console.log("Respuesta create-order:", data);

            if (data) {

                //data.sandbox_init_point || PARA PRUEBAS LOCALES ||data?.init_point;
                const checkoutUrl = data?.init_point;
                console.log("checkoutUrl:", checkoutUrl);

                if (checkoutUrl) {
                    console.log(checkoutUrl);
                    window.location.href = checkoutUrl;

                } else {
                    return toast.error("No se puede procesar el pago. Problema a nivel del Link de init poiunt")
                }
            } else {
                return toast.error("No se puede procesar el pago. Intenet mas tarde.")

            }
        } catch (err) {
            console.error(err);
            return toast.error("No se puede procesar el pago por favor evalue otro medio de pago contactandonos por WhatsApp")

        }
    }



    const formatoCLP = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });




    function volver(id_profesional) {
        router.push(`/agendaEspecificaProfersional/${id_profesional}`);
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">

                {/* Header */}
                <header className="animate-reveal-up mb-10 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-slate-500 shadow-sm">
                        Reserva Online
                    </div>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        {profesionalSeleccionado || "Cargando..."}
                    </h1>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                        {descripcionProfesional}
                    </p>
                    <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
                </header>

                <form
                    className="animate-reveal-up-delay space-y-8 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur sm:p-8"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    {/* Servicio */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Servicio</h2>
                        <div className="mt-1 h-px w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent"></div>
                        <div className="mt-4">
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Motivo de consulta</label>
                            <SelectDinamic
                                value={tarifaSeleccionadaIndex}
                                onChange={(e) => {
                                    const index = e.target.value;
                                    setTarifaSeleccionadaIndex(index);
                                    const tarifa = listaTarifasProfesionales[index];
                                    if (tarifa) {
                                        setTotalPago(tarifa.precio);
                                        setServicioSeleccionado(tarifa.nombreServicio);
                                    }
                                }}
                                placeholder="Seleccione un servicio"
                                options={listaTarifasProfesionales.map((tarifa, index) => ({
                                    value: index,
                                    label: `${tarifa.nombreServicio} - ${formatoCLP.format(tarifa.precio)}`
                                }))}
                                className={tarifaSeleccionadaIndex !== "" ? "border-emerald-400 bg-emerald-50/50 font-medium text-slate-900" : ""}
                            />
                        </div>
                    </div>

                    {/* Datos personales */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Datos personales</h2>
                        <div className="mt-1 h-px w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent"></div>
                        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Nombre</label>
                                <ShadcnInput
                                    value={nombrePaciente}
                                    onChange={(e) => setNombrePaciente(e.target.value)}
                                    placeholder="Ej: Ana"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Apellido</label>
                                <ShadcnInput
                                    value={apellidoPaciente}
                                    onChange={(e) => setApellidoPaciente(e.target.value)}
                                    placeholder="Ej: Pérez"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">RUT</label>
                                <ShadcnInput
                                    value={rut}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                                        setRut(value);
                                    }}
                                    placeholder="12345678K (Sin puntos ni guion)"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Correo electrónico</label>
                                <ShadcnInput
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ejemplo@correo.cl"
                                    className="w-full"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Teléfono</label>
                                <ShadcnInput
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    placeholder="+56 9 1234 5678"
                                    className="w-full sm:max-w-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resumen */}
                    {(fechaInicio || horaInicio || totalPago) && (
                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Resumen de tu cita</h2>
                            <div className="mt-1 h-px w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent"></div>
                            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {fechaInicio && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs text-white">D</div>
                                            <div>
                                                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Fecha</p>
                                                <p className="text-sm font-semibold text-slate-800">{fechaInicio.toString()}</p>
                                            </div>
                                        </div>
                                    )}
                                    {horaInicio && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs text-white">H</div>
                                            <div>
                                                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Horario</p>
                                                <p className="text-sm font-semibold text-slate-800">{horaInicio.toString()} – {horaFin.toString()}</p>
                                            </div>
                                        </div>
                                    )}
                                    {totalPago && (
                                        <div className="flex items-center gap-3 sm:col-span-2">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">$</div>
                                            <div>
                                                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Valor consulta</p>
                                                <p className="text-sm font-bold text-emerald-700">{formatoCLP.format(totalPago)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Acciones */}
                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

                            <ShadcnButton2 nombre={"RETROCEDER"} funcion={()=>volver(id_profesional)}/>

                        <ShadcnButton2
                            nombre={"FINALIZAR"}
                            funcion={(e) => {
                                if (e?.preventDefault) e.preventDefault();
                                if (e?.stopPropagation) e.stopPropagation();

                                return pagarMercadoPago(
                                    nombrePaciente,
                                    apellidoPaciente,
                                    rut,
                                    telefono,
                                    email,
                                    fechaInicio,
                                    horaInicio,
                                    fechaFinalizacion,
                                    horaFin,
                                    totalPago,
                                    profesionalSeleccionado,
                                    servicioSeleccionado,
                                    id_profesional
                                );
                            }}
                        />
                    </div>
                </form>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Revisa que los datos sean correctos antes de confirmar tu reserva.
                </p>

            </div>
        </div>
    )
}
