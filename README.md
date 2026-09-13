# aztemik.github.io

Mi CV y portafolio: https://aztemik.github.io

React + Vite, sin librerías de interfaz.

## Uso

```bash
npm install
npm run dev      # desarrollo
npm run build    # compila a dist/
npm run pages    # sirve dist/ como GitHub Pages, en :4180
```

Uso `npm run pages` y no `vite preview` porque preview responde 200 a cualquier
ruta y no sirve para probar el enrutado.

## Despliegue

Cada push a `main` dispara `.github/workflows/desplegar.yml`.

## Dónde está qué

- `src/data/perfil.js` — el contenido del sitio
- `src/views/` — CV, Portafolio y página de proyecto
- `src/temas.js` — colores, tipografías y tamaños de cada vista
