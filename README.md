# Portafolio de Cristhian Quicaño

Portafolio personal hecho con Angular 22.

## Ejecutar en local

```bash
npm install
npm start
```

Se abre en http://localhost:4200.

## Editar el contenido

Todos los textos, proyectos, certificados, tecnologías y enlaces están en
`src/app/data/portfolio.data.ts`. Para que aparezca LinkedIn, pega tu URL en `PROFILE.linkedin`.

Las imágenes y el CV están en `public/`.

## Publicar

El sitio está en https://junior-21-21.github.io/portafolio/. Para publicar los cambios:

```bash
npm run deploy
```

El comando compila el proyecto y sube el resultado a la rama `gh-pages`. No olvides subir también
el código a `main` con `git push`.
