import { useEffect, useState } from "react";

/* Glifos del revuelto. Sin letras acentuadas ni caracteres anchos: la
   cadena conserva siempre la longitud del original, así que el ancho apenas
   se mueve y no hay salto de maquetación. */
const GLIFOS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&$/\\<>*+=-_[]{}";

/* ~24 fotogramas por segundo. Más rápido no se lee como revuelto, se lee
   como parpadeo. */
const INTERVALO = 42;

/* Revuelto de caracteres: el texto pasa por glifos aleatorios y se resuelve
   de izquierda a derecha hasta su valor final.

   Si `activo` es falso (vista CV, sin transición, o menos movimiento) el
   componente devuelve el texto tal cual y no programa nada. */
export default function TextoRevuelto({
  texto,
  activo = false,
  duracion = 600,
}) {
  const [salida, setSalida] = useState(texto);

  useEffect(() => {
    if (!activo) {
      setSalida(texto);
      return;
    }

    const inicio = performance.now();
    let ultimo = 0;
    let peticion = requestAnimationFrame(function paso(ahora) {
      const avance = Math.min(1, (ahora - inicio) / duracion);

      if (ahora - ultimo >= INTERVALO || avance === 1) {
        ultimo = ahora;
        const resueltos = Math.floor(avance * texto.length);
        let acumulado = "";
        for (let i = 0; i < texto.length; i += 1) {
          const caracter = texto[i];
          acumulado +=
            avance === 1 || i < resueltos || caracter === " "
              ? caracter: GLIFOS[Math.floor(Math.random() * GLIFOS.length)];
        }
        setSalida(acumulado);
      }

      if (avance < 1) peticion = requestAnimationFrame(paso);
    });

    return () => cancelAnimationFrame(peticion);
  }, [texto, activo, duracion]);

  /* El texto real queda accesible para lectores de pantalla; lo que se
     revuelve es solo la capa visible. */
  return (
    <>
      <span aria-hidden="true">{salida}</span>
      <span className="solo-lectores">{texto}</span>
    </>
  );
}
