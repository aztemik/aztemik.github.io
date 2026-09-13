/* Etiqueta de estado del proyecto. Avisa de una reserva —trabajo a medias o
   detenido— y debe ser comprobable en el repositorio que la tarjeta enlaza.
   Un proyecto terminado no la lleva: el campo vacío es ausencia de aviso, no
   un olvido. Hoy solo la trae SubUrban. */
export default function Estado({ valor, t }) {
  if (!valor) return null;
  const porta = t.modo === "portafolio";

  return (
    <span
      style={{
        fontFamily: t.utilidad,
        fontSize: t.escala.estado,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: porta ? "4px 9px" : "2px 0",
        marginLeft: porta ? 10 : 8,
        color: porta ? t.acentoAlt : t.suave,
        boxShadow: porta ? `inset 0 0 0 1px ${t.acentoAlt}55` : "none",
        borderRadius: 2,
        whiteSpace: "nowrap",
      }}
    >
      {porta ? valor : `(${valor})`}
    </span>
  );
}
