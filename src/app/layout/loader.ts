import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { UiState } from '../shared/ui-state';
import { Weave } from '../shared/weave';

/** Pantalla de carga: tu nombre se va tejiendo mientras cargan las fuentes y la foto. */
@Component({
  selector: 'app-loader',
  imports: [Weave],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!gone()) {
      <div class="loader" [class.out]="ui.loaded()" role="status" aria-label="Cargando portafolio">
        <div class="loom">
          <app-weave text="CRISTHIAN" [tiles]="9" [style.clip-path]="'inset(0 ' + (100 - percent()) + '% 0 0)'" />
        </div>
        <p class="count">{{ percent() }}<span>%</span></p>
        <p class="note">Tejiendo portafolio…</p>
      </div>
    }
  `,
  styles: `
    .loader {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: grid;
      place-content: center;
      justify-items: center;
      gap: 16px;
      padding: 16px;
      background: var(--bg);
      transition:
        opacity 0.55s ease,
        visibility 0.55s;
    }
    .loader.out {
      opacity: 0;
      visibility: hidden;
    }
    .loom {
      width: min(640px, 86vw);
      border-block: 1px solid var(--line);
    }
    .count {
      margin: 0;
      font-family: var(--display);
      font-size: clamp(3rem, 9vw, 5rem);
      font-weight: 800;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .count span {
      font-size: 0.45em;
      color: var(--accent-2);
      margin-left: 4px;
    }
    .note {
      margin: 0;
      font-size: 0.8rem;
      color: var(--muted);
    }
  `,
})
export class Loader implements OnInit, OnDestroy {
  protected readonly ui = inject(UiState);
  protected readonly percent = signal(0);
  protected readonly gone = signal(false);
  private raf = 0;
  private timer = 0;

  ngOnInit(): void {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 150 : 1700;
    let ready = false;
    const photo = new Image();
    photo.src = 'img/cristhian-recorte.webp';
    const fallback = new Promise((r) => setTimeout(r, 4000));
    void Promise.race([
      Promise.all([document.fonts.ready, photo.decode().catch(() => undefined)]),
      fallback,
    ]).then(() => (ready = true));

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      // Se detiene en 92 % hasta que los recursos estén realmente listos.
      this.percent.set(Math.round((ready ? eased : Math.min(eased, 0.92)) * 100));
      if (t >= 1 && ready) {
        this.ui.loaded.set(true);
        this.timer = window.setTimeout(() => this.gone.set(true), 650);
        return;
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.timer);
  }
}
