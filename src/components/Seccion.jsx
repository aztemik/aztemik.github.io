import TextoRevuelto from "./glitch/TextoRevuelto";
import { useGlitch } from "./glitch/contexto";
import { useAparicion } from "./useAparicion";

/* Sección con título. `animada` activa la aparición al hacer scroll; la
   vista CV es estática y la pasa en falso. `indice` escalona a los
   hermanos 60 ms. */
export default function Seccion({
  id,
  titulo,
  t,
  animada = false,
  indice = 0,
  children,
}) {
  const [ref, visible] = useAparicion({ activo: animada });
  const glitch = useGlitch();
  const porta = t.modo === "portafolio";

  return (
    <section
      id={id}
      ref={ref}
      className={animada ? `aparece${visible ? " visible" : ""}` : undefined}
      style={{
        /* La escalera de espacios del CV, de menor a mayor: 13 px entre
           viñetas, 46 entre entradas, 72 entre bloques y estos 100 al cerrar
           una sección. Cada salto tiene que ser mayor que el anterior o la
           jerarquía se lee al revés. */
        paddingBottom: porta ? 88 : 100,
        ...(animada ? { "--retraso": `${indice * 60}ms` } : null),
      }}
    >
      {/* La regla de acento bajo el título solo existe cuando la sección se
          anima, es decir, en Portafolio: dibujada de golpe en una vista estática
          sería un adorno de color en la página que se imprime. El retraso propio
          la coloca detrás de la aparición de su sección. */}
      <h2
        className={animada && porta ? "regla-seccion" : undefined}
        style={{
          fontFamily: t.display,
          fontSize: t.escala.seccion,
          fontWeight: porta ? 500 : 700,
          letterSpacing: porta ? "0.2em" : "0.06em",
          textTransform: "uppercase",
          color: porta ? t.suave : t.texto,
          paddingBottom: 16,
          borderBottom: `1px solid ${t.linea}`,
          marginBottom: porta ? 40 : 30,
          ...(animada && porta
            ? {
                "--regla-a": t.acento,
                "--regla-b": t.acentoAlt,
                "--retraso-regla": `${indice * 60 + 220}ms`,
              }: null),
        }}
      >
        <TextoRevuelto
          texto={titulo}
          activo={glitch.activo}
          duracion={glitch.duracion}
        />
      </h2>
      {children}
    </section>
  );
}
