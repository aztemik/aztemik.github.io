import AccionesProyecto from "./AccionesProyecto";
import Estado from "./Estado";
import { useAparicion } from "./useAparicion";

/* Una experiencia o proyecto. Misma estructura en ambas vistas: cambia el
   tratamiento visual y, en Portafolio, el pie con las salidas del proyecto.
   El contenido ampliado ya no se despliega aquí: tiene página propia. */
export default function Entrada({
  item,
  t,
  tinte,
  indice = 0,
  ultimo = false,
}) {
  const porta = t.modo === "portafolio";

  /* Observador propio, no el de la sección. «Experiencia» mide más de una
     pantalla: colgadas del observador de la sección, las tarjetas de abajo
     habrían terminado de animarse mucho antes de que nadie las tuviera
     delante, y el movimiento no lo vería nadie. El CV lo pasa en falso y se
     queda estático, como le toca. */
  const [ref, visible] = useAparicion({ activo: porta });

  return (
    <article
      ref={ref}
      /* `riel` es la traza que baja por el borde izquierdo al aparecer;
         `aparece` es el mismo desplazamiento de 12 px de las secciones,
         aplicado aquí entre hermanas de un bloque. */
      className={
        porta ? `tarjeta riel aparece${visible ? " visible" : ""}` : undefined
      }
      style={{
        /* 46 px al pie de cada entrada, claramente más que cualquier hueco
           interno o las entradas se leen como una sola.

           La última de su bloque va sin pie: lo que sigue es otro bloque o el
           final de la sección, y de ese hueco se encargan el `gap` de la vista
           y el cierre de `Seccion`. Con pie, los dos se sumaban. */
        padding: porta ? "20px 22px" : ultimo ? 0 : "0 0 46px",
        borderLeft: porta ? `1px solid ${t.linea}` : "none",
        marginBottom: porta ? 4 : 0,
        borderRadius: porta ? "0 3px 3px 0" : 0,
        ...(porta
          ? {
              "--tarjeta-fondo-hover": "#11111A",
              "--tarjeta-borde-hover": tinte,
              /* La traza lleva el tinte del bloque, el mismo que el borde al
                 pasar el cursor: es el color que ya significa «esta tarjeta»,
                 y por eso se apaga al terminar en vez de quedarse encendido. */
              "--riel-tinte": tinte,
              "--chip-texto": t.suave,
              "--chip-linea": t.linea,
              /* El tinte a un tercio largo de opacidad. A plena carga, cinco
                 fichas encendidas convierten la tarjeta en un rótulo de neón y
                 tapan lo que el hover quiere decir, que es «esta tarjeta». */
              "--chip-linea-hover": `${tinte}66`,
              "--chip-texto-hover": t.texto,
              "--retraso": `${indice * 60}ms`,
              "--retraso-riel": `${indice * 60 + 180}ms`,
            }: null),
      }}
    >
      {/* Nombre y fecha en la misma fila, la fecha contra el margen derecho: el
          borde izquierdo se lee de corrido y las fechas quedan como columna
          aparte. Cuando van justas cede el título, que se parte en dos
          renglones. El cómo está en `.fila-titulo`, en base.css. */}
      <div
        className="fila-titulo"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "2px 20px",
          marginBottom: porta ? 4 : 5,
        }}
      >
        <h3
          style={{
            fontFamily: t.display,
            fontSize: t.escala.titulo,
            fontWeight: porta ? 600 : 700,
            margin: 0,
            letterSpacing: porta ? "-0.01em" : "0",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {item.nombre}
          <Estado valor={item.estado} t={t} />
        </h3>

        {/* La fecha conserva el tinte del bloque en Portafolio y el gris del
            resto de datos secundarios en CV. */}
        <div style={{ textAlign: "right", flex: "0 0 auto" }}>
          <div
            className="fecha-entrada"
            style={{
              fontFamily: t.utilidad,
              fontSize: t.escala.etiqueta,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: porta ? tinte : t.suave,
            }}
          >
            {item.fecha}
          </div>

          {/* Sin etiqueta de «Empleo actual»: la fecha abierta ya lo dice, y las dos
              vistas lo resuelven igual. */}
        </div>
      </div>

      {item.contexto && (
        <p
          style={{
            fontSize: t.escala.meta,
            color: t.suave,
            margin: porta ? "0 0 14px" : "0 0 18px",
          }}
        >
          {item.contexto}
        </p>
      )}

      <ul style={{ margin: porta ? "0 0 16px" : "0 0 22px", paddingLeft: 20 }}>
        {item.puntos.map((p) => (
          <li
            key={p}
            style={{
              fontSize: t.escala.cuerpo,
              lineHeight: t.escala.altura,
              /* Media línea entre viñetas en vez de 7 px. Con 7, cuatro viñetas
                 de dos renglones se leían como un párrafo corrido de ocho; con
                 la mitad del interlineado cada una vuelve a ser una afirmación
                 suelta, que es como se escanea un CV. */
              marginBottom: porta ? 7 : 13,
              color: porta ? t.cuerpoTexto : t.texto,
            }}
          >
            {p}
          </li>
        ))}
      </ul>

      {item.stack.length > 0 && (
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 7,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {item.stack.map((s, i) => (
            <li
              key={s}
              /* En Portafolio el color y el borde de la ficha salen de la hoja
                 de estilos y no de aquí: el hover de la tarjeta tiene que poder
                 cambiarlos, y una declaración en línea gana a cualquier regla.
                 Es el mismo reparto que ya hace el pie de acciones. */
              className={porta ? "chip-stack" : undefined}
              style={{
                fontFamily: t.utilidad,
                fontSize: t.escala.chip,
                letterSpacing: "0.05em",
                padding: porta ? "5px 9px" : 0,
                marginRight: porta ? 0 : 14,
                borderRadius: 2,
                ...(porta ? { "--i": i } : { color: t.suave }),
              }}
            >
              {porta ? s : `· ${s}`}
            </li>
          ))}
        </ul>
      )}

      {/* La tarjeta termina en las salidas: el contenido ampliado vive en
          /proyecto/<slug> y desde aquí solo se ofrece.
          
          Sin fechas objetivo ni de última actualización. El trabajo en curso lo
          dice su etiqueta de estado; el terminado, el periodo de su fecha. */}
      {porta && <AccionesProyecto item={item} t={t} tinte={tinte} />}
    </article>
  );
}
