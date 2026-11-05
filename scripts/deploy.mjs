// Compila el sitio y publica el resultado en la rama gh-pages de GitHub.
import { execSync } from 'node:child_process';
import { copyFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO = 'https://github.com/junior-21-21/portafolio.git';
const OUT = join('dist', 'portafolio', 'browser');

const run = (command, cwd) => execSync(command, { cwd, stdio: 'inherit' });

run('npx ng build --base-href /portafolio/');

// GitHub Pages responde 404.html en rutas como /proyecto/...; así las resuelve Angular.
copyFileSync(join(OUT, 'index.html'), join(OUT, '404.html'));
writeFileSync(join(OUT, '.nojekyll'), '');

// La rama gh-pages solo guarda la última versión compilada.
rmSync(join(OUT, '.git'), { recursive: true, force: true });
run('git init -q -b gh-pages', OUT);
run('git add -A', OUT);
run('git commit -q -m "Publicar portafolio"', OUT);
run(`git push -f ${REPO} gh-pages`, OUT);
rmSync(join(OUT, '.git'), { recursive: true, force: true });

console.log('\nPublicado en https://junior-21-21.github.io/portafolio/');
