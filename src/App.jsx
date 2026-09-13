import { Navigate, Route, Routes } from "react-router-dom";
import CV from "./views/CV";
import Portafolio from "./views/Portafolio";
import Proyecto from "./views/Proyecto";

/* Cada vista es una ruta propia y monta su propio tema. Carga por defecto
   en CV: un reclutador que llega sin contexto no debe encontrarse con la
   versión de mayor carga visual.

   `/proyecto/:slug` no es una tercera vista, es una subpágina del Portafolio:
   comparte su tema y su cromo es una vuelta, no el interruptor. Un slug que no
   existe lo resuelve la propia vista devolviendo al Portafolio, que es de
   donde se llega; mandarlo a `/` lo dejaría más lejos de donde estaba. */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CV />} />
      <Route path="/portafolio" element={<Portafolio />} />
      <Route path="/proyecto/:slug" element={<Proyecto />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
