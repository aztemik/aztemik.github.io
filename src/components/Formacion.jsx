import { CURSOS, IDIOMAS, PERFIL } from "../data/perfil";

/* Formación, cursos e idiomas. Va al final y es el único sitio donde aparece.
   Nunca entre el encabezado y la experiencia: ahí bloquea el camino a los
   proyectos. */
export default function Formacion({ t }) {
  return (
    <>
      <div style={{ marginBottom: 26 }}>
        <h3
          style={{
            fontFamily: t.display,
            fontSize: t.escala.titulo,
            fontWeight: 700,
            margin: "0 0 3px",
          }}
        >
          {PERFIL.formacion}
        </h3>
        <p style={{ fontSize: t.escala.meta, color: t.suave, margin: 0 }}>
          {PERFIL.escuela} · {PERFIL.periodo}
        </p>
      </div>

      {CURSOS.map((c) => (
        <div key={c.nombre} style={{ marginBottom: 22 }}>
          <h3
            style={{
              fontSize: t.escala.subtitulo,
              fontWeight: 600,
              margin: "0 0 3px",
            }}
          >
            {c.nombre}
          </h3>
          <p style={{ fontSize: t.escala.meta, color: t.suave, margin: 0 }}>
            {c.emisor} · {c.fecha}
          </p>
        </div>
      ))}

      <dl
        style={{
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
          margin: "24px 0 0",
        }}
      >
        {IDIOMAS.map((i) => (
          <div key={i.idioma}>
            <dt style={{ fontSize: t.escala.subtitulo, fontWeight: 600 }}>
              {i.idioma}
            </dt>
            <dd style={{ fontSize: t.escala.meta, color: t.suave, margin: 0 }}>
              {i.nivel}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
