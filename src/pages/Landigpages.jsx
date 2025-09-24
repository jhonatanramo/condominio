import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, DocumentTextIcon, ChartBarIcon, UsersIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import css from "./LandingPage.module.css";

export function LandingPages() {
  const [activeSection, setActiveSection] = useState("introduccion");

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={css.container}>
      {/* Header/Navegación */}
      <header className={css.header}>
        <div className={css.logo}>
          <span className={css.logoIcon}>🌊</span>
          <span>OceanCond</span>
        </div>
        <nav className={css.nav}>
          {[
            { id: "introduccion", label: "Introducción" },
            { id: "antecedentes", label: "Antecedentes" },
            { id: "software", label: "Software Similar" },
            { id: "casos", label: "Casos de Estudio" },
            { id: "problema", label: "Problema" },
            { id: "objetivos", label: "Objetivos" },
            { id: "alcance", label: "Alcance" }
          ].map((item) => (
            <button
              key={item.id}
              className={`${css.navLink} ${activeSection === item.id ? css.active : ''}`}
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Hero Section */}
      <section className={css.hero}>
        <div className={css.heroContent}>
          <h1 className={css.heroTitle}>Sistema de Gestión de Condominios</h1>
          <p className={css.heroSubtitle}>
            Una solución integral para la administración eficiente de condominios y residenciales
          </p>
          <div className={css.heroStats}>
            <div className={css.stat}>
              <DocumentTextIcon className={css.statIcon} />
              <span>Gestión Documental</span>
            </div>
            <div className={css.stat}>
              <ChartBarIcon className={css.statIcon} />
              <span>Control Financiero</span>
            </div>
            <div className={css.stat}>
              <UsersIcon className={css.statIcon} />
              <span>Comunicación Eficiente</span>
            </div>
            <div className={css.stat}>
              <ShieldCheckIcon className={css.statIcon} />
              <span>Seguridad Integral</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <main className={css.mainContent}>
        {/* Introducción */}
        <section id="introduccion" className={css.section}>
          <h2 className={css.sectionTitle}>Introducción</h2>
          <div className={css.contentCard}>
            <p>
              La gestión de condominios representa un desafío complejo que requiere herramientas especializadas 
              para optimizar procesos administrativos, financieros y de comunicación. Este documento presenta 
              el análisis y desarrollo de un sistema integral de gestión condominial.
            </p>
          </div>
        </section>

        {/* Antecedentes */}
        <section id="antecedentes" className={css.section}>
          <h2 className={css.sectionTitle}>Antecedentes</h2>
          
          <div className={css.subsection}>
            <h3 className={css.subsectionTitle}>Historia</h3>
            <div className={css.contentCard}>
              <p>
                La administración de condominios ha evolucionado desde métodos manuales basados en papel 
                hacia sistemas digitalizados que integran múltiples funcionalidades en plataformas unificadas.
              </p>
            </div>
          </div>

          <div className={css.subsection}>
            <h3 className={css.subsectionTitle}>Softwares Similares de Gestión de Condominio</h3>
            
            {/* Neivor */}
            <SoftwareCard 
              nombre="Neivor"
              descripcion="Plataforma de administración de condominios y rentas que integra gestión operativa con servicios financieros"
              funciones={[
                "Cobranza y finanzas: facturación automática, conciliación bancaria",
                "Pagos en línea: SPEI sin retención de fondos, pagos con tarjeta",
                "Comunicación con residentes, recordatorios automáticos",
                "Operación del condominio: accesos/seguridad, reservas de amenidades"
              ]}
              planes={[
                { nombre: "Plan Básico", precio: "Cotización", caracteristicas: ["Cobranza en línea", "Portal web", "Comunicación con residentes"] },
                { nombre: "Plan Estándar", precio: "Cotización", caracteristicas: ["Control de accesos", "Reservas de amenidades", "Mantenimiento"] },
                { nombre: "Plan Avanzado", precio: "Cotización", caracteristicas: ["Facturación de condominios y rentas", "Analítica avanzada", "Integraciones personalizadas"] }
              ]}
              url="https://www.neivor.com"
            />

            {/* Siigo Aspel */}
            <SoftwareCard 
              nombre="Siigo Aspel"
              descripcion="Suite administrativa/contable mexicana para condominios"
              funciones={[
                "Aspel SAE: control de unidades/propietarios/inquilinos",
                "Cuotas y cobranza, facturación CFDI",
                "Aspel COI: contabilidad con catálogos predefinidos"
              ]}
              planes={[
                { nombre: "Mensual", precio: "$299 MXN/mes", caracteristicas: ["Administración de unidades", "Facturación CFDI", "Timbrado ilimitado"] },
                { nombre: "Semestral", precio: "$1,699 MXN/6 meses", caracteristicas: ["Mismas funciones mensuales", "Ahorro por pago anticipado"] },
                { nombre: "Anual", precio: "$2,999 MXN/año", caracteristicas: ["Mismas funciones mensuales", "Mayor ahorro anual"] }
              ]}
              url="https://www.siigo.com.mx/aspel/sae-condominios/"
            />

            {/* CondoVive */}
            <SoftwareCard 
              nombre="CondoVive"
              descripcion="SaaS especializado para administración de condominios con apps para administradores, residentes y guardias"
              funciones={[
                "Administración y finanzas: generación de cuotas, morosidad",
                "Comunicación y operación: avisos, encuestas, reservas",
                "Seguridad/guardias: acceso por QR, monitoreo por unidad"
              ]}
              planes={[
                { nombre: "Plan 30", precio: "$27/mes ó $270/año", caracteristicas: ["Hasta 30 unidades", "Apps para administradores, residentes y guardias", "Almacenamiento ilimitado"] },
                { nombre: "Planes superiores", precio: "Escala según unidades", caracteristicas: ["Misma funcionalidad base", "Precio según cantidad de unidades"] }
              ]}
              url="https://condovive.com"
            />
          </div>
        </section>

        {/* Casos de Estudio */}
        <section id="casos" className={css.section}>
          <h2 className={css.sectionTitle}>Casos de Estudio</h2>
          
          <div className={css.caseStudies}>
            <CaseStudy 
              titulo="Sistema de gestión para condominio de Santa Cruz de la colina"
              descripcion="Implementación exitosa de sistema integrado para condominio residencial de 50 unidades"
            />
            <CaseStudy 
              titulo="Sistema para Condominio Sevilla de los Jardines"
              descripcion="Solución personalizada para condominio de lujo con amenities exclusivas"
            />
            <CaseStudy 
              titulo="Sistema para condominio Espíritu Santo"
              descripcion="Plataforma de gestión para condominio corporativo con necesidades específicas"
            />
          </div>
        </section>

        {/* Descripción del Problema */}
        <section id="problema" className={css.section}>
          <h2 className={css.sectionTitle}>Descripción del Problema</h2>
          <div className={css.contentCard}>
            <p>
              La gestión manual de condominios presenta múltiples desafíos: falta de transparencia en 
              las finanzas, dificultad en la comunicación con residentes, procesos lentos de cobranza 
              y limitaciones en el control de acceso y seguridad.
            </p>
          </div>
        </section>

        {/* Objetivos */}
        <section id="objetivos" className={css.section}>
          <h2 className={css.sectionTitle}>Objetivos</h2>
          
          <div className={css.subsection}>
            <h3 className={css.subsectionTitle}>Objetivos Generales</h3>
            <div className={css.contentCard}>
              <ul className={css.list}>
                <li>Desarrollar un sistema integral de gestión condominial</li>
                <li>Automatizar procesos administrativos y financieros</li>
                <li>Mejorar la comunicación entre administración y residentes</li>
              </ul>
            </div>
          </div>

          <div className={css.subsection}>
            <h3 className={css.subsectionTitle}>Objetivos Específicos</h3>
            <div className={css.contentCard}>
              <ul className={css.list}>
                <li>Implementar módulo de gestión financiera y cobranza</li>
                <li>Desarrollar sistema de reservas para áreas comunes</li>
                <li>Crear portal de comunicación para residentes</li>
                <li>Establecer control de acceso y seguridad</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Alcance */}
        <section id="alcance" className={css.section}>
          <h2 className={css.sectionTitle}>Alcance</h2>
          <div className={css.contentCard}>
            <p>
              El sistema cubrirá todas las áreas de gestión condominial incluyendo administración 
              financiera, comunicación, reservas, seguridad y reportes analíticos.
            </p>
          </div>
        </section>

        {/* Secciones adicionales (placeholders) */}
        <CollapsibleSection title="Elementos de un sistema de información basado en computación">
          <p>Contenido sobre los componentes fundamentales de sistemas de información...</p>
        </CollapsibleSection>

        <CollapsibleSection title="Tecnología">
          <p>Análisis de tecnologías utilizadas en el desarrollo del sistema...</p>
        </CollapsibleSection>

        <CollapsibleSection title="Costo">
          <p>Evaluación de costos de desarrollo e implementación...</p>
        </CollapsibleSection>

        <CollapsibleSection title="Beneficios">
          <p>Ventajas y retorno de inversión del sistema propuesto...</p>
        </CollapsibleSection>

        <CollapsibleSection title="Bibliografía">
          <p>Referencias y fuentes consultadas para el desarrollo del proyecto...</p>
        </CollapsibleSection>

        <CollapsibleSection title="Anexo">
          <p>Documentación adicional, diagramas y especificaciones técnicas...</p>
        </CollapsibleSection>
      </main>

      {/* Footer */}
      <footer className={css.footer}>
        <div className={css.footerContent}>
          <div className={css.footerLogo}>
            <span className={css.logoIcon}>🌊</span>
            <span>OceanCond</span>
          </div>
          <p>Sistema de Gestión de Condominios - Documentación Técnica</p>
        </div>
      </footer>
    </div>
  );
}

// Componente para tarjetas de software
function SoftwareCard({ nombre, descripcion, funciones, planes, url }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={css.softwareCard}>
      <div className={css.softwareHeader} onClick={() => setIsExpanded(!isExpanded)}>
        <h4 className={css.softwareName}>{nombre}</h4>
        <button className={css.expandButton}>
          {isExpanded ? <ChevronUpIcon className={css.icon} /> : <ChevronDownIcon className={css.icon} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className={css.softwareContent}>
          <p className={css.softwareDescription}>{descripcion}</p>
          
          <div className={css.softwareSection}>
            <h5>Funciones Principales</h5>
            <ul className={css.list}>
              {funciones.map((funcion, index) => (
                <li key={index}>{funcion}</li>
              ))}
            </ul>
          </div>

          <div className={css.softwareSection}>
            <h5>Planes y Precios</h5>
            <div className={css.plansGrid}>
              {planes.map((plan, index) => (
                <div key={index} className={css.planCard}>
                  <h6>{plan.nombre}</h6>
                  <span className={css.planPrice}>{plan.precio}</span>
                  <ul className={css.planFeatures}>
                    {plan.caracteristicas.map((caracteristica, idx) => (
                      <li key={idx}>{caracteristica}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className={css.softwareLink}>
            <a href={url} target="_blank" rel="noopener noreferrer">Visitar sitio oficial</a>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para casos de estudio
function CaseStudy({ titulo, descripcion }) {
  return (
    <div className={css.caseStudy}>
      <h4>{titulo}</h4>
      <p>{descripcion}</p>
    </div>
  );
}

// Componente para secciones colapsables
function CollapsibleSection({ title, children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className={css.section}>
      <div className={css.collapsibleHeader} onClick={() => setIsExpanded(!isExpanded)}>
        <h2 className={css.sectionTitle}>{title}</h2>
        <button className={css.expandButton}>
          {isExpanded ? <ChevronUpIcon className={css.icon} /> : <ChevronDownIcon className={css.icon} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className={css.contentCard}>
          {children}
        </div>
      )}
    </section>
  );
}