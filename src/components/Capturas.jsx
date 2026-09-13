/* Capturas de un proyecto. Vivía dentro de `Extendido`, que se retiró al
   mover el contenido ampliado a su propia página. Sigue siendo opcional:
   si no hay imágenes no se pinta nada. */
export default function Capturas({ capturas, t }) {
  if (!capturas?.length) return null;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {capturas.map((c) => (
        <figure key={c.src} style={{ margin: 0 }}>
          <img
            src={c.src}
            alt={c.alt ?? ""}
            loading="lazy"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              border: `1px solid ${t.linea}`,
              borderRadius: 3,
            }}
          />
          {c.pie && (
            <figcaption
              style={{ fontSize: t.escala.pie, color: t.suave, marginTop: 7 }}
            >
              {c.pie}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
