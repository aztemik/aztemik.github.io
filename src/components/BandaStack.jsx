import IconoTec from "./IconoTec";
import { fichaDe } from "./tecnologias";
import { useAparicion } from "./useAparicion";

/* Banda de tecnologías de la página de proyecto. En la tarjeta del Portafolio
   el stack son fichas de texto minúsculas, porque ahí compite con todo lo
   demás; aquí es una de las tres cosas que el lector viene a ver, así que
   ocupa una retícula propia con icono, nombre y papel.

   Aparición escalonada al entrar en pantalla, sin giro ni rebote. El
   escalonado sale del índice, igual que en las secciones. */
export default function BandaStack({ stack, t, tinte }) {
  const [ref, visible] = useAparicion();

  if (!stack?.length) return null;

  return (
    <ul
      ref={ref}
      className="banda-stack"
      style={{ listStyle: "none", margin: 0, padding: 0 }}
    >
      {stack.map((nombre, i) => {
        const { papel, nota } = fichaDe(nombre);

        return (
          <li
            key={nombre}
            className={`ficha-tec aparece${visible ? " visible" : ""}`}
            style={{
              "--retraso": `${i * 60}ms`,
              "--ficha-linea": t.linea,
              "--ficha-tinte": tinte,
              "--ficha-fondo": "#11111A",
            }}
          >
            <span className="ficha-tec-icono" style={{ color: tinte }}>
              <IconoTec nombre={nombre} tamanio={30} />
            </span>

            <span style={{ minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: t.display,
                  fontSize: t.escala.subtitulo,
                  fontWeight: 600,
                  color: t.texto,
                  letterSpacing: "-0.01em",
                  overflowWrap: "anywhere",
                }}
              >
                {nombre}
              </span>

              <span
                style={{
                  display: "block",
                  fontFamily: t.utilidad,
                  fontSize: t.escala.chip,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: t.suave,
                  marginTop: 4,
                }}
              >
                {papel}
              </span>

              {nota && (
                <span
                  style={{
                    display: "block",
                    fontSize: t.escala.pie,
                    color: t.suave,
                    marginTop: 5,
                  }}
                >
                  {nota}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
