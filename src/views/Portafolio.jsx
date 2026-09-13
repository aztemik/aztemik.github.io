import Carril from "../components/Carril";
import Formacion from "../components/Formacion";
import Habilidades from "../components/Habilidades";
import Pagina from "../components/Pagina";
import Seccion from "../components/Seccion";
import { useMetadatos } from "../components/useMetadatos";
import { BLOQUES, PERFIL } from "../data/perfil";
import { TEMAS } from "../temas";

/* Vista Portafolio. Ruta "/portafolio".
   Misma estructura y mismo orden de secciones que el CV, con tema oscuro,
   movimiento y el contenido ampliado de cada proyecto.

   Los bloques van apilados, software primero. El magenta identifica el bloque
   de software y el cian el operativo; no se reparten por la página. */
export default function Portafolio() {
  const t = TEMAS.portafolio;

  useMetadatos(`${PERFIL.nombre} · Portafolio`);

  /* Magenta para software, cian para el operativo. El de incubación no estrena
     un tercer neón —dos saturados son el límite— y toma el gris apagado, que
     además lo coloca donde está su prioridad. */
  const TINTES = { software: t.acento, operativo: t.acentoAlt };
  const tinteDe = (bloque) => TINTES[bloque.id] ?? t.suave;

  /* La vista pide el glitch al llegar desde CV: aberración cromática,
     líneas de barrido y revuelto de caracteres, 760 ms. Solo se aplica si
     el usuario viene de la otra vista; un enlace directo abre la página ya
     compuesta. Lo resuelve Pagina con useTransicionEntrada. */

  return (
    <Pagina t={t} entrada="glitch">
      <Seccion id="experiencia" titulo="Experiencia" t={t} animada indice={0}>
        {/* Apilados, software primero. El hueco separa un bloque del otro. */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 64 }}>
          {BLOQUES.map((bloque) => (
            <Carril
              key={bloque.id}
              bloque={bloque}
              t={t}
              tinte={tinteDe(bloque)}
            />
          ))}
        </div>
      </Seccion>

      <Seccion id="habilidades" titulo="Habilidades" t={t} animada indice={1}>
        <Habilidades t={t} />
      </Seccion>

      <Seccion id="formacion" titulo="Formación" t={t} animada indice={2}>
        <Formacion t={t} />
      </Seccion>
    </Pagina>
  );
}
