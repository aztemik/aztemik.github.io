import { useEffect, useState } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { prefiereMenosMovimiento } from "../preferencias";

/* Duración total del glitch: entre 500 y 900 ms, nunca más de 1 s, porque es
   una transición que se activa muchas veces. */
export const DURACION_GLITCH = 760;
export const DURACION_FUNDIDO = 350;

/* Las dos vistas del sitio. Todo lo demás, como /proyecto/<slug>, es
   subpágina del Portafolio y no una vista: comparte tema y cromo propio.
   La distinción es la que decide quién recibe el glitch. */
const VISTAS = ["/", "/portafolio"];
const esVista = (ruta) => VISTAS.includes(ruta.replace(/\/+$/, "") || "/");

/* Decide qué transición corresponde al montar una vista. `entrada` es lo que
   la vista pide: "glitch" o "fundido".

   Solo hay transición si se llega desde la otra vista. Un enlace directo, una
   recarga o el botón de atrás abren la vista ya compuesta: el glitch es el
   paso entre los dos mundos, no una animación de carga.

   Volver de un proyecto al Portafolio tampoco lo recibe: es navegación interna
   dentro del mismo mundo, y corromper la pantalla ahí lo convierte en un tic
   que se dispara en cada vuelta. Esa llegada recibe el fundido.

   Con `prefers-reduced-motion` el glitch se degrada a fundido. */
export function useTransicionEntrada(entrada) {
  const location = useLocation();
  const tipoNavegacion = useNavigationType();

  const desde = location.state?.desde;
  const vieneDeLaOtraVista =
    tipoNavegacion === "PUSH" &&
    typeof desde === "string" &&
    desde !== location.pathname;

  /* El origen y el destino tienen que ser las dos vistas del sitio. Si
     cualquiera de los dos es una subpágina, la llegada no cruza ningún
     mundo y no hay nada que corromper. */
  const cruzaDeVista =
    vieneDeLaOtraVista && esVista(desde) && esVista(location.pathname);

  let modo = null;
  if (entrada && vieneDeLaOtraVista) {
    modo =
      entrada === "glitch" && cruzaDeVista && !prefiereMenosMovimiento()
        ? "glitch": "fundido";
  }

  const duracion = modo === "glitch" ? DURACION_GLITCH : DURACION_FUNDIDO;

  /* `location.key` cambia en cada navegación. La transición se da por
     terminada anotando la clave que la lanzó, no con una bandera: así, si
     el usuario dispara el cambio dos veces seguidas, la clave nueva no
     coincide con la anotada, el temporizador anterior se cancela en la
     limpieza y la animación reinicia desde cero sin acumularse. */
  const [claveTerminada, setClaveTerminada] = useState(null);
  const corriendo = modo !== null && claveTerminada !== location.key;

  useEffect(() => {
    if (!modo) return undefined;
    const temporizador = setTimeout(
      () => setClaveTerminada(location.key),
      duracion,
    );
    return () => clearTimeout(temporizador);
  }, [modo, duracion, location.key]);

  return {
    modo: corriendo ? modo : null,
    duracion,
    clave: location.key,
  };
}
