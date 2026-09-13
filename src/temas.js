/* Paletas, tipografías y escala de tamaños por vista.

   La escala vive aquí y no en los componentes por la misma razón que los
   colores: una pieza pregunta `t.escala.meta` y se adapta, sin saber en qué
   vista está ni repartir números sueltos por el árbol. */

export const TEMAS = {
  cv: {
    modo: "cv",
    fondo: "#FFFFFF",
    texto: "#141414",
    suave: "#5A5A5A",
    linea: "#DDDDDD",
    lineaFuerte: "#BBBBBB",
    acento: "#141414",
    acentoAlt: "#141414",
    cuerpoTexto: "#141414",
    cuerpoFuerte: "#141414",

    /* El criterio no es el ancho de la página sino los caracteres por renglón:
       entre 60 y 90 se lee de corrido, pasados los 100 el bloque se lee como un
       muro. Con 820 px, margen de 42 y cuerpo de 16 px salen unos 90. */
    ancho: 820,
    margen: "clamp(20px, 4vw, 42px)",

    display: "'Libre Baskerville', Georgia, serif",
    cuerpo: "'Libre Baskerville', Georgia, serif",
    utilidad: "'Libre Baskerville', Georgia, serif",

    // `titulo` sube más que el resto: a 16 px de cuerpo, un título de 17 no se
    // distingue del texto y la entrada pierde su cabecera.
    escala: {
      etiqueta: 11.5,
      chip: 11,
      estado: 10.5,
      meta: 14,
      cuerpo: 16,
      altura: 1.6,
      seccion: 15,
      carril: 14.5,
      titulo: 20,
      subtitulo: 16,
      rol: 16,
      contacto: 13.5,
      pie: 12,
    },
  },
  portafolio: {
    modo: "portafolio",
    fondo: "#0A0A0F",
    texto: "#EDEDED",

    // 7.76:1 sobre el fondo. Es el color del texto más pequeño de la vista
    // —fechas, fichas de stack, rótulos, pie—, donde un gris más apagado se
    // queda por debajo del 4.5:1 que pide AA.
    suave: "#9AA3B2",

    // `linea` es la retícula de separadores y bordes de tarjeta; `lineaFuerte`
    // marca lo que el usuario reconoce como un elemento, como el pie de acción.
    linea: "#262633",
    lineaFuerte: "#373748",

    acento: "#FF2E63",
    // Cian aclarado: sobre este fondo mantiene AA en texto pequeño.
    acentoAlt: "#5BEBFF",
    cuerpoTexto: "#C2C6D0",
    cuerpoFuerte: "#D5D8E0",

    // Deja unos 836 px útiles, la medida que ya usaban los carriles. La columna
    // mide lo que mide el contenido, así que la página se centra sola sin
    // centrar una sola línea de texto.
    ancho: 920,
    margen: "clamp(20px, 4vw, 42px)",

    display: "'Space Grotesk', sans-serif",
    cuerpo: "'Inter', system-ui, sans-serif",
    utilidad: "'JetBrains Mono', monospace",

    // Toda la escala sube respecto al CV: el tema oscuro pierde peso de trazo y
    // necesita más cuerpo para leerse igual sin subir el brillo de la pantalla.
    escala: {
      etiqueta: 12,
      chip: 11.5,
      estado: 11,
      meta: 14.5,
      cuerpo: 16,
      altura: 1.75,
      seccion: 14,
      carril: 13,
      titulo: 21,
      subtitulo: 16.5,
      rol: 15,
      contacto: 14,
      pie: 13,
    },
  },
};

/* La página de proyecto hereda el tema del Portafolio y solo cambia el ancho.

   Sus apartados van a dos columnas a partir de 860 px, y los 248 px de rótulo
   más hueco salen del mismo sitio que el texto. Con 920 quedan 588 px de
   medida de lectura, unos 72 caracteres; con el ancho del Portafolio se
   quedaban en 62, la columna más estrecha del sitio en la página de textos
   más largos. */
export const TEMA_DETALLE = { ...TEMAS.portafolio, ancho: 920 };
