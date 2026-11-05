import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { Icon } from '../shared/icon';
import { UiState } from '../shared/ui-state';

const LINKS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'portafolio', label: 'Portafolio' },
  { id: 'contacto', label: 'Contacto' },
];

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Principal">
      @for (link of links; track link.id) {
        <a
          routerLink="/"
          [fragment]="link.id"
          [class.active]="active() === link.id"
          [attr.aria-current]="active() === link.id ? 'true' : null"
          >{{ link.label }}</a
        >
      }
      <button
        type="button"
        class="sound"
        [attr.aria-pressed]="ui.soundOn()"
        [attr.aria-label]="ui.soundOn() ? 'Apagar sonido ambiente' : 'Encender sonido ambiente'"
        [title]="ui.soundOn() ? 'Apagar sonido ambiente' : 'Encender sonido ambiente'"
        (click)="ui.toggleSound()"
      >
        <app-icon [name]="ui.soundOn() ? 'soundOn' : 'soundOff'" [size]="16" />
      </button>
    </nav>
  `,
  styles: `
    :host {
      position: fixed;
      top: 18px;
      left: 0;
      right: 0;
      z-index: 50;
      display: flex;
      justify-content: center;
      padding: 0 12px;
      pointer-events: none;
    }
    nav {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 5px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: rgba(16, 8, 28, 0.72);
      backdrop-filter: blur(14px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }
    a {
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 0.86rem;
      font-weight: 500;
      color: var(--muted);
      white-space: nowrap;
      transition:
        color 0.2s,
        background 0.2s;
    }
    a:hover {
      color: var(--text);
    }
    a.active {
      color: var(--text);
      background: rgba(255, 255, 255, 0.11);
    }
    .sound {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      margin-left: 4px;
      border: 0;
      border-left: 1px solid var(--line);
      border-radius: 0 999px 999px 0;
      background: none;
      color: var(--muted);
      cursor: pointer;
    }
    .sound:hover,
    .sound[aria-pressed='true'] {
      color: var(--accent-2);
    }
    @media (max-width: 480px) {
      :host {
        top: 10px;
      }
      a {
        padding: 8px 10px;
        font-size: 0.78rem;
      }
      .sound {
        width: 30px;
        margin-left: 0;
      }
    }
  `,
})
export class Navbar implements OnInit, OnDestroy {
  protected readonly ui = inject(UiState);
  protected readonly links = LINKS;
  protected readonly active = signal('inicio');

  private readonly router = inject(Router);
  private sub?: Subscription;
  private pending = false;

  private readonly update = () => {
    if (this.pending) return;
    this.pending = true;
    requestAnimationFrame(() => {
      this.pending = false;
      this.syncActive();
    });
  };

  ngOnInit(): void {
    addEventListener('scroll', this.update, { passive: true });
    this.sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.update());
  }

  ngOnDestroy(): void {
    removeEventListener('scroll', this.update);
    this.sub?.unsubscribe();
  }

  private syncActive(): void {
    if (this.router.url.startsWith('/proyecto')) {
      this.active.set('portafolio');
      return;
    }
    const middle = innerHeight * 0.45;
    for (const { id } of LINKS) {
      const rect = document.getElementById(id)?.getBoundingClientRect();
      if (rect && rect.top <= middle && rect.bottom > middle) {
        this.active.set(id);
        return;
      }
    }
  }
}
