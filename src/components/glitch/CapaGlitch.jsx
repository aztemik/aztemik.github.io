/* Capa de corrupción: líneas de barrido y dos bandas de color que recorren
   la pantalla. Va fuera del contenedor al que se le aplica la aberración
   cromática, porque `filter` crearía un bloque contenedor y la dejaría
   anclada al contenido en vez de a la ventana.

   Es puramente decorativa: `aria-hidden` y sin capturar el cursor. */
export default function CapaGlitch({ duracion }) {
  return (
    <div
      className="capa-glitch"
      aria-hidden="true"
      style={{ "--glitch-duracion": `${duracion}ms` }}
    >
      <div className="capa-glitch__barrido" />
      <div className="capa-glitch__banda capa-glitch__banda--magenta" />
      <div className="capa-glitch__banda capa-glitch__banda--cian" />
    </div>
  );
}
