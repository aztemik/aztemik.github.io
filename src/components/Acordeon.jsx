/* Decisiones técnicas, una por pliegue: los tres textos juntos eran un muro.

   Va sobre <details>/<summary> nativos. El navegador ya sabe plegar, enfocar,
   abrir con Enter y espacio y buscar dentro de lo cerrado con Ctrl+F; hacerlo
   con estado propio en React sería reimplementarlo peor. Solo se le quita el
   triángulo por omisión, que cada navegador dibuja distinto.

   El título de cada decisión ya es la decisión, así que cerrado informa. */
export default function Acordeon({ decisiones, t, tinte }) {
  if (!decisiones?.length) return null;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {decisiones.map((d, i) => (
        <details
          key={d.titulo}
          className="pliegue"
          style={{
            "--pliegue-linea": t.linea,
            "--pliegue-tinte": tinte,
            "--pliegue-fondo": "#11111A",
          }}
        >
          <summary className="pliegue-cabecera">
            <span
              className="pliegue-numero"
              style={{
                fontFamily: t.utilidad,
                fontSize: t.escala.chip,
                color: t.suave,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <span
              style={{
                fontFamily: t.display,
                fontSize: t.escala.subtitulo,
                fontWeight: 600,
                color: t.texto,
                letterSpacing: "-0.01em",
              }}
            >
              {d.titulo}
            </span>

            <svg
              className="pliegue-flecha"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M4 6.2 8 10.2l4-4" />
            </svg>
          </summary>

          <p
            className="pliegue-cuerpo"
            style={{
              fontSize: t.escala.cuerpo,
              lineHeight: t.escala.altura,
              color: t.cuerpoTexto,
            }}
          >
            {d.texto}
          </p>
        </details>
      ))}
    </div>
  );
}
