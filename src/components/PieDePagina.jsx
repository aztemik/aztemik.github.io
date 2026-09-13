import { PERFIL } from "../data/perfil";

export default function PieDePagina({ t }) {
  const porta = t.modo === "portafolio";

  return (
    <footer
      style={{
        borderTop: `1px solid ${t.linea}`,
        padding: "26px 0 54px",
        fontFamily: t.utilidad,
        fontSize: t.escala.pie,
        color: t.suave,
        letterSpacing: "0.05em",
        textAlign: porta ? "left" : "center",
      }}
    >
      {PERFIL.nombre} · {PERFIL.ubicacion}
    </footer>
  );
}
