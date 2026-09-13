import { useEffect, useMemo } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import Encabezado from "./Encabezado";
import PieDePagina from "./PieDePagina";
import SelectorVista from "./SelectorVista";
import CapaGlitch from "./glitch/CapaGlitch";
import { ContextoGlitch } from "./glitch/contexto";
import { useTransicionEntrada } from "./glitch/useTransicionEntrada";

/* Armazón común a todas las vistas: fondo, ancho de columna, cromo superior
   y pie. Lo que cambia es el tema que recibe y lo que cada vista decide montar
   dentro de `children`.

   `entrada` es la transición que la vista pide al llegar desde otra: "glitch"
   o "fundido". Quién la merece de verdad lo decide el hook.

   `cromo` sustituye la cabecera por omisión —interruptor de vista más
   encabezado personal—. Lo usa la página de proyecto: ahí el interruptor no
   tiene estado verdadero que mostrar, porque la ruta no es ni CV ni
   Portafolio. Recibe una barra con la vuelta en su lugar. */
export default function Pagina({ t, entrada = null, cromo = null, children }) {
  const { modo, duracion, clave } = useTransicionEntrada(entrada);
  const glitch = modo === "glitch";

  /* Al abrir una ruta nueva se empieza por arriba. React Router no toca el
     scroll, así que entrar a un proyecto desde media lista dejaba la página
     nueva por la mitad. Solo en navegación hacia delante: con atrás y
     adelante el navegador restaura la posición y pisársela sería peor. */
  const { pathname } = useLocation();
  const tipoNavegacion = useNavigationType();

  useEffect(() => {
    if (tipoNavegacion !== "PUSH") return;
    window.scrollTo(0, 0);
  }, [pathname, tipoNavegacion]);

  /* El fondo y el color base viven en <body>, no en este contenedor: el
     contenedor se remonta al cambiar de ruta y una transición CSS sobre un
     elemento recién montado no ocurre. En <body>, que sobrevive al cambio,
     el fundido de 350 ms entre temas sí se ve. */
  useEffect(() => {
    document.body.style.backgroundColor = t.fondo;
    document.body.style.color = t.texto;
  }, [t]);

  const contexto = useMemo(
    /* El revuelto termina antes que la corrupción para que el texto quede
       legible mientras la capa se apaga. */
    () => ({ activo: glitch, duracion: Math.round(duracion * 0.8) }),
    [glitch, duracion],
  );

  const clases = [
    glitch && "glitch-contenido",
    modo === "fundido" && "fundido-entrada",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      style={{
        color: t.texto,
        minHeight: "100vh",
        fontFamily: t.cuerpo,
      }}
    >
      <a
        className="saltar-contenido"
        href="#contenido"
        style={{ background: t.texto, color: t.fondo }}
      >
        Saltar al contenido
      </a>

      <ContextoGlitch.Provider value={contexto}>
        <div
          /* Remontar con la clave de la navegación cancela una transición en
             curso y la reinicia desde cero en vez de acumularse. */
          key={clave}
          className={clases || undefined}
          style={{
            maxWidth: t.ancho,
            margin: "0 auto",
            padding: `0 ${t.margen}`,
            "--glitch-duracion": `${duracion}ms`,
          }}
        >
          {cromo ?? (
            <>
              <SelectorVista t={t} />
              <Encabezado t={t} />
            </>
          )}
          <main id="contenido">{children}</main>
          <PieDePagina t={t} />
        </div>
      </ContextoGlitch.Provider>

      {glitch && <CapaGlitch key={clave} duracion={duracion} />}
    </div>
  );
}
