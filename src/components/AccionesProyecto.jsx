import { Link } from "react-router-dom";
import EnlaceRepo from "./EnlaceRepo";
import { rutaDeProyecto } from "../data/perfil";

/* Pie de acción de la tarjeta de proyecto. Solo lo monta la vista Portafolio:
   el CV responde quién es y qué ha hecho, y un enlace que saca al lector del
   documento no ayuda a eso.

   Antes aquí solo estaba el repositorio, y encima de él se desplegaba entero
   el contenido ampliado: qué problema resuelve, las decisiones, qué falta.
   Eran cuatro o cinco párrafos dentro de una tarjeta que el lector todavía
   estaba decidiendo si le interesaba, repetidos en cada proyecto, y la vista
   entera se leía como un muro. Ese contenido se mudó a su propia página y lo
   que queda aquí son las dos salidas, en una sola franja partida en dos:

     Detalles del proyecto        Código
     Decisiones y qué sigue       aztemik / Byte-Pair-Encoding

   Izquierda el camino interno, derecha el externo. El orden importa: quien
   duda entre los dos debería quedarse en el sitio, no salir a GitHub a
   interpretar un árbol de archivos.

   `suelto` lo usa la propia página de proyecto, donde no hay tarjeta que
   sangrar: la franja se dibuja cerrada, con borde propio, y sin la celda de
   detalles, porque llevaría a donde el lector ya está. */
export default function AccionesProyecto({ item, t, tinte, suelto = false }) {
  const hayDetalle = Boolean(item.slug && item.extendido) && !suelto;
  const hayRepo = Boolean(item.repo);

  if (!hayDetalle && !hayRepo) return null;

  return (
    <div
      className={`acciones${suelto ? " acciones-sueltas" : ""}`}
      style={{
        "--acciones-linea": t.lineaFuerte,
        "--accion-tinte": tinte,
        "--accion-fondo": "#13131D",
        "--accion-suave": t.suave,
        "--accion-texto": t.texto,
      }}
    >
      {hayDetalle && (
        <Link
          className="accion"
          to={rutaDeProyecto(item)}
          aria-label={`Detalles del proyecto ${item.nombre}`}
          style={{ fontFamily: t.utilidad }}
        >
          <svg
            className="accion-marca"
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M2.6 4.3 8 1.8l5.4 2.5L8 6.8z" />
            <path d="M2.6 8 8 10.5 13.4 8" />
            <path d="M2.6 11.4 8 13.9l5.4-2.5" />
          </svg>

          <span style={{ minWidth: 0 }}>
            <span
              style={{
                display: "block",
                fontSize: t.escala.etiqueta,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: t.suave,
                marginBottom: 3,
              }}
            >
              Detalles
            </span>
            <span
              className="accion-nombre"
              style={{ display: "block", fontSize: t.escala.meta }}
            >
              Decisiones y qué sigue
            </span>
          </span>

          <svg
            className="accion-flecha"
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M3 8h9.4" />
            <path d="M9 4.6 12.4 8 9 11.4" />
          </svg>
        </Link>
      )}

      <EnlaceRepo url={item.repo} nombreProyecto={item.nombre} t={t} />
    </div>
  );
}
