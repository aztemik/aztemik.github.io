import { createContext, useContext } from "react";

/* Estado de la transición de entrada, disponible para las piezas que
   participan en el revuelto de caracteres: el rol en el encabezado y los
   títulos de sección. */
export const ContextoGlitch = createContext({ activo: false, duracion: 0 });

export const useGlitch = () => useContext(ContextoGlitch);
