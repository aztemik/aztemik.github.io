/* Lectura única de `prefers-reduced-motion`. La consultan el sistema de
   aparición y el de transiciones; el resto lo cubre la hoja de estilos. */
export function prefiereMenosMovimiento() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}
