/* Celda de repositorio. No se monta sola: vive dentro de `AccionesProyecto`,
   que es quien pone la franja y el borde. Aquí solo está el enlace.

   Mostrar `duenio / nombre` en vez de la palabra genérica «Repositorio» tiene
   una razón: dice a dónde lleva antes de hacer clic y se lee como lo que es,
   una referencia a código. Los colores se pasan como variables CSS y no como
   estilos en línea porque el estado :hover vive en la hoja, y un valor en
   línea le ganaría. */

/* Glifo propio: nada de fuentes de iconos. */
function MarcaRama() {
  return (
    <svg
      className="accion-marca"
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="4.5" cy="3.4" r="1.9" />
      <circle cx="4.5" cy="12.6" r="1.9" />
      <circle cx="11.5" cy="3.4" r="1.9" />
      <path d="M4.5 5.3v5.4" />
      <path d="M11.5 5.3v1.3a3 3 0 0 1-3 3H4.5" />
    </svg>
  );
}

/* `https://github.com/aztemik/Byte-Pair-Encoding` a duenio + nombre. Si la URL
   no se puede leer o no tiene esa forma, se devuelve `null` y la celda cae en
   la etiqueta genérica: un enlace roto es peor que uno sin adornar. */
function rutaDe(url) {
  try {
    const { hostname, pathname } = new URL(url);
    const partes = pathname.split("/").filter(Boolean);
    if (partes.length < 2) return null;
    return {
      duenio: partes[0],
      nombre: partes.slice(1).join("/").replace(/\.git$/, ""),
      host: hostname.replace(/^www\./, ""),
    };
  } catch {
    return null;
  }
}

export default function EnlaceRepo({ url, nombreProyecto, t }) {
  if (!url) return null;

  const ruta = rutaDe(url);

  return (
    <a
      className="accion"
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Repositorio de ${nombreProyecto}${
        ruta ? ` en ${ruta.host}` : ""
      }. Se abre en una pestaña nueva`}
      style={{ fontFamily: t.utilidad }}
    >
      <MarcaRama />

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
          Código
        </span>

        <span
          className="accion-nombre"
          style={{ display: "block", fontSize: t.escala.meta, overflowWrap: "anywhere" }}
        >
          {ruta ? (
            <>
              <span style={{ color: t.suave }}>{ruta.duenio} / </span>
              {ruta.nombre}
            </>
          ) : (
            url
          )}
        </span>
      </span>

      <svg
        className="accion-flecha accion-flecha-fuera"
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
        <path d="M4.5 11.5 11.5 4.5" />
        <path d="M5.8 4.5h5.7v5.7" />
      </svg>
    </a>
  );
}
