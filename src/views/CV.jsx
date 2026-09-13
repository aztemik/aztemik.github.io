import Carril from "../components/Carril";
import Formacion from "../components/Formacion";
import Habilidades from "../components/Habilidades";
import Pagina from "../components/Pagina";
import Seccion from "../components/Seccion";
import { useMetadatos } from "../components/useMetadatos";
import { BLOQUES, PERFIL } from "../data/perfil";
import { TEMAS } from "../temas";

/* Vista CV. Ruta "/".
   Una columna, alto contraste, sin color de acento y sin movimiento salvo
   la transición del propio interruptor. Su trabajo es responder quién es y
   qué ha hecho en treinta segundos. */
export default function CV() {
  const t = TEMAS.cv;

  useMetadatos(`${PERFIL.nombre} · CV`);

  return (
    <Pagina t={t} entrada="fundido">
      <Seccion id="experiencia" titulo="Experiencia" t={t}>
        {/* Apilados, software primero. Los 72 px van enteros aquí: la última
            entrada de cada bloque ya no lleva pie, así que este hueco es la única
            separación entre un bloque y otro y no depende de cuánto mida ese pie. */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 72 }}>
          {BLOQUES.map((bloque) => (
            <Carril key={bloque.id} bloque={bloque} t={t} tinte={t.acento} />
          ))}
        </div>
      </Seccion>

      <Seccion id="habilidades" titulo="Habilidades" t={t}>
        <Habilidades t={t} />
      </Seccion>

      <Seccion id="formacion" titulo="Formación" t={t}>
        <Formacion t={t} />
      </Seccion>
    </Pagina>
  );
}
