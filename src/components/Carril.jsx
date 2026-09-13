import Entrada from "./Entrada";

/* Un bloque de experiencia. Los bloques se apilan en las dos vistas, software
   primero: la misma lectura vertical, para que quien cambia de vista reconozca
   dónde está.

   Sin tope de ancho propio: la medida legible ya la impone la columna, y así
   el carril alinea con el encabezado, el pie y el interruptor de vista. */
export default function Carril({ bloque, t, tinte }) {
  const porta = t.modo === "portafolio";

  return (
    <div
      style={{ flex: "1 1 100%", minWidth: 0 }}
    >
      <div style={{ marginBottom: 24 }}>
        <h3
          style={{
            fontFamily: porta ? t.utilidad : t.display,
            fontSize: t.escala.carril,
            fontWeight: porta ? 400 : 700,
            letterSpacing: porta ? "0.16em" : "0.04em",
            textTransform: "uppercase",
            color: porta ? tinte : t.texto,
            margin: "0 0 6px",
          }}
        >
          {bloque.titulo}
        </h3>
        <p style={{ fontSize: t.escala.meta, color: t.suave, margin: 0 }}>
          {bloque.nota}
        </p>
      </div>

      {bloque.items.map((item, i) => (
        <Entrada
          key={item.id}
          item={item}
          t={t}
          tinte={tinte}
          indice={i}
          ultimo={i === bloque.items.length - 1}
        />
      ))}
    </div>
  );
}
