/* Fuente de datos única: las vistas CV y Portafolio leen de aquí. Los campos
   base los consumen ambas; `extendido` es opcional y solo lo lee el
   Portafolio. Ningún texto se duplica entre vistas. */

export const  PERFIL = {
  nombre: "Ivan Gonzalez",
  rol: "Desarrollador de software",
  formacion: "TSU en Desarrollo de Software Multiplataforma",
  escuela: "Universidad Tecnológica de Puebla",
  periodo: "2022 – 2024",
  ubicacion: "Puebla, México",
  correo: "yaotzinen@gmail.com",
  telefono: "+52 222 531 2923",
  telefonoTel: "+522225312923",
  github: "github.com/aztemik",
  githubUrl: "https://github.com/aztemik",
  cvPdf: "/cv-ivan-gonzalez.pdf",
  /* Este resumen deja fuera la formación, los lenguajes y la petición de
     prácticas: los tres están en otra parte de la página —sección propia,
     `stack` de cada proyecto, `extendido.disponibilidad`— y el encabezado se
     gasta en lo único que no aparece en ningún otro sitio.

     «Programación de sistemas» y no «bajo nivel»: el término correcto entre
     programadores, pero quien filtra los CV no siempre lo es y ahí «bajo» se
     parece demasiado a «básico». */
  resumen:
    "Programación de sistemas: trabajo en la capa donde el software toca la máquina, con manejo de memoria, formatos binarios y procesamiento de texto. Vengo del taller y de la planta: carpintería, instalación eléctrica y, hoy, operador de línea en una fábrica de componentes automotrices.",

  /* Solo lo lee el Portafolio. El CV omite estos campos: su encabezado va sin
     adorno y el empleo vigente se ve en la fecha de la entrada de Huf Mexico. */
  extendido: {
    /* Línea destacada de la vista, lo primero que se lee. Con fecha concreta:
       «disponible para oportunidades» no dice nada. */
    disponibilidad: "Busco prácticas de ingeniería en TI · Enero a abril de 2027",
    empleoActual: "Actualmente operador de línea en Huf Mexico",

    /* Método en lugar de adjetivos, anclado en el orden de prioridades de la
       planta. No repite nada del CV: ni lenguajes, ni oficios, ni formación, y
       tampoco las fechas de prácticas, que ya están en `disponibilidad`. */
    resumen:
      "Llegué al software desde el taller. En la planta donde trabajo la regla no cambia de un turno a otro: primero seguridad, después calidad, al final producción. Programo en ese mismo orden. Entiendo el problema antes de tocarlo, dejo cada etapa verificable por su cuenta y no llamo terminado a lo que no lo está. Casi todo lo he aprendido solo y lo construyo desde abajo aunque exista una librería que ya lo resuelva, porque es la única forma en que se me queda. De esas prácticas quiero salir hacia ciencia de datos; el tokenizador ya apunta en esa dirección. Los modelos de inteligencia artificial vienen después.",
  },
};

export const SOFTWARE = {
  id: "software",
  titulo: "Desarrollo de software",
  nota: "Trabajo propio, fuera del aula.",
  items: [
    {
      id: "bpe-tokenizer",
      /* Con `slug` el proyecto gana página propia y la tarjeta abre su celda de
         «Detalles»; sin él se queda en el resumen. Va escrito a mano y no
         derivado del `id`: el `id` es interno y puede cambiar, la URL no. */
      slug: "tokenizador",
      nombre: "Tokenizador byte-pair encoding",
      contexto: "Proyecto personal",
      /* Periodo cerrado y no «Noviembre 2024» a secas: el trabajo que sostiene
         la entrada es de septiembre de 2026 y la fecha suelta lo escondía. */
      fecha: "Noviembre 2024 – Septiembre 2026",
      /* Sin etiqueta: el estado avisa de una reserva —a medias, parado— y aquí
         no la hay. SubUrban sí conserva la suya. */
      estado: null,
      stack: ["C++", "UTF-32", "nlohmann/json"],
      /* Renombrado desde "Byte-Per-Encoding". GitHub mantiene la redirección,
         así que un enlace viejo tampoco se rompe. */
      repo: "https://github.com/aztemik/Byte-Pair-Encoding",
      /* Las cifras salen del corpus de ejemplo que incluye el repositorio, así
         que quien clone obtiene las mismas. */
      puntos: [
        "Bucle de fusión iterativa en C++17: toma el par más frecuente, lo sustituye en todas sus apariciones y repite hasta el umbral. 174 reglas y 225 tokens sobre el corpus de ejemplo.",
        "Pretokenización por palabras, con el espacio pegado al inicio de la siguiente, para que las uniones no crucen fronteras léxicas: 3.2 caracteres por token en texto nuevo, sin un solo <UNK>.",
        "Capa de persistencia binaria propia, sin motor de base de datos: cuatro almacenes de registros y metadatos, con acceso directo por desplazamiento y copia de seguridad antes de cada reconstrucción.",
        "Representación interna en UTF-32, con conversión escrita a mano desde y hacia UTF-8, para que un acento ocupe una posición y no varias.",
      ],
      extendido: {
        /* Abre la página de proyecto a tamaño grande, sola. `problema` arranca
           desde ahí, así que no se repiten. */
        entrada: "Un modelo de lenguaje no lee texto, lee números.",
        problema:
          "Antes de entrenar nada hay que partir las frases en piezas y darle a cada pieza un identificador estable. Este proyecto construye ese diccionario a partir de un corpus propio, en lugar de depender de uno ya hecho, para entender de primera mano cómo se forma.",
        decisiones: [
          {
            titulo: "UTF-32 en memoria en vez de UTF-8",
            texto:
              "UTF-8 usa entre uno y cuatro bytes por carácter, así que indexar por posición obliga a recorrer la cadena. En UTF-32 todo carácter ocupa cuatro bytes y la posición i es la posición i. Cuesta memoria y se paga a gusto: el algoritmo trabaja con pares de caracteres y necesita indexar constantemente.",
          },
          {
            titulo: "Registros y metadatos en archivos separados",
            texto:
              "Los metadatos son de tamaño fijo, así que se recorren de corrido y cada entrada dice en qué byte empieza su valor y cuánto mide. Con un solo archivo entremezclado habría que leerlo entero para llegar al último registro.",
          },
          {
            titulo: "Cuatro almacenes en vez de uno",
            texto:
              "Pares en crudo, pares con su frecuencia, vocabulario final y reglas de fusión se guardan por separado. Cada etapa se puede inspeccionar y rehacer sin repetir la anterior, que en un corpus grande es la diferencia entre depurar en segundos o en minutos.",
          },
          {
            titulo: "Las reglas se guardan en el orden en que se aprendieron",
            texto:
              "Bastaba con listarlas, pero el orden es parte del algoritmo y no un detalle de implementación: una regla tardía puede depender de un token que solo existe porque otra anterior lo creó. Guardado el orden, tokenizar es recorrerlo; perdido, el mismo vocabulario da resultados distintos.",
          },
          {
            titulo: "Cada palabra, una secuencia aparte",
            texto:
              "Tratar el espacio como un símbolo más era lo directo y comprimía mejor sobre el propio corpus, pero el bucle aprendía «ala» o «delautobú»: memorizaba qué palabras van juntas en vez de unidades del idioma. Aislando cada palabra y marcando el espacio al inicio de la siguiente, como hace GPT-2, sube la compresión y además sirve para texto que no vio al entrenar.",
          },
        ],
        /* Van en primera persona y sobre mi propia búsqueda, sin afirmar nada
           sobre el estado del campo en 2024: dicho como hecho es discutible en
           una entrevista. El aprendizaje no desdice el UTF-32 de más arriba;
           revisa la premisa de haberlo montado para el español. */
        dificultades:
          "Entender cómo funcionaba, más que escribirlo. Cuando me puse, en noviembre de 2024, lo que encontraba era divulgación o el código ya resuelto de alguien más, y ver el mecanismo por dentro obligaba a buscar muy específico. Acabé leyendo «Attention is all you need» para entender de dónde salía la tokenización, que es el paso anterior a todo lo que ahí se describe. Quería partir de cero, sin montarme sobre el modelo, el vocabulario ni las licencias de otra empresa, y eso quita los atajos: no hay pieza que puedas usar sin haberla entendido antes.",
        aprendizaje:
          "Que había medido mal el punto de partida: hoy se descarga un modelo abierto y se ajusta a lo que haga falta, así que empezar de cero era una elección y no la única salida. Y sobre el UTF-32, la decisión sigue siendo la correcta para el problema que resolvía, pero revisaría la premisa. Montarlo para el español desde el principio se paga a cuatro bytes por carácter en todo el proceso; hoy levantaría el vocabulario en inglés, que ocupa menos, y dejaría el español para una capa de traducción posterior.",
        /* La misma lista que el README del repositorio: quien cruce del sitio al
           código no debe encontrar dos versiones. El conteo incremental va
           primero porque es la pregunta que sigue a ver el bucle. */
        siguiente:
          "El bucle recuenta el corpus entero en cada vuelta: con treinta frases es instantáneo, con uno grande hay que mantener los contadores y actualizar solo lo que cada paso toca. Después, destokenizar —el esquema de espacios lo permite sin pérdida—, pruebas automatizadas en lugar de la comprobación a mano, y la configuración fuera del código.",
      },
    },
  ],
};

/* Bloque aparte y no dentro de software: el prototipo quedó sin terminar, y
   quien abre «Desarrollo de software» busca programas, no un plan de negocios.
   Aquí demuestra lo que sí demuestra, llevar un proyecto de la idea al jurado.
   Si el prototipo se termina, la parte de software puede subir al otro bloque. */
export const PROYECTOS = {
  id: "proyectos",
  titulo: "Proyecto de incubación",
  nota: "Planeación, modelo de negocio y presentación.",
  items: [
    {
      id: "suburban",
      nombre: "SubUrban",
      contexto:
        "Universidad Tecnológica de Puebla · Centro de Incubación de Empresas",
      fecha: "Febrero 2024",
      estado: "Pausado",
      stack: ["Estudio de mercado", "Modelo de negocio", "Proyecciones financieras"],
      repo: null,
      puntos: [
        "Estudio de mercado, modelo de negocio y proyecciones financieras de una propuesta de movilidad urbana: punto de equilibrio, costos y retorno.",
        "Coordinación del equipo que levantó el prototipo, con cálculo de rutas y seguimiento de unidades. Funcionó como demostración; no es un producto terminado.",
        "Presentación del proyecto ante mentores y jurado del centro de incubación.",
      ],
    },
  ],
};

export const OPERATIVO = {
  id: "operativo",
  titulo: "Experiencia operativa e industrial",
  nota: "Precisión, normas de seguridad y entrega en tiempo.",
  items: [
    {
      id: "huf-mexico",
      nombre: "Operador de línea",
      contexto: "Huf Mexico · Componentes automotrices · San Francisco Ocotlán, Puebla",
      fecha: "Septiembre 2025 – Actualidad",
      estado: null,
      /* Ninguna vista lo lee hoy. Se conserva porque es un hecho de la entrada,
         no una marca de presentación, y evita tener que analizar `fecha` para
         saber qué empleo sigue abierto. */
      actual: true,
      stack: [
        "Ensamble automotriz",
        "Formato F270",
        "TPM",
        "Rotación entre líneas",
      ],
      /* La ficha de planta de la empresa no es un repositorio, y `EnlaceRepo`
         rotula la franja como tal. Mejor fuera que mal etiquetado. */
      repo: null,
      /* Seis máquinas, no siete, y las cubro una por turno: la diferencia entre
         «conozco» y «opero a la vez» es pequeña al escribirla y grande en una
         entrevista. El orden de prioridades de la planta no se repite aquí; es
         el ancla de `extendido.resumen`. */
      puntos: [
        "Rotación entre cinco líneas de la planta: WS Soporte Bracket, Mazda, Línea 3, DT y MP.",
        "Dominio de las 6 máquinas de ensamble de WS Soporte Bracket, una de las líneas con más reclamos de la planta: cubro cualquier estación.",
        "Verificación de seguridad al inicio de turno con el formato F270 y revisión de los puntos de TPM antes de arrancar máquina.",
      ],
    },
    {
      id: "acic",
      nombre: "Asistente técnico",
      contexto: "ACIC · Aire comprimido · San Bernabé Temoxtitla, Puebla",
      fecha: "Agosto 2025",
      estado: null,
      actual: false,
      stack: [
        "Sistemas neumáticos",
        "Canalización eléctrica",
        "Trabajo en altura",
      ],
      repo: null,
      puntos: [
        "Montaje de sistemas de distribución de aire comprimido en planta industrial.",
        "Instalación de canaletas y tendido de cableado eléctrico conforme a normas de seguridad.",
        "Habilitación de bajadas para la conexión de herramienta neumática.",
      ],
    },
    {
      id: "carlevaro",
      nombre: "Auxiliar de producción",
      contexto: "Carlevaro · Mueblería · Puebla, México",
      fecha: "Agosto 2023",
      estado: null,
      actual: false,
      stack: ["Maquinado de madera", "Ensamble", "Mantenimiento"],
      repo: null,
      puntos: [
        "Corte de madera y alineación de piezas para el ensamblaje de mobiliario.",
        "Coordinación entre áreas para sostener la operación durante temporadas de alta demanda.",
        "Mantenimiento de instalaciones eléctricas en las áreas asignadas.",
      ],
    },
  ],
};

/* Software primero en las dos vistas. Incubación al final: es lo más lejano al
   puesto que se busca. */
export const BLOQUES = [SOFTWARE, OPERATIVO, PROYECTOS];

/* Ordenadas por lo que el propio sitio puede sostener. Fuera Kotlin y NoSQL
   mientras no haya un proyecto que los respalde: una habilidad sin respaldo
   solo sirve para que pregunten por ella. Excel va en `herramientas` y no
   junto a C++, porque quien lee una lista la promedia.

   `Habilidades` filtra los grupos vacíos: basta con que la clave no exista
   para que la sección se recomponga sola. */
export const HABILIDADES = {
  tecnicas: [
    "C++",
    "JavaScript",
    "Python",
    "SQL",
  ],
  herramientas: ["Git y GitHub", "Excel intermedio-avanzado"],
};

export const CURSOS = [
  {
    nombre: "CCNAv7: Introducción a redes",
    emisor: "Cisco Networking Academy",
    fecha: "Mayo 2023",
  },
];

export const IDIOMAS = [
  { idioma: "Español", nivel: "Nativo" },
  { idioma: "Inglés", nivel: "B2" },
];

/* Búsqueda por `slug` para la ruta /proyecto/<slug>. Devuelve también el
   bloque, porque de ahí sale el tinte de la página. Un slug inexistente
   devuelve null y la vista redirige en lugar de pintar un hueco. */
export const rutaDeProyecto = (item) => `/proyecto/${item.slug}`;

export function proyectoPorSlug(slug) {
  for (const bloque of BLOQUES) {
    const item = bloque.items.find((i) => i.slug === slug);
    if (item) return { item, bloque };
  }
  return null;
}

/* Enlaces de contacto del encabezado. Comunes a ambas vistas. */
export const CONTACTO = [
  { etiqueta: PERFIL.correo, href: `mailto:${PERFIL.correo}` },
  { etiqueta: PERFIL.telefono, href: `tel:${PERFIL.telefonoTel}` },
  { etiqueta: PERFIL.github, href: PERFIL.githubUrl, externo: true },
  { etiqueta: "Descargar CV", href: PERFIL.cvPdf, descarga: true },
];
