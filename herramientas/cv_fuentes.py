# -*- coding: utf-8 -*-
"""Lectura e incrustacion de tipografias TrueType, sin dependencias.

   Solo hace falta lo que un PDF necesita para componer texto: los anchos de
   cada caracter y un subconjunto de la fuente con los glifos que de verdad se
   usan. El subconjunto conserva la numeracion de glifos original y vacia los
   que no se usan; asi `cmap`, `hmtx` y `maxp` se copian tal cual y solo hay
   que reescribir `glyf` y `loca`."""

import struct

# Las tablas que se copian al subconjunto. Fuera quedan GSUB, GPOS, DSIG y
# demas: pesan y un PDF no las mira.
TABLAS_UTILES = ("cmap", "cvt ", "fpgm", "head", "hhea", "hmtx",
                 "maxp", "name", "OS/2", "post", "prep")


class Fuente:
    def __init__(self, ruta):
        self.ruta = str(ruta)
        self.datos = open(ruta, "rb").read()
        d = self.datos
        n = struct.unpack(">H", d[4:6])[0]
        self.tablas = {}
        for i in range(n):
            p = 12 + 16 * i
            etiqueta = d[p:p + 4].decode("latin-1")
            inicio, largo = struct.unpack(">II", d[p + 8:p + 16])
            self.tablas[etiqueta] = (inicio, largo)

        cab = self.tablas["head"][0]
        self.upm = struct.unpack(">H", d[cab + 18:cab + 20])[0]
        caja = struct.unpack(">hhhh", d[cab + 36:cab + 44])
        self.caja = [self._mil(v) for v in caja]
        self.formato_loca = struct.unpack(">h", d[cab + 50:cab + 52])[0]

        hhea = self.tablas["hhea"][0]
        self.ascenso = self._mil(struct.unpack(">h", d[hhea + 4:hhea + 6])[0])
        self.descenso = self._mil(struct.unpack(">h", d[hhea + 6:hhea + 8])[0])
        self.n_metricas = struct.unpack(">H", d[hhea + 34:hhea + 36])[0]

        maxp = self.tablas["maxp"][0]
        self.n_glifos = struct.unpack(">H", d[maxp + 4:maxp + 6])[0]

        self.inclinacion = 0.0
        if "post" in self.tablas:
            post = self.tablas["post"][0]
            ent, frac = struct.unpack(">hH", d[post + 4:post + 8])
            self.inclinacion = ent + frac / 65536.0

        self.altura_mayusculas = round(0.7 * 1000)
        self.peso = 400
        if "OS/2" in self.tablas:
            os2, largo = self.tablas["OS/2"]
            self.peso = struct.unpack(">H", d[os2 + 4:os2 + 6])[0]
            version = struct.unpack(">H", d[os2:os2 + 2])[0]
            if version >= 2 and largo >= 90:
                alt = struct.unpack(">h", d[os2 + 88:os2 + 90])[0]
                if alt:
                    self.altura_mayusculas = self._mil(alt)

        self.glifo_de = self._leer_cmap()
        self.avances = self._leer_hmtx()
        self.usados = {0}          # el glifo .notdef siempre viaja

    # ------------------------------------------------------------ lectura
    def _mil(self, v):
        return round(v * 1000.0 / self.upm)

    def _leer_hmtx(self):
        d, inicio = self.datos, self.tablas["hmtx"][0]
        avances = []
        for i in range(self.n_metricas):
            avances.append(struct.unpack(">H", d[inicio + 4 * i:inicio + 4 * i + 2])[0])
        return avances

    def _leer_cmap(self):
        d, base = self.datos, self.tablas["cmap"][0]
        n = struct.unpack(">H", d[base + 2:base + 4])[0]
        elegida = None
        for i in range(n):
            pid, eid, off = struct.unpack(">HHI", d[base + 4 + 8 * i:base + 12 + 8 * i])
            if (pid, eid) in ((3, 1), (0, 3), (0, 4), (0, 6), (3, 10)):
                elegida = base + off
                if (pid, eid) == (3, 1):
                    break
        if elegida is None:
            raise ValueError("cmap Unicode ausente en " + self.ruta)

        formato = struct.unpack(">H", d[elegida:elegida + 2])[0]
        mapa = {}
        if formato == 4:
            seg2 = struct.unpack(">H", d[elegida + 6:elegida + 8])[0]
            seg = seg2 // 2
            fin = elegida + 14
            ini = fin + seg2 + 2
            delta = ini + seg2
            rango = delta + seg2
            for i in range(seg):
                c_fin = struct.unpack(">H", d[fin + 2 * i:fin + 2 * i + 2])[0]
                c_ini = struct.unpack(">H", d[ini + 2 * i:ini + 2 * i + 2])[0]
                dl = struct.unpack(">h", d[delta + 2 * i:delta + 2 * i + 2])[0]
                ro = struct.unpack(">H", d[rango + 2 * i:rango + 2 * i + 2])[0]
                if c_ini == 0xFFFF:
                    continue
                for c in range(c_ini, c_fin + 1):
                    if ro == 0:
                        g = (c + dl) & 0xFFFF
                    else:
                        p = rango + 2 * i + ro + 2 * (c - c_ini)
                        g = struct.unpack(">H", d[p:p + 2])[0]
                        if g:
                            g = (g + dl) & 0xFFFF
                    if g:
                        mapa[c] = g
        elif formato == 12:
            grupos = struct.unpack(">I", d[elegida + 12:elegida + 16])[0]
            for i in range(grupos):
                p = elegida + 16 + 12 * i
                ini_c, fin_c, ini_g = struct.unpack(">III", d[p:p + 12])
                for c in range(ini_c, min(fin_c, 0x2FFFF) + 1):
                    mapa[c] = ini_g + (c - ini_c)
        else:
            raise ValueError("formato de cmap no soportado: %d" % formato)
        return mapa

    # ------------------------------------------------------------ metrica
    def avance(self, codigo):
        """Ancho del caracter en milesimas de em."""
        g = self.glifo_de.get(codigo)
        if not g:
            return 0
        i = g if g < self.n_metricas else self.n_metricas - 1
        return self._mil(self.avances[i])

    def ancho(self, texto, tam, espaciado=0.0):
        total = sum(self.avance(ord(c)) for c in texto) * tam / 1000.0
        return total + espaciado * len(texto)

    def anotar(self, texto):
        """Apunta los glifos que hay que conservar en el subconjunto."""
        for c in texto:
            g = self.glifo_de.get(ord(c))
            if g:
                self.usados.add(g)

    # -------------------------------------------------------- subconjunto
    def _rango_loca(self):
        inicio, _ = self.tablas["loca"]
        d = self.datos
        desplazamientos = []
        for i in range(self.n_glifos + 1):
            if self.formato_loca == 0:
                v = struct.unpack(">H", d[inicio + 2 * i:inicio + 2 * i + 2])[0] * 2
            else:
                v = struct.unpack(">I", d[inicio + 4 * i:inicio + 4 * i + 4])[0]
            desplazamientos.append(v)
        return desplazamientos

    def _componentes(self, datos_glifo):
        """Glifos a los que apunta un glifo compuesto, como las vocales con
           tilde, que son la letra mas el acento."""
        if len(datos_glifo) < 10:
            return []
        contornos = struct.unpack(">h", datos_glifo[0:2])[0]
        if contornos >= 0:
            return []
        hijos, p = [], 10
        while True:
            banderas, indice = struct.unpack(">HH", datos_glifo[p:p + 4])
            hijos.append(indice)
            p += 4
            p += 4 if banderas & 0x0001 else 2
            if banderas & 0x0008:
                p += 2
            elif banderas & 0x0040:
                p += 4
            elif banderas & 0x0080:
                p += 8
            if not banderas & 0x0020:
                break
        return hijos

    def subconjunto(self):
        """Devuelve la fuente recortada a los glifos anotados."""
        d = self.datos
        loca = self._rango_loca()
        glyf_ini = self.tablas["glyf"][0]

        pendientes = list(self.usados)
        while pendientes:
            g = pendientes.pop()
            if g + 1 >= len(loca):
                continue
            trozo = d[glyf_ini + loca[g]:glyf_ini + loca[g + 1]]
            for hijo in self._componentes(trozo):
                if hijo not in self.usados:
                    self.usados.add(hijo)
                    pendientes.append(hijo)

        nuevo_glyf = bytearray()
        nuevo_loca = bytearray()
        for g in range(self.n_glifos):
            nuevo_loca += struct.pack(">I", len(nuevo_glyf))
            if g in self.usados:
                trozo = d[glyf_ini + loca[g]:glyf_ini + loca[g + 1]]
                nuevo_glyf += trozo
                while len(nuevo_glyf) % 4:
                    nuevo_glyf += b"\0"
        nuevo_loca += struct.pack(">I", len(nuevo_glyf))

        tablas = {}
        for etiqueta in TABLAS_UTILES:
            if etiqueta in self.tablas:
                inicio, largo = self.tablas[etiqueta]
                tablas[etiqueta] = bytearray(d[inicio:inicio + largo])
        # `loca` pasa a formato largo, que evita el limite de 128 KB y el
        # requisito de desplazamientos pares.
        tablas["head"][50:52] = struct.pack(">h", 1)
        tablas["head"][8:12] = b"\0\0\0\0"        # checkSumAdjustment
        # `post` en version 3 tira la lista de nombres de glifo: son 26 KB
        # que ningun visor necesita para dibujar texto.
        if "post" in tablas:
            cabecera_post = tablas["post"][:32]
            cabecera_post[0:4] = struct.pack(">I", 0x00030000)
            tablas["post"] = cabecera_post
        tablas["loca"] = nuevo_loca
        tablas["glyf"] = nuevo_glyf
        return self._empaquetar(tablas)

    @staticmethod
    def _suma(bloque):
        relleno = bloque + b"\0" * (-len(bloque) % 4)
        total = 0
        for i in range(0, len(relleno), 4):
            total = (total + struct.unpack(">I", relleno[i:i + 4])[0]) & 0xFFFFFFFF
        return total

    @staticmethod
    def _empaquetar(tablas):
        etiquetas = sorted(tablas)
        n = len(etiquetas)
        potencia = 1
        while potencia * 2 <= n:
            potencia *= 2
        cabecera = struct.pack(">IHHHH", 0x00010000, n, potencia * 16,
                               potencia.bit_length() - 1, (n - potencia) * 16)
        directorio = bytearray()
        cuerpo = bytearray()
        desplazamiento = 12 + 16 * n
        for etiqueta in etiquetas:
            bloque = bytes(tablas[etiqueta])
            directorio += (etiqueta.encode("latin-1")
                           + struct.pack(">III", Fuente._suma(bloque),
                                         desplazamiento + len(cuerpo), len(bloque)))
            cuerpo += bloque + b"\0" * (-len(bloque) % 4)
        return bytes(cabecera + directorio + cuerpo)
