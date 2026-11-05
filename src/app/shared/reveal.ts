import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { Sparks } from './sparks';

/**
 * Muestra el elemento con una transición la primera vez que entra en pantalla.
 * En los títulos soldados (.weld-title), además lanza chispas a lo largo del cordón.
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class Reveal implements OnInit, OnDestroy {
  readonly delay = input(0, { alias: 'appReveal', transform: (v: number | string) => Number(v) || 0 });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly sparks = inject(Sparks);
  private observer?: IntersectionObserver;
  private timers: number[] = [];

  ngOnInit(): void {
    const node = this.el.nativeElement;
    node.style.setProperty('--reveal-delay', `${this.delay()}ms`);
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          node.classList.add('is-visible');
          this.observer?.disconnect();
          if (node.classList.contains('weld-title')) this.weld(node);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.timers.forEach(clearTimeout);
  }

  /** Acompaña con chispas el avance del cordón bajo el título (ver styles.scss). */
  private weld(node: HTMLElement): void {
    const steps = 7;
    for (let i = 0; i <= steps; i++) {
      this.timers.push(
        window.setTimeout(() => {
          const rect = node.getBoundingClientRect();
          this.sparks.burst(rect.left + (rect.width * i) / steps, rect.bottom + 2, 7, 0.75);
        }, 200 + i * 100),
      );
    }
  }
}
