"""Servidor local que imita la semántica de GitHub Pages sobre dist/.

Existe porque `vite preview` NO sirve para probar este despliegue: hace
reescritura de SPA y devuelve 200 para cualquier ruta, justo lo que Pages no
hace. Con eso, un fallo de enrutado solo aparecería ya en producción.

Uso: npm run pages, y abrir http://127.0.0.1:4180

Semántica reproducida:

  - /ruta/        -> dist/ruta/index.html, 200
  - /ruta         -> 301 a /ruta/ si existe ese directorio
  - desconocido   -> dist/404.html con estado 404
  - /__lento      -> duerme, para retrasar el evento load y poder capturar
                    la página ya asentada en vez de a mitad de animación
"""
import os, time, http.server

RAIZ = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")
GIF = bytes.fromhex("47494638396101000100800000000000ffffff21f90401000000002c00000000010001000002024401003b")

class Pages(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=RAIZ, **k)

    def log_message(self, *a):
        pass

    def do_GET(self):
        ruta = self.path.split("?")[0]

        if ruta == "/__lento":
            time.sleep(1.8)
            self.send_response(200)
            self.send_header("Content-Type", "image/gif")
            self.send_header("Content-Length", str(len(GIF)))
            self.end_headers()
            self.wfile.write(GIF)
            return

        local = os.path.join(RAIZ, ruta.lstrip("/"))
        if ruta.endswith("/"):
            local = os.path.join(local, "index.html")

        if os.path.isdir(local):
            self.send_response(301)
            self.send_header("Location", ruta + "/")
            self.end_headers()
            return

        if os.path.isfile(local):
            return super().do_GET()

        cuerpo = open(os.path.join(RAIZ, "404.html"), "rb").read()
        self.send_response(404)
        self.send_header("Content-Type", "text/html")
        self.send_header("Content-Length", str(len(cuerpo)))
        self.end_headers()
        self.wfile.write(cuerpo)

http.server.ThreadingHTTPServer(("127.0.0.1", 4180), Pages).serve_forever()
