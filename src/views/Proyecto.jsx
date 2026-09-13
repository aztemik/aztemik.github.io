import { Link, Navigate, useParams } from "react-router-dom";
import Acordeon from "../components/Acordeon";
import AccionesProyecto from "../components/AccionesProyecto";
import BandaStack from "../components/BandaStack";
import Capturas from "../components/Capturas";
import Estado from "../components/Estado";
import Pagina from "../components/Pagina";
import { useAparicion } from "../components/useAparicion";
import { useMetadatos } from "../components/useMetadatos";
import { PERFIL, proyectoPorSlug } from "../data/perfil";
import { TEMA_DETALLE } from "../temas";

/* Vista de proyecto. Ruta "/proyecto/:slug".

   Aquí vive el contenido ampliado que antes se desplegaba dentro de la tarjeta
   del Portafolio, donde convertía la lista en un muro de texto. Es subpágina
   del Portafolio, no una tercera vista: sin interruptor CV / Portafolio y sin
   encabezado personal, con una barra propia para la vuelta.

   Tres decisiones de lectura:

   1. Cada apartado va a dos columnas, rótulo fijo a la izquierda y texto a la
      derecha, para no perder de vista qué pregunta se está respondiendo.
   2. Las decisiones técnicas van plegadas. El título de cada una ya es la
      decisión, así que cerradas siguen informando.
   3. El campo `siguiente` va en un recuadro con el tinte del bloque. Se rotula
      «Qué falta» si el proyecto lleva etiqueta de estado y «Hacia dónde sigue»
      si no: el recuadro es el mismo, cambia si se ve deuda o dirección. */

/* El enlace de vuelta va en la barra superior y en ningún sitio más: al final
   compite con las dos salidas que ya hay ahí y deja la última palabra de la
   página en un enlace de retroceso. */
function Volver({ t, slug, etiqueta }) {
  return (
    <Link
      className="volver"
      to="/portafolio"
      state={{ desde: `/proyecto/${slug}` }}
      style={{
        fontFamily: t.utilidad,
        fontSize: t.escala.etiqueta,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: t.suave,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        /* El relleno vertical es el área de clic. Sin él el blanco de
           alrededor pertenece a la página y no al enlace, y en un teléfono
           hay que apuntar a una línea de texto de 11 px. */
        padding: "10px 0",
        "--volver-tinte": t.texto,
        transition: "color 200ms ease",
      }}
    >
      <svg
        className="volver-flecha"
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
        <path d="M13 8H3.6" />
        <path d="M7 4.6 3.6 8 7 11.4" />
      </svg>
      {etiqueta}
    </Link>
  );
}

/* Un apartado de la página: rótulo fijo a la izquierda, contenido a la
   derecha. La retícula y el `position: sticky` viven en base.css, porque
   dependen del ancho de pantalla y en línea no hay consultas de medios. */
function Apartado({ rotulo, t, indice, children }) {
  const [ref, visible] = useAparicion();

  return (
    <section
      ref={ref}
      className={`apartado aparece${visible ? " visible" : ""}`}
      style={{ "--retraso": `${indice * 60}ms`, borderTop: `1px solid ${t.linea}` }}
    >
      <h2
        style={{
          fontFamily: t.utilidad,
          fontSize: t.escala.etiqueta,
          fontWeight: 400,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: t.suave,
          margin: 0,
        }}
      >
        {rotulo}
      </h2>

      <div style={{ minWidth: 0 }}>{children}</div>
    </section>
  );
}

export default function Proyecto() {
  const { slug } = useParams();
  const encontrado = proyectoPorSlug(slug);
  /* El tema del Portafolio con la columna un poco más ancha; el porqué del
     número está en temas.js. Es una constante de módulo y no un objeto
     construido aquí: `Pagina` reacciona al tema en un efecto, y uno nuevo en
     cada render lo dispararía en cada render. */
  const t = TEMA_DETALLE;

  /* Un slug inventado no renderiza una página vacía: devuelve al Portafolio,
     que es de donde se llega. `replace` para no dejar la URL rota en el
     historial y que el botón de atrás no vuelva a ella. */
  useMetadatos(
    encontrado
      ? `${encontrado.item.nombre} · ${PERFIL.nombre}`: `${PERFIL.nombre} · Portafolio`,
  );

  if (!encontrado) return <Navigate to="/portafolio" replace />;

  const { item, bloque } = encontrado;
  const tinte = bloque.id === "software" ? t.acento : t.acentoAlt;
  const ext = item.extendido ?? {};

  /* Mismo criterio que tenía la sección ampliada: solo se pinta lo que existe.
     El tokenizador ya tiene los tres apartados; un proyecto que solo llene
     `problema` monta ese y ninguno más, sin hueco. */
  const prosa = [
    ["Qué problema resuelve", ext.problema],
    ["Qué costó trabajo", ext.dificultades],
    ["Qué aprendí", ext.aprendizaje],
  ].filter(([, texto]) => Boolean(texto));

  const parrafo = {
    fontSize: t.escala.cuerpo,
    lineHeight: t.escala.altura,
    color: t.cuerpoTexto,
    margin: 0,
    maxWidth: 660,
  };

  let indice = 0;

  return (
    <Pagina
      t={t}
      entrada="fundido"
      cromo={
        /* La barra lleva la vuelta y nada más: quien está aquí cruzó la portada
           y ya sabe de quién es el sitio. Con aire por arriba y por abajo y una
           línea que la separa del contenido, para que se lea como cromo y no
           como una línea de texto suelta encima del título. */
        <nav
          aria-label="Migas"
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            paddingTop: 34,
            borderBottom: `1px solid ${t.linea}`,
          }}
        >
          <Volver t={t} slug={slug} etiqueta="Portafolio" />
        </nav>
      }
    >
      <article>
        <header style={{ padding: "46px 0 52px" }}>
          {/* Sumario y estado en la misma fila. El chip de `Estado` trae un
              margen izquierdo pensado para ir pegado a un título, así que
              suelto bajo el h1 quedaba descuadrado; aquí ese margen es
              justamente la separación que hace falta. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px 0",
              marginBottom: 18,
            }}
          >
            <p
              style={{
                fontFamily: t.utilidad,
                fontSize: t.escala.etiqueta,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: tinte,
                margin: 0,
              }}
            >
              {item.contexto} · {item.fecha}
            </p>

            <Estado valor={item.estado} t={t} />
          </div>

          <h1
            style={{
              fontFamily: t.display,
              fontSize: "clamp(34px, 6vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.08,
              margin: 0,
              maxWidth: 900,
            }}
          >
            {item.nombre}
          </h1>

          {/* El gancho. Va solo, a tamaño grande y sin nada alrededor: es la
              frase que decide si el lector sigue, y compartir renglón con
              cualquier otra cosa le quitaría justo eso. */}
          {ext.entrada && (
            <p
              style={{
                fontFamily: t.display,
                fontSize: "clamp(20px, 2.6vw, 27px)",
                lineHeight: 1.4,
                fontWeight: 400,
                color: t.cuerpoFuerte,
                maxWidth: 700,
                margin: "30px 0 0",
              }}
            >
              {ext.entrada}
            </p>
          )}
        </header>

        <div style={{ paddingBottom: 56 }}>
          <BandaStack stack={item.stack} t={t} tinte={tinte} />
        </div>

        {prosa.map(([rotulo, texto]) => (
          <Apartado key={rotulo} rotulo={rotulo} t={t} indice={indice++}>
            <p style={parrafo}>{texto}</p>
          </Apartado>
        ))}

        {ext.decisiones?.length > 0 && (
          <Apartado rotulo="Decisiones técnicas" t={t} indice={indice++}>
            <Acordeon decisiones={ext.decisiones} t={t} tinte={tinte} />
          </Apartado>
        )}

        {/* El rótulo cuelga de si hay etiqueta de estado, que es lo mismo que
            preguntar si el proyecto declara alguna reserva: si la declara, esto
            es lo que falta para levantarla; si no, el trabajo está cerrado y
            esto es hacia dónde crece. El campo es el mismo y uno solo, cambia
            el rótulo: presentación, no dato. */}
        {ext.siguiente && (
          <Apartado
            rotulo={item.estado ? "Qué falta" : "Hacia dónde sigue"}
            t={t}
            indice={indice++}
          >
            <div
              style={{
                borderLeft: `2px solid ${tinte}`,
                background: "#11111A",
                borderRadius: "0 3px 3px 0",
                padding: "18px 20px",
                maxWidth: 660,
              }}
            >
              <p style={{ ...parrafo, maxWidth: "none" }}>{ext.siguiente}</p>
            </div>
          </Apartado>
        )}

        {ext.capturas?.length > 0 && (
          <Apartado rotulo="Capturas" t={t} indice={indice++}>
            <Capturas capturas={ext.capturas} t={t} />
          </Apartado>
        )}

        <div style={{ padding: "8px 0 64px", maxWidth: 660 }}>
          <AccionesProyecto item={item} t={t} tinte={tinte} suelto />
        </div>
      </article>
    </Pagina>
  );
}
