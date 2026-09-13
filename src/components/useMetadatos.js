import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* Crea la etiqueta en <head> si no existe y le fija el valor. */
function fijar(selector, crear, atributo, valor) {
  let nodo = document.head.querySelector(selector);
  if (!nodo) {
    nodo = crear();
    document.head.appendChild(nodo);
  }
  nodo.setAttribute(atributo, valor);
}

/* Título del documento, canonical y og:url de la ruta que se está viendo.

   El sitio es una sola página y cada ruta se sirve desde la misma copia de
   index.html, así que las etiquetas que vienen en el HTML describen "/" y
   quedarían mintiendo en "/portafolio". Aquí se corrigen con la URL real.

   Se toma de window.location y no de una variable de entorno a propósito: el
   origen real siempre es correcto, funcione el sitio en localhost o en el
   dominio definitivo. La variable VITE_SITIO solo hace falta para el HTML que
   leen los rastreadores que no ejecutan JS. */
export function useMetadatos(titulo) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = titulo;

    const url = window.location.origin + pathname;
    fijar(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement("link"), { rel: "canonical" }),
      "href",
      url,
    );
    fijar(
      'meta[property="og:url"]',
      () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:url");
        return m;
      },
      "content",
      url,
    );
  }, [titulo, pathname]);
}
