/* Iconos de tecnología. SVG propios, sin fuentes de iconos ni dependencias.
   Todos dibujan sobre un lienzo de 28 × 24 y heredan el color con
   `currentColor`, para que el tinte lo decida quien los monta.

   Los rótulos de papel viven en `tecnologias.js`; este módulo solo dibuja. Una
   tecnología sin dibujo propio cae en `Pieza` y la retícula no se rompe. */

/* Arco de la C y los dos signos, que es como se escribe el nombre a mano. */
function CMasMas(props) {
  return (
    <svg viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...props}>
      <path d="M12.2 8.1a5.2 5.2 0 1 0 0 7.8" />
      <path d="M18 9.6v4.8M15.6 12h4.8" />
      <path d="M24.5 9.6v4.8M22.1 12h4.8" />
    </svg>
  );
}

/* Cuatro celdas idénticas: la propiedad entera de UTF-32 es que todo carácter
   ocupa lo mismo, así que el icono son cuatro cajas iguales y no una escalera.
   La primera va rellena para que se lea «una unidad» y no «cuatro cosas», y la
   cuarta se corta contra el borde para sugerir que la fila sigue. */
function Celdas(props) {
  return (
    <svg viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" {...props}>
      <rect x="1.9" y="8" width="5.6" height="8" rx="1.3" fill="currentColor" fillOpacity="0.9" stroke="none" />
      <rect x="9.4" y="8" width="5.6" height="8" rx="1.3" />
      <rect x="16.9" y="8" width="5.6" height="8" rx="1.3" />
      <rect x="24.4" y="8" width="2.1" height="8" rx="1" strokeOpacity="0.45" />
    </svg>
  );
}

/* Llaves y un valor en medio: la forma mínima de un objeto JSON. */
function Llaves(props) {
  return (
    <svg viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4.8c-2.4 0-2.4 2.6-2.4 4.1S7.6 12 6.2 12c1.4 0 2.4 1.6 2.4 3.1s0 4.1 2.4 4.1" />
      <path d="M17 4.8c2.4 0 2.4 2.6 2.4 4.1s1 3.1 2.4 3.1c-1.4 0-2.4 1.6-2.4 3.1s0 4.1-2.4 4.1" />
      <circle cx="14" cy="12" r="1.35" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Para lo que todavía no tiene dibujo propio. No se deja hueco: una ficha sin
   icono rompe la retícula y se lee como un fallo de carga. */
function Pieza(props) {
  return (
    <svg viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" {...props}>
      <path d="M14 4.6l6.9 3.7v7.4L14 19.4l-6.9-3.7V8.3z" />
      <circle cx="14" cy="12" r="2.4" />
    </svg>
  );
}

const DIBUJOS = {
  "C++": CMasMas,
  "UTF-32": Celdas,
  "nlohmann/json": Llaves,
};

export default function IconoTec({ nombre, tamanio = 30, ...resto }) {
  /* El lienzo es de 28 × 24, así que el ancho se deriva del alto pedido y
     ninguna ficha sale deformada. */
  const Dibujo = DIBUJOS[nombre] ?? Pieza;

  return (
    <Dibujo
      width={(tamanio * 28) / 24}
      height={tamanio}
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
      {...resto}
    />
  );
}
