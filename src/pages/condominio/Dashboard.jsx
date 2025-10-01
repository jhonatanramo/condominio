import { useEffect, useState } from "react";
import { Barra } from "../../components/Navigation";
import styles from "./../css/componentes/Dashboard.module.css";
import api from "./../../api";

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [visitas, setVisitas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [metricasFinancieras, setMetricasFinancieras] = useState(null);
  const [ingresosPorMes, setIngresosPorMes] = useState([]);
  const [pagosPendientes, setPagosPendientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        const [
          statsRes, 
          visitasRes, 
          reservasRes, 
          metricasRes, 
          ingresosRes, 
          pagosRes
        ] = await Promise.all([
          api.get("/dashboard/stats/"),
          api.get("/dashboard/ultimas-visitas/"),
          api.get("/dashboard/proximas-reservas/"),
          api.get("/dashboard/metricas-financieras/"),
          api.get("/dashboard/ingresos-por-mes/"),
          api.get("/dashboard/pagos-pendientes/")
        ]);

        setStats(statsRes.data);
        setVisitas(visitasRes.data);
        setReservas(reservasRes.data);
        setMetricasFinancieras(metricasRes.data);
        setIngresosPorMes(ingresosRes.data);
        setPagosPendientes(pagosRes.data);
        
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  if (loading) {
    return (
      <Barra>
        <div className={styles.contenedor}>
          <div className={styles.loading}>Cargando dashboard...</div>
        </div>
      </Barra>
    );
  }

  return (
    <Barra>
      <div className={styles.contenedor}>
        <h1>📊 Dashboard Condominio</h1>

        {/* Estadísticas Generales */}
        {stats && (
          <>
            <h2>📈 Estadísticas Generales</h2>
            <div className={styles.statsGrid}>
              <div className={styles.card}>
                <h3>👥 Total Visitas</h3>
                <p className={styles.statNumber}>{stats.total_visitas}</p>
              </div>
              <div className={styles.card}>
                <h3>📅 Total Reservas</h3>
                <p className={styles.statNumber}>{stats.total_reservas}</p>
              </div>
              <div className={styles.card}>
                <h3>📍 Visitas Hoy</h3>
                <p className={styles.statNumber}>{stats.visitas_hoy}</p>
              </div>
              <div className={styles.card}>
                <h3>🕐 Reservas Hoy</h3>
                <p className={styles.statNumber}>{stats.reservas_hoy}</p>
              </div>
            </div>
          </>
        )}

        {/* Métricas Financieras */}
        {metricasFinancieras && (
          <>
            <h2>💰 Métricas Financieras</h2>
            <div className={styles.statsGrid}>
              <div className={`${styles.card} ${styles.financialCard}`}>
                <h3>Ingresos Mes Actual</h3>
                <p className={styles.amount}>{formatCurrency(metricasFinancieras.ingresos_mes_actual)}</p>
                <span className={metricasFinancieras.variacion_ingresos >= 0 ? styles.positive : styles.negative}>
                  {metricasFinancieras.variacion_ingresos >= 0 ? '↑' : '↓'} 
                  {Math.abs(metricasFinancieras.variacion_ingresos)}% vs mes anterior
                </span>
              </div>
              
              <div className={`${styles.card} ${styles.financialCard}`}>
                <h3>Tasa de Ocupación</h3>
                <p className={styles.amount}>{metricasFinancieras.tasa_ocupacion}%</p>
                <span>{metricasFinancieras.unidades_ocupadas}/{metricasFinancieras.total_unidades} unidades</span>
              </div>
              
              <div className={`${styles.card} ${styles.financialCard}`}>
                <h3>Ingresos Proyectados</h3>
                <p className={styles.amount}>{formatCurrency(metricasFinancieras.ingresos_proyectados)}</p>
                <span>Mensuales</span>
              </div>
              
              <div className={`${styles.card} ${styles.financialCard}`}>
                <h3>Ingresos Anuales</h3>
                <p className={styles.amount}>{formatCurrency(metricasFinancieras.ingresos_anuales)}</p>
                <span>Año {new Date().getFullYear()}</span>
              </div>
            </div>
          </>
        )}

        {/* Gráfico de Ingresos */}
        {ingresosPorMes.length > 0 && (
          <div className={styles.chartSection}>
            <h2>📈 Ingresos Últimos 12 Meses</h2>
            <div className={styles.chartContainer}>
              <div className={styles.simpleChart}>
                {ingresosPorMes.map((mes, index) => {
                  const maxIngreso = Math.max(...ingresosPorMes.map(m => m.ingresos || 1));
                  const altura = Math.max(10, (mes.ingresos / maxIngreso) * 100);
                  
                  return (
                    <div key={index} className={styles.chartBar}>
                      <div className={styles.barLabel}>{mes.mes_nombre}</div>
                      <div className={styles.barContainer}>
                        <div 
                          className={styles.barFill}
                          style={{ height: `${altura}%` }}
                        ></div>
                      </div>
                      <div className={styles.barValue}>{formatCurrency(mes.ingresos)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Pagos Pendientes */}
        {pagosPendientes.length > 0 && (
          <div className={styles.pendingSection}>
            <h2>⚠️ Pagos Pendientes ({pagosPendientes.length})</h2>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Unidad</th>
                    <th>Propietario</th>
                    <th>Valor Mensual</th>
                    <th>Estado</th>
                    <th>Días en Mora</th>
                    <th>Vencimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosPendientes.map((pago, index) => (
                    <tr key={index}>
                      <td>{pago.unidad_str}</td>
                      <td>{pago.propietario}</td>
                      <td>{formatCurrency(pago.valor_mensual)}</td>
                      <td>
                        <span className={pago.estado === 'ocupado' ? styles.statusOccupied : styles.statusAvailable}>
                          {pago.estado}
                        </span>
                      </td>
                      <td className={pago.dias_mora > 15 ? styles.overdue : styles.pending}>
                        {pago.dias_mora} días
                      </td>
                      <td className={styles.date}>
                        {new Date(pago.fecha_vencimiento).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pagosPendientes.length === 0 && metricasFinancieras && (
          <div className={styles.successMessage}>
            ✅ Todos los pagos están al día
          </div>
        )}

        {/* Visitas y Reservas */}
        <div className={styles.gridContainer}>
          <div className={styles.column}>
            <h2>👥 Últimas Visitas</h2>
            <div className={styles.listContainer}>
              {visitas.length > 0 ? visitas.map(v => (
                <div key={v.id} className={styles.listItem}>
                  <div className={styles.listItemHeader}>
                    <strong>{v.visitante}</strong>
                    <span className={styles.date}>
                      {new Date(v.fecha).toLocaleDateString('es-ES')} {v.hora?.substring(0, 5)}
                    </span>
                  </div>
                  <div className={styles.listItemDetails}>
                    <span>📞 {v.telefono}</span>
                    <span>🏠 {v.unidad}</span>
                    {v.motivo && <span>📝 {v.motivo}</span>}
                  </div>
                  <small>Autorizado por: {v.autorizado_por}</small>
                </div>
              )) : (
                <div className={styles.emptyState}>No hay visitas recientes</div>
              )}
            </div>
          </div>

          <div className={styles.column}>
            <h2>📅 Próximas Reservas</h2>
            <div className={styles.listContainer}>
              {reservas.length > 0 ? reservas.map(r => (
                <div key={r.id} className={styles.listItem}>
                  <div className={styles.listItemHeader}>
                    <strong>{r.area_social}</strong>
                    <span className={`${styles.status} ${styles[r.estado]}`}>
                      {r.estado}
                    </span>
                  </div>
                  <div className={styles.listItemDetails}>
                    <span>👤 {r.persona}</span>
                    <span>📅 {new Date(r.fecha).toLocaleDateString('es-ES')}</span>
                    <span>🕐 {r.hora_inicio?.substring(0, 5)} - {r.hora_fin?.substring(0, 5)}</span>
                  </div>
                </div>
              )) : (
                <div className={styles.emptyState}>No hay reservas próximas</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Barra>
  );
}