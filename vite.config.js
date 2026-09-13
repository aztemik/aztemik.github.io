import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";
import { BLOQUES } from "./src/data/perfil.js";

/* Resuelve el origen público del sitio en tiempo de compilación.

   Sale de VITE_SITIO, que el flujo de despliegue fija al dominio de Pages. Si
   no está, las URL se quedan relativas.

   Devuelve el origen sin barra final, o "" si no hay dominio conocido. */
function origenDelSitio() {
  const crudo = process.env.VITE_SITIO || "";
  if (!crudo) return "";
  const conEsquema = /^https?:\/\//.test(crudo) ? crudo : `https://${crudo}`;
  return conEsquema.replace(/\/+$/, "");
}

/* Vuelve absolutas las URL de Open Graph y añade og:url y canonical.

   Existe porque los rastreadores no resuelven rutas relativas de forma fiable:
   Twitter exige URL absoluta y LinkedIn es inconsistente. Pero un dominio no
   se conoce hasta desplegar, así que index.html las declara relativas, que son
   válidas en desarrollo, y este plugin las promueve cuando hay dominio.

   Sin dominio no toca nada: el sitio sigue compilando y sirviendo las rutas
   relativas, que es exactamente el comportamiento anterior. */
function metadatosAbsolutos() {
  return {
    name: "metadatos-absolutos",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const origen = origenDelSitio();
        if (!origen) return html;

        return html
          .replace(/content="\/og\.png"/g, `content="${origen}/og.png"`)
          .replace(
            "</head>",
            `  <link rel="canonical" href="${origen}/" />\n` +
              `    <meta property="og:url" content="${origen}/" />\n` +
              `  </head>`,
          );
      },
    },
  };
}

/* Emite una copia de index.html por cada ruta, más un 404.html.

   GitHub Pages no sabe reescribir: entrar directo a /portafolio daría 404 y el
   enlace compartible, que es la razón de usar enrutador de navegador y no de
   hash, dejaría de existir.

   La salida son páginas reales: Pages sirve /portafolio/ con 200 y redirige
   /portafolio a /portafolio/ él solo. Importa porque un 404 impide que LinkedIn
   y compañía generen la vista previa del og:image.

   El 404.html cubre las rutas inventadas: se sirve con estado 404, arranca la
   aplicación y App.jsx la manda a "/" con replace.

   Se emiten copias en vez del truco de 404.html con query string porque las
   rutas son pocas y así no parpadea ni ensucia la barra de direcciones. Si
   algún día son muchas, esto pide prerenderizado de verdad. */
function rutasEstaticas(rutas) {
  let salida;
  return {
    name: "rutas-estaticas",
    apply: "build",
    configResolved(config) {
      salida = config.build.outDir;
    },
    writeBundle() {
      const indice = resolve(salida, "index.html");
      for (const destino of [
        ...rutas.map((r) => `${r}/index.html`),
        "404.html",
      ]) {
        const ruta = resolve(salida, destino);
        mkdirSync(dirname(ruta), { recursive: true });
        copyFileSync(indice, ruta);
      }
    },
  };
}

// https://vite.dev/config/
/* Las rutas salen de los datos y no de una lista escrita a mano: mantener dos
   listas sincronizadas es el descuido que produce un 404 que no se ve hasta
   producción. Dar de alta un proyecto en `perfil.js` basta.

   `perfil.js` se importa desde aquí porque es datos puros, sin dependencias. Si
   algún día importara algo de React esto dejaría de compilar, y habría que
   extraer los slugs a su propio módulo. */
const rutasDeProyecto = BLOQUES.flatMap((bloque) =>
  bloque.items.filter((item) => item.slug).map((item) => `proyecto/${item.slug}`),
);

export default defineConfig({
  plugins: [
    react(),
    metadatosAbsolutos(),
    rutasEstaticas(["portafolio", ...rutasDeProyecto]),
  ],
});
