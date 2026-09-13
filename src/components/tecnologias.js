/* Qué papel juega cada tecnología en el proyecto que la usa.

   Es el dato que convierte una fila de fichas en información: «nlohmann/json»
   no le dice nada a quien no lo conozca, «librería» sí, y quien sí lo conoce
   no pierde nada por leerlo. Sin ese rótulo la banda de la página de proyecto
   sería decoración.

   Va en un archivo sin JSX, separado de los dibujos: un módulo que exporta un
   componente y además una función corriente rompe el recargado en caliente de
   Vite. Y el papel de una pieza no tiene por qué cambiar a la vez que su
   icono, así que se puede dar rótulo hoy y dibujo después. */

const PAPELES = {
  "C++": { papel: "Lenguaje", nota: "C++17" },
  "UTF-32": { papel: "Codificación interna", nota: "4 bytes por carácter" },
  "nlohmann/json": { papel: "Librería", nota: "Lectura de corpus" },
};

const GENERICO = { papel: "Herramienta", nota: null };

export function fichaDe(nombre) {
  return PAPELES[nombre] ?? GENERICO;
}
