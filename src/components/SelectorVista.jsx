import { NavLink, useLocation } from "react-router-dom";

const VISTAS = [
  { ruta: "/", etiqueta: "CV", fin: true },
  { ruta: "/portafolio", etiqueta: "Portafolio", fin: false },
];

/* Interruptor CV / Portafolio. Las etiquetas describen la función, no el
   estilo. Con el enrutador cada vista es una ruta propia,
   así que el interruptor son enlaces y no botones de estado. */
export default function SelectorVista({ t }) {
  const { pathname } = useLocation();
  const porta = t.modo === "portafolio";

  return (
    <nav
      aria-label="Vista del sitio"
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 12,
        paddingTop: 26,
      }}
    >
      <span
        style={{
          fontFamily: t.utilidad,
          fontSize: t.escala.chip,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: t.suave,
        }}
      >
        Vista
      </span>

      <div
        style={{
          display: "flex",
          boxShadow: `inset 0 0 0 1px ${t.linea}`,
          borderRadius: 3,
        }}
      >
        {VISTAS.map(({ ruta, etiqueta, fin }) => (
          <NavLink
            key={ruta}
            to={ruta}
            end={fin}
            /* La vista de destino lee esto para saber si llega desde la otra
               y le toca transición. Ver useTransicionEntrada. */
            state={{ desde: pathname }}
            style={({ isActive }) => ({
              fontFamily: t.utilidad,
              fontSize: t.escala.etiqueta,
              letterSpacing: "0.08em",
              padding: "7px 14px",
              textDecoration: "none",
              borderRadius: 3,
              background: isActive
                ? porta
                  ? t.acento: t.texto: "transparent",
              color: isActive ? (porta ? "#0A0A0F" : "#FFFFFF") : t.suave,
              transition: "background 200ms ease, color 200ms ease",
            })}
          >
            {etiqueta}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
