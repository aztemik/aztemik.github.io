#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera pdfs/cv-ivan-gonzalez.pdf con el contenido del sitio.

   Dos hojas tamano carta. El diseno es el de los CV anteriores —paleta,
   iconos, cuerpos y retícula, medidos sobre pdfs/cv_ivan.pdf— y el contenido
   sale de src/data/perfil.js, que es lo que publica la vista CV. Lo que el
   formato viejo pedia y el sitio no tiene (responsabilidades y logros por
   separado, habilidades sin respaldo) no se inventa: se queda fuera.

   Dos diferencias deliberadas con el PDF anterior:
     · el enlace del encabezado es la pagina, no el repositorio de GitHub;
     · no hay pie de pagina.

   Sin dependencias de Python. Node solo se usa para leer perfil.js, de modo
   que el PDF no puede quedarse atras del sitio.

   Uso:  python3 herramientas/genera-cv-pdf.py [destino.pdf]
   Sin argumento escribe en public/, donde el sitio lo busca.
"""

import json
import subprocess
import sys
import zlib
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from cv_fuentes import Fuente                                   # noqa: E402

RAIZ = Path(__file__).resolve().parents[1]
# El PDF se escribe dentro de public/, en la ruta que `PERFIL.cvPdf` publica:
# asi el boton «Descargar CV» del sitio y el archivo no pueden separarse, y el
# build de Vite se lo lleva a dist/ tal cual.
PUBLICO = RAIZ / "public"

# La direccion del sitio no vive en perfil.js —el sitio no necesita saber la
# suya—, pero es la que sustituye al repositorio en el encabezado del PDF.
PAGINA_WEB = "aztemik.github.io"

# ------------------------------------------------------------------ paleta
# Los tres colores estan leidos del flujo de contenido del PDF anterior.
NEGRO = (0, 0, 0)
GRIS = (0.458824, 0.458824, 0.458824)
CARMIN = (1, 0.090196, 0.266667)

# --------------------------------------------------------------- geometria
ANCHO, ALTO = 612.0, 792.0          # carta
MARGEN = 36.0
DERECHA = ANCHO - MARGEN            # 576
X_VINETA = MARGEN + 36.0            # la vineta cuelga a 72 del borde
X_TEXTO = MARGEN + 54.0             # y su texto a 90
LIMITE = 748.0                      # ultima linea util de una hoja
ALTO_PRIMERA = 62.0                 # linea base del nombre
ALTO_SIGUIENTE = 52.0               # primera linea base de las hojas que siguen

# ------------------------------------------------------------------ cuerpos
NOMBRE = 32
ROL = 10
SUBTITULO = 10
CONTACTO = 7
ESPACIADO_CONTACTO = 1.0            # el encabezado viejo va espaciado
CUERPO = 11
SECCION = 11
TITULO = 11
META = 9
FECHA_DERECHA = 8
ESTADO = 8

# -------------------------------------------------- ritmo vertical, en pt
# Distancias entre lineas base, medidas sobre el PDF anterior.
# El texto conserva el ritmo del PDF anterior; los huecos entre piezas se
# abren un poco, porque este contenido es mas corto y con las medidas
# originales la segunda hoja se quedaba a medio llenar.
INTERLINEA = 12.65                  # dentro de un mismo parrafo
SALTO_VINETA = 14.6                 # entre vinetas
TRAS_SECCION = 24.0                 # cabecera de seccion -> lo que sigue
TRAS_TITULO = 13.3                  # titulo de entrada -> linea de fecha
TRAS_FECHA = 15.5                   # linea de fecha -> primera vineta
TRAS_FICHAS = 14.5                  # ultima vineta -> linea de tecnologias
ENTRE_ENTRADAS = 36.0               # fin de una entrada -> titulo siguiente
ANTES_SECCION = 50.0                # fin de lo anterior -> cabecera de seccion
ENTRE_FILAS = 12.6                  # filas de la rejilla de habilidades

# ---------------------------------------------------------------- tipografia
CARPETAS = [
    "/usr/share/fonts/truetype/liberation",
    "/usr/share/fonts/liberation",
    "/usr/share/fonts/TTF",
]
ARCHIVOS = {
    "serif": "LiberationSerif-Regular.ttf",
    "serif-negrita": "LiberationSerif-Bold.ttf",
    "serif-cursiva": "LiberationSerif-Italic.ttf",
    "sans": "LiberationSans-Regular.ttf",
    "sans-negrita": "LiberationSans-Bold.ttf",
    "sans-cursiva": "LiberationSans-Italic.ttf",
}


def cargar_fuentes():
    fuentes = {}
    for alias, archivo in ARCHIVOS.items():
        for carpeta in CARPETAS:
            ruta = Path(carpeta) / archivo
            if ruta.exists():
                fuentes[alias] = Fuente(ruta)
                break
        else:
            raise SystemExit(
                "Falta %s. En Debian/Ubuntu: apt install fonts-liberation" % archivo)
    return fuentes


# ------------------------------------------------------------------- iconos
# Trazos copiados del PDF anterior, con su caja de origen para poder moverlos.
# El del globo es nuevo: sustituye al gato de GitHub, que ya no aplica.
ICONO_SOBRE = {
    "x0": 148.5, "y0": 680.05, "ancho": 14.0, "alto": 10.9,
    "trazos": """q 0.65368 w 1 J 1 j
149.25 689.4 m
154.1 685.75 l 154.95 685.15 156.05 685.15 156.9 685.75 c
161.75 689.4 l S
Q
q 0.65368 w 1 J 0 j 3.8637033051 M
155.5 680.05 m
160.95 680.05 l 161.8 680.05 162.5 680.75 162.5 681.6 c
162.5 689.4 l 162.5 690.25 161.8 690.95 160.95 690.95 c 150.05 690.95 l
149.2 690.95 148.5 690.25 148.5 689.4 c 148.5 681.6 l 148.5 680.75 149.2 680.05 150.05 680.05 c
155.5 680.05 l h
S
Q""",
}

ICONO_TELEFONO = {
    "x0": 271.2, "y0": 680.2, "ancho": 11.95, "alto": 11.95,
    "trazos": """q 0.52784 w 1 J 1 j
278.15 689.6 m
278.75 689.5 279.3 689.2 279.75 688.75 c 280.2 688.3 280.5 687.75 280.6 687.15 c
S
Q
q 0.52784 w 1 J 1 j
278.15 692.15 m
279.4 692 280.6 691.4 281.5 690.5 c 282.4 689.6 283 688.4 283.15 687.15 c
S
Q
q 0.52784 w 1 J 1 j
280.95 680.2 m
275.55 680.2 271.2 684.55 271.2 689.95 c 271.2 690.2 271.2 690.4 271.2 690.65 c
271.25 690.95 271.25 691.05 271.3 691.2 c 271.4 691.3 271.5 691.4 271.6 691.45 c
271.7 691.5 271.85 691.5 272.2 691.5 c 273.95 691.5 l 274.2 691.5 274.35 691.5 274.45 691.45 c
274.55 691.45 274.6 691.35 274.7 691.3 c 274.75 691.2 274.8 691.1 274.9 690.85 c
275.6 688.85 l 275.7 688.55 275.8 688.4 275.75 688.3 c 275.75 688.15 275.7 688.05 275.65 687.95 c
275.6 687.85 275.45 687.75 275.2 687.6 c 274.35 687.1 l 275.1 685.45 276.45 684.1 278.1 683.35 c
278.6 684.2 l 278.75 684.45 278.85 684.6 278.95 684.65 c 279.05 684.7 279.15 684.75 279.3 684.75 c
279.4 684.8 279.55 684.7 279.85 684.6 c 281.85 683.9 l 282.1 683.8 282.2 683.75 282.3 683.7 c
282.35 683.6 282.45 683.55 282.45 683.45 c 282.5 683.35 282.5 683.2 282.5 682.95 c
282.5 681.2 l 282.5 680.85 282.5 680.7 282.45 680.6 c 282.4 680.5 282.3 680.4 282.2 680.3 c
282.05 680.25 281.95 680.25 281.65 680.2 c 281.4 680.2 281.2 680.2 280.95 680.2 c
h
S
Q""",
}


def icono_globo(radio=6.0, grosor=0.6):
    """Circulo, ecuador y meridiano. Mismo estilo de linea que los otros dos."""
    k = 0.5523 * radio
    r = radio
    t = ["q %.3f w 1 J 1 j" % grosor]
    # circunferencia
    t.append("%.3f %.3f m" % (r * 2, r))
    t.append("%.3f %.3f %.3f %.3f %.3f %.3f c" % (r * 2, r + k, r + k, r * 2, r, r * 2))
    t.append("%.3f %.3f %.3f %.3f %.3f %.3f c" % (r - k, r * 2, 0, r + k, 0, r))
    t.append("%.3f %.3f %.3f %.3f %.3f %.3f c" % (0, r - k, r - k, 0, r, 0))
    t.append("%.3f %.3f %.3f %.3f %.3f %.3f c" % (r + k, 0, r * 2, r - k, r * 2, r))
    t.append("S Q")
    # ecuador
    t.append("q %.3f w 1 J" % grosor)
    t.append("%.3f %.3f m %.3f %.3f l S Q" % (0.1 * r, r, 1.9 * r, r))
    # meridiano: una elipse estrecha del mismo alto que el circulo
    a = r * 0.52
    ka = 0.5523 * a
    t.append("q %.3f w 1 J 1 j" % grosor)
    t.append("%.3f %.3f m" % (r + a, r))
    t.append("%.3f %.3f %.3f %.3f %.3f %.3f c" % (r + a, r + k, r + ka, r * 2, r, r * 2))
    t.append("%.3f %.3f %.3f %.3f %.3f %.3f c" % (r - ka, r * 2, r - a, r + k, r - a, r))
    t.append("%.3f %.3f %.3f %.3f %.3f %.3f c" % (r - a, r - k, r - ka, 0, r, 0))
    t.append("%.3f %.3f %.3f %.3f %.3f %.3f c" % (r + ka, 0, r + a, r - k, r + a, r))
    t.append("S Q")
    return {"x0": 0.0, "y0": 0.0, "ancho": r * 2, "alto": r * 2, "trazos": "\n".join(t)}


def icono_paloma(lado=6.6, grosor=1.1):
    """La paloma de la lista de habilidades, en trazo en vez de en glifo."""
    return {
        "x0": 0.0, "y0": 0.0, "ancho": lado, "alto": lado * 0.78,
        "trazos": "q %.2f w 1 J 1 j\n0 %.2f m %.2f 0 l %.2f %.2f l S Q"
                  % (grosor, lado * 0.40, lado * 0.33, lado, lado * 0.78),
    }


# ------------------------------------------------------------------- lienzo
def cadena_pdf(texto):
    """Texto a literal PDF en WinAnsi, que es lo que declara cada fuente."""
    crudo = texto.encode("cp1252", "replace")
    escapado = crudo.replace(b"\\", b"\\\\").replace(b"(", b"\\(").replace(b")", b"\\)")
    return b"(" + escapado + b")"


class Documento:
    """Escribe el PDF: objetos, paginas, texto, trazos y enlaces."""

    def __init__(self, fuentes):
        self.fuentes = fuentes
        self.alias = {a: "F%d" % (i + 1) for i, a in enumerate(fuentes)}
        self.paginas = []
        self.nueva_pagina()

    # ---------------------------------------------------------- superficie
    def nueva_pagina(self):
        self.paginas.append({"ops": [], "enlaces": []})
        return self.paginas[-1]

    @property
    def actual(self):
        return self.paginas[-1]

    def _color(self, color, trazo=False):
        return "%.6f %.6f %.6f %s" % (color[0], color[1], color[2], "RG" if trazo else "rg")

    # --------------------------------------------------------------- texto
    def texto(self, x, y, texto, alias, tam, color=NEGRO, espaciado=0.0, engrose=0.0):
        """`y` es la linea base medida desde el borde superior de la hoja.

           `engrose` dibuja el contorno ademas del relleno: es como se imita
           el Arial Black del nombre sin cargar una fuente mas."""
        if not texto:
            return
        self.fuentes[alias].anotar(texto)
        ops = self.actual["ops"]
        ops.append("BT")
        ops.append("%s" % self._color(color))
        if engrose:
            ops.append("%s" % self._color(color, trazo=True))
            ops.append("%.3f w 2 Tr" % engrose)
        if espaciado:
            ops.append("%.3f Tc" % espaciado)
        ops.append("/%s %.2f Tf" % (self.alias[alias], tam))
        ops.append("1 0 0 1 %.3f %.3f Tm" % (x, ALTO - y))
        ops.append(cadena_pdf(texto).decode("latin-1") + " Tj")
        if espaciado:
            ops.append("0 Tc")
        if engrose:
            ops.append("0 Tr")
        ops.append("ET")

    def ancho(self, texto, alias, tam, espaciado=0.0):
        return self.fuentes[alias].ancho(texto, tam, espaciado)

    # -------------------------------------------------------------- trazos
    def icono(self, icono, x, y, color=NEGRO):
        """Coloca un icono con su esquina inferior izquierda en (x, y),
           medido `y` desde arriba."""
        dx = x - icono["x0"]
        dy = (ALTO - y) - icono["y0"]
        self.actual["ops"].append(
            "q %s 1 0 0 1 %.3f %.3f cm\n%s\nQ"
            % (self._color(color, trazo=True), dx, dy, icono["trazos"]))

    def linea(self, x1, y1, x2, y2, grosor=0.55, color=NEGRO):
        self.actual["ops"].append(
            "q %s %.3f w %.3f %.3f m %.3f %.3f l S Q"
            % (self._color(color, trazo=True), grosor, x1, ALTO - y1, x2, ALTO - y2))

    # ------------------------------------------------------------- enlaces
    def enlace(self, x, y, ancho, alto, url):
        """Zona pulsable. `y` es la linea base; la caja la envuelve."""
        self.actual["enlaces"].append((x, ALTO - y - alto * 0.25, ancho, alto, url))

    # -------------------------------------------------------------- volcado
    def _fuente_objetos(self, obj, alias, fuente):
        """Fuente TrueType incrustada, con sus anchos en WinAnsi."""
        anchos = []
        for codigo in range(32, 256):
            try:
                caracter = bytes([codigo]).decode("cp1252")
            except UnicodeDecodeError:
                anchos.append(0)
                continue
            anchos.append(fuente.avance(ord(caracter)))
        archivo = fuente.subconjunto()
        comprimido = zlib.compress(archivo, 9)

        banderas = 32
        if "serif" in alias:
            banderas |= 2
        if "cursiva" in alias:
            banderas |= 64
        nombre = Path(fuente.ruta).stem

        flujo = (b"<< /Length %d /Filter /FlateDecode /Length1 %d >>\nstream\n"
                 % (len(comprimido), len(archivo)) + comprimido + b"\nendstream")
        descriptor = ("<< /Type /FontDescriptor /FontName /%s /Flags %d "
                      "/FontBBox [%d %d %d %d] /ItalicAngle %.1f /Ascent %d "
                      "/Descent %d /CapHeight %d /StemV %d /FontFile2 %d 0 R >>"
                      % (nombre, banderas, fuente.caja[0], fuente.caja[1],
                         fuente.caja[2], fuente.caja[3], fuente.inclinacion,
                         fuente.ascenso, fuente.descenso, fuente.altura_mayusculas,
                         160 if fuente.peso >= 600 else 80, obj + 2)).encode("latin-1")
        tipo = ("<< /Type /Font /Subtype /TrueType /BaseFont /%s "
                "/FirstChar 32 /LastChar 255 /Widths [%s] /Encoding /WinAnsiEncoding "
                "/FontDescriptor %d 0 R >>"
                % (nombre, " ".join(str(a) for a in anchos), obj + 1)).encode("latin-1")
        return [tipo, descriptor, flujo]

    def bytes(self, titulo, autor):
        objetos = []

        def agregar(cuerpo):
            objetos.append(cuerpo)
            return len(objetos)

        catalogo = agregar(b"")        # 1
        paginas_obj = agregar(b"")     # 2

        recursos_fuente = []
        for alias, fuente in self.fuentes.items():
            base = len(objetos) + 1
            for cuerpo in self._fuente_objetos(base, alias, fuente):
                agregar(cuerpo)
            recursos_fuente.append("/%s %d 0 R" % (self.alias[alias], base))

        hojas = []
        for pagina in self.paginas:
            contenido = "\n".join(pagina["ops"]).encode("latin-1")
            comprimido = zlib.compress(contenido, 9)
            flujo = agregar(b"<< /Length %d /Filter /FlateDecode >>\nstream\n"
                            % len(comprimido) + comprimido + b"\nendstream")
            anotaciones = []
            for x, y, ancho, alto, url in pagina["enlaces"]:
                anotaciones.append(agregar(
                    ("<< /Type /Annot /Subtype /Link /Border [0 0 0] "
                     "/Rect [%.2f %.2f %.2f %.2f] /A << /S /URI /URI (%s) >> >>"
                     % (x, y, x + ancho, y + alto, url)).encode("latin-1")))
            hojas.append((flujo, anotaciones))

        paginas_ids = []
        for flujo, anotaciones in hojas:
            cuerpo = ("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 %.0f %.0f] "
                      "/Resources << /Font << %s >> >> /Contents %d 0 R"
                      % (ANCHO, ALTO, " ".join(recursos_fuente), flujo))
            if anotaciones:
                cuerpo += " /Annots [%s]" % " ".join("%d 0 R" % a for a in anotaciones)
            cuerpo += " >>"
            paginas_ids.append(agregar(cuerpo.encode("latin-1")))

        info = agregar(("<< /Title (%s) /Author (%s) /Subject (Curriculum vitae) "
                        "/Creator (herramientas/genera-cv-pdf.py) >>"
                        % (titulo, autor)).encode("cp1252"))

        objetos[catalogo - 1] = b"<< /Type /Catalog /Pages 2 0 R >>"
        objetos[paginas_obj - 1] = (
            "<< /Type /Pages /Count %d /Kids [%s] >>"
            % (len(paginas_ids), " ".join("%d 0 R" % p for p in paginas_ids))
        ).encode("latin-1")

        salida = bytearray(b"%PDF-1.7\n%\xe2\xe3\xcf\xd3\n")
        posiciones = []
        for i, cuerpo in enumerate(objetos, start=1):
            posiciones.append(len(salida))
            salida += b"%d 0 obj\n" % i + cuerpo + b"\nendobj\n"
        inicio_tabla = len(salida)
        salida += b"xref\n0 %d\n" % (len(objetos) + 1)
        salida += b"0000000000 65535 f \n"
        for p in posiciones:
            salida += b"%010d 00000 n \n" % p
        salida += (b"trailer\n<< /Size %d /Root 1 0 R /Info %d 0 R >>\nstartxref\n%d\n%%%%EOF\n"
                   % (len(objetos) + 1, info, inicio_tabla))
        return bytes(salida)


# --------------------------------------------------------------- contenido
def datos_del_sitio():
    """Lee src/data/perfil.js con Node. Es la misma fuente que pinta la vista
       CV, asi que el PDF y el sitio no pueden discrepar."""
    guion = (
        "import {PERFIL, BLOQUES, HABILIDADES, CURSOS, IDIOMAS} "
        "from './src/data/perfil.js';"
        "process.stdout.write(JSON.stringify("
        "{PERFIL, BLOQUES, HABILIDADES, CURSOS, IDIOMAS}));"
    )
    try:
        salida = subprocess.run(["node", "--input-type=module", "-e", guion],
                                cwd=RAIZ, capture_output=True, text=True, check=True)
    except FileNotFoundError:
        raise SystemExit("Hace falta Node para leer src/data/perfil.js")
    except subprocess.CalledProcessError as error:
        raise SystemExit("Node no pudo leer perfil.js:\n" + error.stderr)
    return json.loads(salida.stdout)


def linea_de_fecha(item):
    """«Agosto 2025 – [ACIC · Aire comprimido]», como en el PDF anterior.
       Cuando la fecha ya es un periodo trae su propio guion y no se repite."""
    if not item.get("contexto"):
        return item["fecha"]
    union = " " if "–" in item["fecha"] else " – "
    return "%s%s[%s]" % (item["fecha"], union, item["contexto"])


# ----------------------------------------------------------------- maquetar
class Maquetador:
    def __init__(self, doc):
        self.doc = doc
        self.y = ALTO_PRIMERA

    def bajar(self, salto, bloque=0.0):
        """Mueve la linea base. `bloque` es lo que todavia tiene que caber
           debajo: sirve para que una cabecera no se quede sola al pie."""
        siguiente = self.y + salto
        if siguiente + bloque > LIMITE:
            self.doc.nueva_pagina()
            self.y = ALTO_SIGUIENTE
        else:
            self.y = siguiente
        return self.y

    def parrafo(self, texto, x, alias, tam, color, ancho_max, sangria=0.0):
        """Reparte el texto en lineas y las va bajando. La primera linea usa
           la posicion actual; las siguientes van a interlinea."""
        palabras = texto.split()
        linea = ""
        primera = True
        for palabra in palabras:
            prueba = palabra if not linea else linea + " " + palabra
            margen = ancho_max - (0 if primera else sangria)
            if self.doc.ancho(prueba, alias, tam) <= margen or not linea:
                linea = prueba
                continue
            self.doc.texto(x if primera else x + sangria, self.y, linea, alias, tam, color)
            self.bajar(INTERLINEA)
            linea, primera = palabra, False
        if linea:
            self.doc.texto(x if primera else x + sangria, self.y, linea, alias, tam, color)

    def alto_parrafo(self, texto, alias, tam, ancho_max, sangria=0.0):
        """Cuantas lineas ocupa, sin dibujar. Se usa para decidir saltos."""
        palabras, linea, n = texto.split(), "", 1
        for palabra in palabras:
            prueba = palabra if not linea else linea + " " + palabra
            margen = ancho_max - (0 if n == 1 else sangria)
            if self.doc.ancho(prueba, alias, tam) <= margen or not linea:
                linea = prueba
            else:
                linea, n = palabra, n + 1
        return n


def encabezado(doc, perfil):
    """Nombre, rol, formacion y la fila de contacto con sus iconos."""
    nombre = perfil["nombre"].split()
    ligero, fuerte = nombre[0], " ".join(nombre[1:])

    ancho_ligero = doc.ancho(ligero + " ", "sans", NOMBRE)
    ancho_fuerte = doc.ancho(fuerte, "sans-negrita", NOMBRE)
    x = (ANCHO - (ancho_ligero + ancho_fuerte)) / 2
    doc.texto(x, ALTO_PRIMERA, ligero, "sans", NOMBRE, NEGRO)
    # El PDF anterior usaba Arial Black en el apellido; aqui el peso extra
    # sale de contornear la negrita, sin sumar otra tipografia al archivo.
    doc.texto(x + ancho_ligero, ALTO_PRIMERA, fuerte, "sans-negrita", NOMBRE,
              NEGRO, engrose=0.9)

    rol = perfil["rol"].upper()
    doc.texto((ANCHO - doc.ancho(rol, "sans", ROL)) / 2, 76.8, rol, "sans", ROL, CARMIN)

    estudios = perfil["formacion"].upper()
    doc.texto((ANCHO - doc.ancho(estudios, "sans-cursiva", SUBTITULO)) / 2, 90.7,
              estudios, "sans-cursiva", SUBTITULO, GRIS)

    # Fila de contacto: icono, texto espaciado y una pleca entre grupos.
    # El repositorio de GitHub cede su sitio a la pagina.
    grupos = [
        (ICONO_SOBRE, perfil["correo"], "mailto:" + perfil["correo"]),
        (ICONO_TELEFONO, perfil["telefono"],
         "tel:" + perfil["telefono"].replace(" ", "")),
        (icono_globo(), PAGINA_WEB, "https://%s/" % PAGINA_WEB),
    ]
    hueco_icono, hueco_pleca = 5.5, 9.0
    anchos = [doc.ancho(t, "sans", CONTACTO, ESPACIADO_CONTACTO) for _, t, _ in grupos]
    total = (sum(i["ancho"] + hueco_icono for i, _, _ in grupos) + sum(anchos)
             + (len(grupos) - 1) * (2 * hueco_pleca + 0.55))

    base = 108.4
    x = (ANCHO - total) / 2
    for i, ((icono, etiqueta, url), ancho_texto) in enumerate(zip(grupos, anchos)):
        if i:
            x += hueco_pleca
            doc.linea(x, base + 5.35, x, base - 8.75, 0.55, NEGRO)
            x += 0.55 + hueco_pleca
        doc.icono(icono, x, base + 3.5)
        x += icono["ancho"] + hueco_icono
        doc.texto(x, base, etiqueta, "sans", CONTACTO, CARMIN, ESPACIADO_CONTACTO)
        doc.enlace(x, base, ancho_texto, CONTACTO + 2, url)
        x += ancho_texto


def cabecera_seccion(maq, titulo, nota=None, bloque=0.0):
    doc = maq.doc
    maq.bajar(ANTES_SECCION, bloque=bloque + (11.5 if nota else 0) + TRAS_SECCION)
    doc.texto(MARGEN, maq.y, titulo.upper(), "sans", SECCION, NEGRO)
    if nota:
        maq.bajar(11.5)
        doc.texto(MARGEN, maq.y, nota, "sans-cursiva", META, GRIS)


def entrada(maq, item, primera):
    doc = maq.doc
    fecha = linea_de_fecha(item)
    # La cabecera de la entrada —titulo, fecha y la primera vineta— viaja
    # junta: partirla al pie de la hoja deja un titulo huerfano.
    maq.bajar(TRAS_SECCION if primera else ENTRE_ENTRADAS,
              bloque=TRAS_TITULO + TRAS_FECHA + INTERLINEA)

    doc.texto(MARGEN, maq.y, item["nombre"], "sans", TITULO, CARMIN)
    if item.get("estado"):
        x = MARGEN + doc.ancho(item["nombre"], "sans", TITULO) + 6
        doc.texto(x, maq.y, "(%s)" % item["estado"].upper(), "sans", ESTADO, GRIS)

    maq.bajar(TRAS_TITULO)
    maq.parrafo(fecha, MARGEN, "serif", CUERPO, NEGRO, DERECHA - MARGEN)

    for i, punto in enumerate(item["puntos"]):
        maq.bajar(TRAS_FECHA if i == 0 else SALTO_VINETA)
        doc.texto(X_VINETA, maq.y, "•", "serif", CUERPO, NEGRO)
        maq.parrafo(punto, X_TEXTO, "serif", CUERPO, NEGRO, DERECHA - X_TEXTO)

    if item.get("stack"):
        maq.bajar(TRAS_FICHAS)
        doc.texto(X_VINETA, maq.y, " · ".join(item["stack"]),
                  "sans", META, GRIS)


def habilidades(maq, grupos):
    """Rejilla de palomas, como la del PDF anterior: tres columnas de 180 pt
       y la marca en carmin a 18 pt del texto."""
    doc = maq.doc
    paloma = icono_paloma()
    columnas = [X_VINETA, X_VINETA + 180, X_VINETA + 360]
    filas = max(len(lista) for _, lista in grupos)
    cabecera_seccion(maq, "Habilidades", bloque=TRAS_SECCION + 14.5 + filas * ENTRE_FILAS)
    maq.bajar(TRAS_SECCION)
    cima = maq.y

    for i, (rotulo, lista) in enumerate(grupos):
        x = columnas[i]
        doc.texto(x, cima, rotulo.upper(), "sans", META, GRIS)
        for j, termino in enumerate(lista):
            y = cima + 14.5 + j * ENTRE_FILAS
            doc.icono(paloma, x, y - 0.5, CARMIN)
            doc.texto(x + 18, y, termino, "serif", CUERPO, NEGRO)
    maq.y = cima + 14.5 + (filas - 1) * ENTRE_FILAS


def bloque_con_fecha(maq, titulo, subtitulo, derecha_arriba, derecha_abajo, primero):
    """Las entradas de Formacion y Cursos: titulo en negrita, subtitulo en
       versales y, contra el margen derecho, lugar y fecha en cursiva."""
    doc = maq.doc
    maq.bajar(TRAS_SECCION if primero else 21.0, bloque=13.4)
    doc.texto(MARGEN, maq.y, titulo, "serif-negrita", CUERPO, NEGRO)
    if derecha_arriba:
        ancho = doc.ancho(derecha_arriba, "serif-cursiva", META)
        doc.texto(DERECHA - ancho, maq.y + 1.5, derecha_arriba,
                  "serif-cursiva", META, NEGRO)
    maq.bajar(13.4)
    doc.texto(MARGEN, maq.y, subtitulo.upper(), "serif", META, NEGRO)
    if derecha_abajo:
        ancho = doc.ancho(derecha_abajo, "serif-cursiva", FECHA_DERECHA)
        doc.texto(DERECHA - ancho, maq.y, derecha_abajo,
                  "serif-cursiva", FECHA_DERECHA, CARMIN)


def main():
    datos = datos_del_sitio()
    perfil = datos["PERFIL"]
    destino = (Path(sys.argv[1]) if len(sys.argv) > 1
               else PUBLICO / perfil["cvPdf"].lstrip("/"))

    doc = Documento(cargar_fuentes())
    maq = Maquetador(doc)

    encabezado(doc, perfil)

    maq.y = 150.95
    maq.parrafo(perfil["resumen"], MARGEN, "serif", CUERPO, NEGRO, DERECHA - MARGEN)

    # Experiencia: cada bloque del sitio es una seccion, con su nota debajo.
    for bloque in datos["BLOQUES"]:
        cabecera_seccion(maq, bloque["titulo"], bloque["nota"],
                         bloque=TRAS_SECCION + TRAS_TITULO + TRAS_FECHA)
        for i, item in enumerate(bloque["items"]):
            entrada(maq, item, primera=(i == 0))

    grupos = [("Técnicas", datos["HABILIDADES"]["tecnicas"]),
              ("Herramientas", datos["HABILIDADES"]["herramientas"])]
    grupos = [(r, l) for r, l in grupos if l]
    habilidades(maq, grupos)

    cabecera_seccion(maq, "Formación", bloque=TRAS_SECCION + 12.6)
    bloque_con_fecha(maq, perfil["escuela"], perfil["formacion"],
                     perfil["ubicacion"], perfil["periodo"], primero=True)

    cabecera_seccion(maq, "Cursos y certificados", bloque=TRAS_SECCION + 12.6)
    for i, curso in enumerate(datos["CURSOS"]):
        bloque_con_fecha(maq, curso["nombre"], curso["emisor"], None,
                         curso["fecha"], primero=(i == 0))

    cabecera_seccion(maq, "Idiomas", bloque=TRAS_SECCION)
    maq.bajar(TRAS_SECCION)
    idiomas = "   ·   ".join("%s — %s" % (i["idioma"], i["nivel"])
                                  for i in datos["IDIOMAS"])
    doc.texto(MARGEN, maq.y, idiomas, "serif", CUERPO, NEGRO)

    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_bytes(doc.bytes("%s · CV" % perfil["nombre"], perfil["nombre"]))
    print("%s · %d hojas · %.0f KB"
          % (destino, len(doc.paginas), destino.stat().st_size / 1024))


if __name__ == "__main__":
    main()
