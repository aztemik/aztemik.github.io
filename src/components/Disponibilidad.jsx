/* El mensaje destacado es la disponibilidad; el empleo actual va como dato
   secundario y apagado. Si lo primero que registra un reclutador es
   "aire comprimido", el sitio falló.

   Los datos salen de `PERFIL.extendido`, que solo lee la vista Portafolio: hoy
   quien monta esta pieza es únicamente ese encabezado, con su punto que pulsa
   junto a la primera línea. Sin datos no se pinta nada, igual que `Extendido`.
   El CV resuelve el empleo actual en la entrada de Huf Mexico, no aquí. */
export default function Disponibilidad({ datos, t }) {
  if (!datos?.disponibilidad && !datos?.empleoActual) return null;

  const porta = t.modo === "portafolio";

  return (
    <div style={{ marginBottom: porta ? 30 : 18 }}>
      <p
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          justifyContent: porta ? "flex-start" : "center",
          fontFamily: t.utilidad,
          fontSize: t.escala.meta,
          color: porta ? t.acento : t.texto,
          fontWeight: porta ? 400 : 700,
          letterSpacing: porta ? "0.04em" : "0",
          margin: 0,
        }}
      >
        {porta && (
          <span
            aria-hidden="true"
            className="punto-pulso"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: t.acento,
              /* El halo es un ::after que hereda el color por
                 `currentColor`, así que el acento se declara además de
                 pintarse el fondo. `position` es la referencia de ese halo. */
              color: t.acento,
              position: "relative",
              flexShrink: 0,
            }}
          />
        )}
        {datos.disponibilidad}
      </p>

      <p
        style={{
          fontSize: t.escala.pie,
          color: t.suave,
          margin: "5px 0 0",
          paddingLeft: porta ? 17 : 0,
          textAlign: porta ? "left" : "center",
        }}
      >
        {datos.empleoActual}
      </p>
    </div>
  );
}
