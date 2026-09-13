import { HABILIDADES } from "../data/perfil";
import { useAparicion } from "./useAparicion";

/* Técnicas y herramientas van separadas para que Excel no comparta renglón
   con un lenguaje compilado; la nota está en HABILIDADES, en perfil.js.

   La lista declara un tercer grupo que hoy no existe en los datos: el filtro
   de abajo descarta los vacíos, así que añadir o quitar un grupo es tocar
   `perfil.js` y nada más. */
const GRUPOS = [
  ["Técnicas", HABILIDADES.tecnicas],
  ["Herramientas", HABILIDADES.herramientas],
  ["Profesionales", HABILIDADES.profesionales],
].filter(([, lista]) => lista?.length > 0);

/* Un grupo. Es un componente aparte y no un `map` dentro del de abajo porque
   necesita su propio observador: los dos grupos entran en pantalla a la vez,
   pero cada uno tiene que saber cuándo le toca. */
function Grupo({ rotulo, lista, t, porta, indice }) {
  const [ref, visible] = useAparicion({ activo: porta });

  return (
    <div ref={ref} style={{ flex: porta ? "1 1 240px" : "1 1 190px" }}>
      <h3
        style={{
          fontFamily: t.utilidad,
          fontSize: t.escala.etiqueta,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: t.suave,
          fontWeight: 400,
          margin: "0 0 12px",
        }}
      >
        {rotulo}
      </h3>

      {/* En Portafolio la lista cambia de marca: la raya corta de
          `lista-habilidad` es la misma que separa el rótulo de la fecha en las
          tarjetas, así que no estrena forma. El CV se queda con el disco, que en
          papel blanco es lo que espera quien imprime.
          
          El escalonado baja por la columna, 45 ms entre términos, y la segunda
          columna arranca 80 ms después que la primera: sin ese desfase las dos
          caen a la vez y se leen como dos bloques que parpadean. */}
      <ul
        className={porta ? "lista-habilidad" : undefined}
        style={{
          margin: 0,
          paddingLeft: 18,
          ...(porta ? { "--habilidad-marca": t.suave } : null),
        }}
      >
        {lista.map((s, i) => (
          <li
            key={s}
            className={porta ? `aparece${visible ? " visible" : ""}` : undefined}
            /* Un punto menos que el cuerpo en CV. No es solo para que
               «Excel intermedio-avanzado» no parta en dos: son términos
               sueltos, no prosa, y al mismo tamaño que las viñetas de
               logro pedían la misma atención que ellas sin merecerla. */
            style={{
              fontSize: porta ? t.escala.cuerpo : t.escala.cuerpo - 1,
              lineHeight: porta ? 1.85 : 1.7,
              ...(porta ? { "--retraso": `${indice * 80 + i * 45}ms` } : null),
            }}
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Habilidades({ t }) {
  const porta = t.modo === "portafolio";

  /* La base de cada columna la fija el ancho disponible, no un número redondo.
     Están calculados para que entren tres grupos en la columna del CV sin que
     el tercero caiga a una segunda fila; con dos sobra sitio, pero así
     recuperar el tercero no obliga a recalcular nada. */
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: porta ? 44 : 34 }}>
      {GRUPOS.map(([rotulo, lista], i) => (
        <Grupo
          key={rotulo}
          rotulo={rotulo}
          lista={lista}
          t={t}
          porta={porta}
          indice={i}
        />
      ))}
    </div>
  );
}
