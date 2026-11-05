import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../data/portfolio.data';
import { Icon } from '../shared/icon';
import { Weave } from '../shared/weave';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon, Weave],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer>
      <div class="wrap signature">
        <app-weave text="CRISTHIAN" [tiles]="9" />
        <p>Este tejido es mi nombre. Cada rombo es una letra y cada anillo, un bit de su código: con color es 1, oscuro es 0.</p>
      </div>
      <div class="wrap grid">
        <div>
          <p class="brand"><span aria-hidden="true">&lt;/&gt;</span> {{ profile.shortName }}</p>
          <p class="muted">{{ profile.role }} · {{ profile.location }}</p>
        </div>
        <div>
          <h2>Navegación</h2>
          <a routerLink="/" fragment="inicio">Inicio</a>
          <a routerLink="/" fragment="sobre-mi">Sobre mí</a>
          <a routerLink="/" fragment="portafolio">Portafolio</a>
          <a routerLink="/" fragment="contacto">Contacto</a>
        </div>
        <div>
          <h2>Conecta</h2>
          <div class="social">
            <a [href]="profile.github" target="_blank" rel="noopener" aria-label="GitHub"><app-icon name="github" /></a>
            <a [href]="'mailto:' + profile.email" aria-label="Correo"><app-icon name="mail" /></a>
            @if (profile.linkedin) {
              <a [href]="profile.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn"><app-icon name="linkedin" /></a>
            }
          </div>
        </div>
      </div>
      <p class="wrap copy">© {{ year }} {{ profile.fullName }}</p>
    </footer>
  `,
  styles: `
    footer {
      margin-top: 80px;
      padding: 48px 0 28px;
      border-top: 1px solid var(--line);
      background: rgba(11, 6, 20, 0.6);
    }
    .signature {
      margin-bottom: 44px;
    }
    .signature app-weave {
      border-radius: 8px;
    }
    .signature p {
      margin: 12px 0 0;
      font-size: 0.85rem;
      color: var(--muted);
    }
    .grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 32px;
    }
    .brand {
      margin: 0 0 8px;
      font-weight: 700;
    }
    .brand span {
      color: var(--accent-2);
      font-family: var(--mono);
    }
    .muted {
      margin: 0;
      color: var(--muted);
      font-size: 0.9rem;
    }
    h2 {
      margin: 0 0 12px;
      font-size: 0.72rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--muted);
    }
    a {
      display: block;
      padding: 3px 0;
      font-size: 0.9rem;
      color: var(--text);
    }
    a:hover {
      color: var(--accent-2);
    }
    .social {
      display: flex;
      gap: 12px;
    }
    .copy {
      margin-top: 36px;
      font-size: 0.78rem;
      color: var(--muted);
    }
    @media (max-width: 640px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
      .grid > :first-child {
        grid-column: 1 / -1;
      }
    }
  `,
})
export class Footer {
  protected readonly profile = PROFILE;
  protected readonly year = new Date().getFullYear();
}
