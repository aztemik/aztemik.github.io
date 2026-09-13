import { CONTACTO, PERFIL } from "../data/perfil";
import Disponibilidad from "./Disponibilidad";
import TextoRevuelto from "./glitch/TextoRevuelto";
import { useGlitch } from "./glitch/contexto";

/* La formación va en una línea bajo el rol, como dato de identidad. No se
   coloca la sección de formación entre encabezado y experiencia: bloquea el
   camino hacia los proyectos. */
export default function Encabezado({ t }) {
  const glitch = useGlitch();
  const porta = t.modo === "portafolio";

  return (
    <header
      style={{
        paddingTop: porta ? 90 : 54,
        paddingBottom: porta ? 80 : 46,
        textAlign: porta ? "left" : "center",
        borderBottom: porta ? "none" : `2px solid ${t.texto}`,
        marginBottom: porta ? 0 : 34,
      }}
    >
      {/* Sin línea de ubicación sobre el nombre: el dato está en el pie, y arriba
          gastaba el primer renglón de la vista en lo menos decisivo del
          encabezado. */}

      <h1
        style={{
          fontFamily: t.display,
          fontSize: porta ? "clamp(44px, 8vw, 92px)" : "clamp(30px, 5vw, 42px)",
          fontWeight: 700,
          letterSpacing: porta ? "-0.035em" : "0.01em",
          lineHeight: 1.1,
          margin: "0 0 14px",
        }}
      >
        {PERFIL.nombre}
      </h1>

      {/* El acento es de la disponibilidad y de nada más; el rol va al gris de los
          datos de identidad. Dos líneas del mismo acento, pegadas y en versales,
          se leen como un solo bloque y ninguna destaca. */}
      <p
        style={{
          fontFamily: porta ? t.utilidad : t.display,
          fontSize: t.escala.rol,
          letterSpacing: porta ? "0.14em" : "0.04em",
          textTransform: "uppercase",
          color: porta ? t.suave : t.texto,
          margin: `0 0 ${porta ? 38 : 20}px`,
        }}
      >
        <TextoRevuelto
          texto={PERFIL.rol}
          activo={glitch.activo}
          duracion={glitch.duracion}
        />
      </p>

      {/* Tampoco va la formación bajo el rol: tiene su sección al final, y aquí se
          metía entre el rol y la disponibilidad, que es la línea que esta vista
          existe para destacar.
          
          La disponibilidad es solo de Portafolio: en el CV el empleo actual se lee
          en la propia entrada de Huf Mexico. */}
      {porta && <Disponibilidad datos={PERFIL.extendido} t={t} />}

      {/* Cada vista lleva su propio resumen y son textos distintos. Si falta el de
          Portafolio cae en el del CV, antes que dejar el encabezado sin entrada.
          
          Sin tope de ancho: la medida legible ya la impone la columna, y un tope
          aquí dejaba el encabezado más estrecho que las secciones de abajo. */}
      <p
        style={{
          fontSize: porta ? "clamp(17px, 2vw, 20px)" : t.escala.cuerpo,
          lineHeight: t.escala.altura,
          margin: porta ? "0 0 36px" : "0 auto 26px",
          color: t.cuerpoFuerte,
          textAlign: "left",
        }}
      >
        {(porta && PERFIL.extendido.resumen) || PERFIL.resumen}
      </p>

      <nav
        aria-label="Contacto"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: porta ? 24 : 18,
          justifyContent: porta ? "flex-start" : "center",
          fontFamily: t.utilidad,
          fontSize: t.escala.contacto,
        }}
      >
        {CONTACTO.map((l) => (
          <a
            key={l.etiqueta}
            href={l.href}
            className={porta ? "enlace-crece" : undefined}
            download={l.descarga ? "" : undefined}
            target={l.externo ? "_blank" : undefined}
            rel={l.externo ? "noreferrer" : undefined}
            style={{
              textDecoration: porta ? "none" : "underline",
              paddingBottom: porta ? 3 : 0,
              borderBottom: porta ? `1px solid ${t.acento}88` : "none",
            }}
          >
            {l.etiqueta}
          </a>
        ))}
      </nav>
    </header>
  );
}
