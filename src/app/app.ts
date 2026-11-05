import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer';
import { Loader } from './layout/loader';
import { Navbar } from './layout/navbar';
import { Starfield } from './layout/starfield';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Starfield, Loader, Navbar, Footer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-loader />
    <app-starfield />
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class App {}
