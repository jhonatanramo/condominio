import { useState, useEffect, useCallback, useRef } from "react";
import { Barra } from "../../components/Navigation";
import api from "./../../api";
import Mos from './../css/componentes/Agendas.module.css';

export function Agendas() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [reservas, setReservas] = useState([]);
    const [visitas, setVisitas] = useState([]);
    const [areasSociales, setAreasSociales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedArea, setSelectedArea] = useState("");
    const [activeTab, setActiveTab] = useState("reservas");
    const [nuevaReserva, setNuevaReserva] = useState({
        horario_inicio: "08:00",
        horario_fin: "09:00",
        cantidad_gente: 1,
        persona: "",
        motivo: ""
    });

    // **NUEVO: Estados para el popover**
    const [showPopover, setShowPopover] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
    const popoverRef = useRef(null);

    // Obtener datos
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [reservasRes, visitasRes, areasRes] = await Promise.all([
                api.get("agenda/reserva/"),
                api.get("agenda/visita/"),
                api.get("data/areas-sociales/")
            ]);
            
            setReservas(Array.isArray(reservasRes.data) ? reservasRes.data : []);
            setVisitas(Array.isArray(visitasRes.data) ? visitasRes.data : []);
            setAreasSociales(Array.isArray(areasRes.data) ? areasRes.data : []);
        } catch (error) {
            console.error("Error al obtener datos:", error);
            alert("Error al cargar los datos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // **NUEVO: Cerrar popover al hacer clic fuera**
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setShowPopover(false);
                setSelectedEvent(null);
            }
        };

        if (showPopover) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopover]);

    // Navegación del calendario
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Generar días del mes comenzando en lunes
    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        const days = [];
        
        let firstDayOfWeek = firstDay.getDay();
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        // Días del mes anterior
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonthLastDay - i),
                isCurrentMonth: false,
                isToday: false
            });
        }
        
        // Días del mes actual
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            days.push({
                date,
                isCurrentMonth: true,
                isToday: date.toDateString() === today.toDateString()
            });
        }
        
        // Días del próximo mes para completar 6 semanas (42 días)
        const daysNeeded = 42 - days.length;
        for (let i = 1; i <= daysNeeded; i++) {
            const date = new Date(year, month + 1, i);
            days.push({
                date,
                isCurrentMonth: false,
                isToday: false
            });
        }
        
        return days;
    };

    // Obtener eventos para una fecha específica
    const getEventosForDate = (date) => {
        const fechaStr = date.toISOString().split('T')[0];
        
        if (activeTab === "reservas") {
            return reservas.filter(reserva => reserva.fecha === fechaStr);
        } else {
            return visitas.filter(visita => visita.fecha_ingreso === fechaStr);
        }
    };

    // Abrir modal para nuevo evento
    const openNewEventoModal = (date) => {
        setSelectedDate(date);
        if (activeTab === "reservas") {
            setShowModal(true);
        }
    };

    // **NUEVO: Abrir popover con detalles del evento**
    const openEventoPopover = (evento, clickEvent) => {
        setSelectedEvent(evento);
        
        // Calcular posición del popover
        const rect = clickEvent.currentTarget.getBoundingClientRect();
        setPopoverPosition({
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY
        });
        
        setShowPopover(true);
    };

    // Crear nueva reserva
    const handleCreateReserva = async () => {
        try {
            if (!selectedArea) {
                alert("Por favor selecciona un área social");
                return;
            }

            const reservaData = {
                ...nuevaReserva,
                area_social: selectedArea,
                fecha: selectedDate.toISOString().split('T')[0],
                estado: 'pendiente'
            };

            await api.post("reservas/crear/", reservaData);
            setShowModal(false);
            setNuevaReserva({
                horario_inicio: "08:00",
                horario_fin: "09:00",
                cantidad_gente: 1,
                persona: "",
                motivo: ""
            });
            setSelectedArea("");
            fetchData();
            alert("Reserva creada exitosamente");
        } catch (error) {
            console.error("Error al crear reserva:", error);
            alert("Error al crear la reserva");
        }
    };

    // Formatear hora
    const formatTime = (timeString) => {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };

    // Formatear fecha en español
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Obtener texto para mostrar en el calendario
    const getEventoText = (evento) => {
        if (activeTab === "reservas") {
            return `${evento.area_social__nombre || 'Área'} - ${formatTime(evento.horario_inicio)}`;
        } else {
            return `${evento.nombre_visitante} ${evento.apellido_paterno}`;
        }
    };

    // Obtener clase CSS según el estado
    const getEventoClass = (evento) => {
        if (activeTab === "reservas") {
            return Mos[`evento_${evento.estado}`] || Mos.evento_pendiente;
        } else {
            return Mos.evento_visita;
        }
    };

    // **NUEVO: Renderizar detalles del evento para el popover**
    const renderEventoDetails = () => {
        if (!selectedEvent) return null;

        if (activeTab === "reservas") {
            return (
                <div className={Mos.details_content}>
                    <h3 className={Mos.details_title}>📅 Detalles de la Reserva</h3>
                    
                    <div className={Mos.details_grid}>
                        <div className={Mos.detail_item}>
                            <span className={Mos.detail_label}>Área Social:</span>
                            <span className={Mos.detail_value}>{selectedEvent.area_social__nombre || 'No especificado'}</span>
                        </div>
                        
                        <div className={Mos.detail_item}>
                            <span className={Mos.detail_label}>Fecha:</span>
                            <span className={Mos.detail_value}>{formatDate(selectedEvent.fecha)}</span>
                        </div>
                        
                        <div className={Mos.detail_row}>
                            <div className={Mos.detail_item}>
                                <span className={Mos.detail_label}>Hora Inicio:</span>
                                <span className={Mos.detail_value}>{formatTime(selectedEvent.horario_inicio)}</span>
                            </div>
                            <div className={Mos.detail_item}>
                                <span className={Mos.detail_label}>Hora Fin:</span>
                                <span className={Mos.detail_value}>{formatTime(selectedEvent.horario_fin)}</span>
                            </div>
                        </div>
                        
                        <div className={Mos.detail_item}>
                            <span className={Mos.detail_label}>Cantidad de Personas:</span>
                            <span className={Mos.detail_value}>{selectedEvent.cantidad_gente}</span>
                        </div>
                        
                        <div className={Mos.detail_item}>
                            <span className={Mos.detail_label}>Estado:</span>
                            <span className={`${Mos.detail_value} ${Mos[`status_${selectedEvent.estado}`]}`}>
                                {selectedEvent.estado?.charAt(0).toUpperCase() + selectedEvent.estado?.slice(1)}
                            </span>
                        </div>
                        
                        <div className={Mos.detail_item}>
                            <span className={Mos.detail_label}>Reservado por:</span>
                            <span className={Mos.detail_value}>{selectedEvent.persona__nombre || 'No especificado'}</span>
                        </div>
                        
                        {selectedEvent.motivo && (
                            <div className={Mos.detail_item}>
                                <span className={Mos.detail_label}>Motivo:</span>
                                <span className={Mos.detail_value}>{selectedEvent.motivo}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className={Mos.details_actions}>
                        <button className={Mos.edit_button}>
                            ✏️ Editar Reserva
                        </button>
                        <button className={Mos.cancel_button}>
                            🗑️ Cancelar
                        </button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={Mos.details_content}>
                    <h3 className={Mos.details_title}>👥 Detalles de la Visita</h3>
                    
                    <div className={Mos.details_grid}>
                        <div className={Mos.detail_item}>
                            <span className={Mos.detail_label}>Visitante:</span>
                            <span className={Mos.detail_value}>
                                {selectedEvent.nombre_visitante} {selectedEvent.apellido_paterno} {selectedEvent.apellido_materno}
                            </span>
                        </div>
                        
                        <div className={Mos.detail_item}>
                            <span className={Mos.detail_label}>Fecha de Ingreso:</span>
                            <span className={Mos.detail_value}>{formatDate(selectedEvent.fecha_ingreso)}</span>
                        </div>
                        
                        {selectedEvent.fecha_salida && (
                            <div className={Mos.detail_item}>
                                <span className={Mos.detail_label}>Fecha de Salida:</span>
                                <span className={Mos.detail_value}>{formatDate(selectedEvent.fecha_salida)}</span>
                            </div>
                        )}
                        
                        <div className={Mos.detail_item}>
                            <span className={Mos.detail_label}>Teléfono:</span>
                            <span className={Mos.detail_value}>{selectedEvent.telefono || 'No especificado'}</span>
                        </div>
                        
                        <div className={Mos.detail_item}>
                            <span className={Mos.detail_label}>Correo Electrónico:</span>
                            <span className={Mos.detail_value}>{selectedEvent.correo_electronico || 'No especificado'}</span>
                        </div>
                        
                        <div className={Mos.detail_item}>
                            <span className={Mos.detail_label}>Empresa/Institución:</span>
                            <span className={Mos.detail_value}>{selectedEvent.empresa_institucion || 'No especificado'}</span>
                        </div>
                        
                        <div className={Mos.detail_item}>
                            <span className={Mos.detail_label}>Motivo de Visita:</span>
                            <span className={Mos.detail_value}>{selectedEvent.motivo || 'No especificado'}</span>
                        </div>
                        
                        <div className={Mos.detail_item}>
                            <span className={Mos.detail_label}>Autorizado por:</span>
                            <span className={Mos.detail_value}>{selectedEvent.autorizado?.nombre || 'No especificado'}</span>
                        </div>
                        
                        <div className={Mos.detail_item}>
                            <span className={Mos.detail_label}>Estado:</span>
                            <span className={`${Mos.detail_value} ${Mos.status_activa}`}>
                                {selectedEvent.estado_visita || 'Activa'}
                            </span>
                        </div>
                    </div>
                    
                    <div className={Mos.details_actions}>
                        <button className={Mos.edit_button}>
                            ✏️ Editar Visita
                        </button>
                        <button className={Mos.checkout_button}>
                            ✅ Registrar Salida
                        </button>
                    </div>
                </div>
            );
        }
    };

    const days = getDaysInMonth();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                       "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    return (
        <Barra>
            <div className={Mos.calendar_container}>
                {/* Header del Calendario */}
                <div className={Mos.calendar_header}>
                    <h1 className={Mos.calendar_title}>
                        Agenda de {activeTab === "reservas" ? "Reservas" : "Visitas"}
                    </h1>
                    <div className={Mos.calendar_controls}>
                        {/* Tabs para cambiar entre reservas y visitas */}
                        <div className={Mos.tabs}>
                            <button 
                                className={`${Mos.tab} ${activeTab === "reservas" ? Mos.active_tab : ""}`}
                                onClick={() => setActiveTab("reservas")}
                            >
                                📅 Reservas
                            </button>
                            <button 
                                className={`${Mos.tab} ${activeTab === "visitas" ? Mos.active_tab : ""}`}
                                onClick={() => setActiveTab("visitas")}
                            >
                                👥 Visitas
                            </button>
                        </div>
                        
                        <div className={Mos.controls_right}>
                            <button className={Mos.today_button} onClick={goToToday}>
                                Hoy
                            </button>
                            <div className={Mos.month_navigation}>
                                <button className={Mos.nav_button} onClick={goToPreviousMonth}>
                                    ‹
                                </button>
                                <h2 className={Mos.current_month}>
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h2>
                                <button className={Mos.nav_button} onClick={goToNextMonth}>
                                    ›
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className={Mos.loading}>
                        <p>Cargando {activeTab === "reservas" ? "reservas" : "visitas"}...</p>
                    </div>
                ) : (
                    <>
                        {/* Vista del Calendario */}
                        <div className={Mos.calendar}>
                            {/* Días de la semana */}
                            <div className={Mos.weekdays}>
                                {dayNames.map(day => (
                                    <div key={day} className={Mos.weekday}>
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Días del mes */}
                            <div className={Mos.days_grid}>
                                {days.map((day, index) => {
                                    const eventosDia = getEventosForDate(day.date);
                                    return (
                                        <div
                                            key={index}
                                            className={`${Mos.day} ${!day.isCurrentMonth ? Mos.other_month : ""} ${day.isToday ? Mos.today : ""}`}
                                            onClick={() => day.isCurrentMonth && openNewEventoModal(day.date)}
                                        >
                                            <div className={Mos.day_number}>
                                                {day.date.getDate()}
                                                {eventosDia.length > 0 && (
                                                    <span className={Mos.eventos_count}>
                                                        {eventosDia.length}
                                                    </span>
                                                )}
                                            </div>
                                            <div className={Mos.eventos_list}>
                                                {eventosDia.slice(0, 2).map((evento, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`${Mos.evento_item} ${getEventoClass(evento)}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEventoPopover(evento, e);
                                                        }}
                                                    >
                                                        <span className={Mos.evento_text}>
                                                            {getEventoText(evento)}
                                                        </span>
                                                    </div>
                                                ))}
                                                {eventosDia.length > 2 && (
                                                    <div className={Mos.more_eventos}>
                                                        +{eventosDia.length - 2} más
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* **NUEVO: Popover para detalles del evento */}
                        {showPopover && selectedEvent && (
                            <div 
                                ref={popoverRef}
                                className={Mos.popover}
                                style={{
                                    position: 'absolute',
                                    left: `${popoverPosition.x}px`,
                                    top: `${popoverPosition.y}px`,
                                }}
                            >
                                <div className={Mos.popover_content}>
                                    <button 
                                        className={Mos.popover_close}
                                        onClick={() => setShowPopover(false)}
                                    >
                                        ✕
                                    </button>
                                    {renderEventoDetails()}
                                </div>
                                <div className={Mos.popover_arrow}></div>
                            </div>
                        )}

                        {/* Modal para nueva reserva */}
                        {showModal && activeTab === "reservas" && (
                            <div className={Mos.modal_overlay} onClick={() => setShowModal(false)}>
                                <div className={Mos.modal_content} onClick={(e) => e.stopPropagation()}>
                                    <div className={Mos.modal_header}>
                                        <h3>Nueva Reserva - {selectedDate?.toLocaleDateString('es-ES')}</h3>
                                        <button className={Mos.close_button} onClick={() => setShowModal(false)}>
                                            ✕
                                        </button>
                                    </div>
                                    
                                    <div className={Mos.modal_body}>
                                        <div className={Mos.form_group}>
                                            <label>Área Social:</label>
                                            <select
                                                value={selectedArea}
                                                onChange={(e) => setSelectedArea(e.target.value)}
                                                className={Mos.form_select}
                                            >
                                                <option value="">Seleccionar área</option>
                                                {areasSociales.map(area => (
                                                    <option key={area.id} value={area.id}>
                                                        {area.nombre} - Capacidad: {area.capacidad_maxima}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className={Mos.form_row}>
                                            <div className={Mos.form_group}>
                                                <label>Hora Inicio:</label>
                                                <input
                                                    type="time"
                                                    value={nuevaReserva.horario_inicio}
                                                    onChange={(e) => setNuevaReserva({
                                                        ...nuevaReserva,
                                                        horario_inicio: e.target.value
                                                    })}
                                                    className={Mos.form_input}
                                                />
                                            </div>
                                            <div className={Mos.form_group}>
                                                <label>Hora Fin:</label>
                                                <input
                                                    type="time"
                                                    value={nuevaReserva.horario_fin}
                                                    onChange={(e) => setNuevaReserva({
                                                        ...nuevaReserva,
                                                        horario_fin: e.target.value
                                                    })}
                                                    className={Mos.form_input}
                                                />
                                            </div>
                                        </div>

                                        <div className={Mos.form_group}>
                                            <label>Cantidad de Personas:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={nuevaReserva.cantidad_gente}
                                                onChange={(e) => setNuevaReserva({
                                                    ...nuevaReserva,
                                                    cantidad_gente: parseInt(e.target.value)
                                                })}
                                                className={Mos.form_input}
                                            />
                                        </div>

                                        <div className={Mos.form_group}>
                                            <label>Motivo (opcional):</label>
                                            <textarea
                                                value={nuevaReserva.motivo}
                                                onChange={(e) => setNuevaReserva({
                                                    ...nuevaReserva,
                                                    motivo: e.target.value
                                                })}
                                                className={Mos.form_textarea}
                                                placeholder="Describe el motivo de la reserva..."
                                                rows="3"
                                            />
                                        </div>
                                    </div>

                                    <div className={Mos.modal_footer}>
                                        <button className={Mos.cancel_button} onClick={() => setShowModal(false)}>
                                            Cancelar
                                        </button>
                                        <button className={Mos.save_button} onClick={handleCreateReserva}>
                                            Crear Reserva
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Leyenda */}
                        <div className={Mos.legend}>
                            {activeTab === "reservas" ? (
                                <>
                                    <div className={Mos.legend_item}>
                                        <div className={`${Mos.legend_color} ${Mos.evento_pendiente}`}></div>
                                        <span>Pendiente</span>
                                    </div>
                                    <div className={Mos.legend_item}>
                                        <div className={`${Mos.legend_color} ${Mos.evento_confirmada}`}></div>
                                        <span>Confirmada</span>
                                    </div>
                                    <div className={Mos.legend_item}>
                                        <div className={`${Mos.legend_color} ${Mos.evento_cancelada}`}></div>
                                        <span>Cancelada</span>
                                    </div>
                                </>
                            ) : (
                                <div className={Mos.legend_item}>
                                    <div className={`${Mos.legend_color} ${Mos.evento_visita}`}></div>
                                    <span>Visitas</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Barra>
    );
}