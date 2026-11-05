import { Routes } from '@angular/router';

const TITLE = 'Cristhian Quicaño | Desarrollador Full Stack';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: TITLE,
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'proyecto/:slug',
    loadComponent: () => import('./project/project-detail').then((m) => m.ProjectDetail),
  },
  { path: '**', redirectTo: '' },
];
