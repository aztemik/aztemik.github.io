import { useEffect, useRef, useState } from "react";
import { prefiereMenosMovimiento } from "./preferencias";

/* Aparición al entrar en pantalla, una sola vez.
   Devuelve [ref, visible]. Si el navegador no soporta IntersectionObserver
   o el usuario pidió menos movimiento, arranca visible y no observa nada. */
export function useAparicion({ activo = true } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(!activo || prefiereMenosMovimiento());

  useEffect(() => {
    if (visible) return;
    const nodo = ref.current;
    if (!nodo || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, [visible]);

  return [ref, visible];
}
