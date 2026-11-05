import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { PROFILE } from '../data/portfolio.data';
import { Sparks } from '../shared/sparks';
import { UiState } from '../shared/ui-state';
import { Weave } from '../shared/weave';

interface Point {
  x: number;
  y: number;
  px: number;
  py: number;
}

const SEGMENTS = 12;
const GRAVITY = 2100;
const STEP = 1 / 120;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Credencial colgante: la cinta es una cuerda con física de Verlet y la tarjeta
 * se comporta como un péndulo. Se puede arrastrar, lanzar y voltear con un clic.
 * Escribe directamente en el DOM en cada cuadro para no disparar change detection.
 */
@Component({
  selector: 'app-badge',
  imports: [Weave],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge implements AfterViewInit, OnDestroy {
  protected readonly profile = PROFILE;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly card = viewChild.required<ElementRef<HTMLElement>>('card');
  private readonly ribbon = viewChild.required<ElementRef<SVGPathElement>>('ribbon');
  private readonly ribbonEdge = viewChild.required<ElementRef<SVGPathElement>>('ribbonEdge');
  private readonly ui = inject(UiState);
  private readonly sparks = inject(Sparks);
  private lastSpark = 0;

  private points: Point[] = [];
  private segment = 20;
  private anchorX = 0;
  private anchorY = -30;
  private cardW = 270;

  private theta = 0;
  private thetaV = 0;
  private spin = 0;
  private spinV = 0;
  private restSpin = 0;
  private prevVx = 0;
  private tilt = 0;

  private dragging = false;
  private moved = 0;
  private targetX = 0;
  private targetY = 0;
  private grabX = 0;
  private grabY = 0;

  private raf = 0;
  private last = 0;
  private acc = 0;
  private time = 0;
  private running = false;
  private started = false;
  private visible = true;
  private io?: IntersectionObserver;
  private ro?: ResizeObserver;
  private readonly reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    effect(() => {
      if (this.ui.loaded() && this.points.length && !this.started) this.start();
    });
  }

  ngAfterViewInit(): void {
    this.layout(true);
    this.render();
    this.ro = new ResizeObserver(() => this.layout(false));
    this.ro.observe(this.host);
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      this.sync();
    });
    this.io.observe(this.host);
    if (this.ui.loaded()) this.start();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    this.io?.disconnect();
  }

  private start(): void {
    this.started = true;
    if (this.reduced) {
      for (let i = 0; i < 1500; i++) this.step(STEP);
      this.render();
    }
    this.sync();
  }

  private sync(): void {
    const shouldRun = this.started && this.visible && !document.hidden;
    if (shouldRun && !this.running) {
      this.running = true;
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    } else if (!shouldRun && this.running) {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }
  }

  /** Coloca el anclaje y dimensiona la cuerda según el tamaño del escenario. */
  private layout(initial: boolean): void {
    const { clientWidth: w, clientHeight: h } = this.host;
    const cardEl = this.card().nativeElement;
    this.cardW = cardEl.offsetWidth;
    const cardH = cardEl.offsetHeight;
    this.anchorX = w * 0.54;
    const rope = clamp(h - cardH - 90, 110, 300);
    this.segment = rope / SEGMENTS;

    if (initial) {
      // Arranca enrollada junto al anclaje: al terminar la carga, la tarjeta cae.
      this.points = Array.from({ length: SEGMENTS + 1 }, (_, i) => {
        const x = this.anchorX + i * 2;
        const y = this.anchorY + i * 2;
        return { x, y, px: x, py: y };
      });
    }
  }

  private readonly frame = (now: number) => {
    if (!this.running) return;
    // Tolera cuadros lentos sin que la física vaya en cámara lenta.
    this.acc += Math.min((now - this.last) / 1000, 0.25);
    this.last = now;
    while (this.acc >= STEP) {
      this.step(STEP);
      this.acc -= STEP;
    }
    this.render();
    this.raf = requestAnimationFrame(this.frame);
  };

  private step(dt: number): void {
    this.time += dt;
    const p = this.points;
    const n = p.length - 1;
    const wind = this.reduced ? 0 : Math.sin(this.time * 0.9) * 13 + Math.sin(this.time * 2.3) * 4;

    for (let i = 1; i <= n; i++) {
      const pt = p[i];
      const vx = (pt.x - pt.px) * 0.992;
      const vy = (pt.y - pt.py) * 0.992;
      pt.px = pt.x;
      pt.py = pt.y;
      pt.x += vx + wind * dt * dt * (i / n) * 8;
      pt.y += vy + GRAVITY * dt * dt;
    }

    if (this.dragging) {
      // La tarjeta no puede alejarse más que el largo de la cinta (un poco elástica).
      const maxLen = this.segment * n * 1.12;
      const dx = this.targetX - this.anchorX;
      const dy = this.targetY - this.anchorY;
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, maxLen / dist);
      p[n].x = this.anchorX + dx * k;
      p[n].y = this.anchorY + dy * k;
    }

    p[0].x = p[0].px = this.anchorX;
    p[0].y = p[0].py = this.anchorY;

    for (let it = 0; it < 14; it++) {
      for (let i = 0; i < n; i++) {
        const a = p[i];
        const b = p[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const diff = (d - this.segment) / d;
        const aFixed = i === 0;
        const bFixed = this.dragging && i + 1 === n;
        const wa = aFixed ? 0 : bFixed ? 1 : 0.5;
        const wb = bFixed ? 0 : aFixed ? 1 : 0.5;
        a.x += dx * diff * wa;
        a.y += dy * diff * wa;
        b.x -= dx * diff * wb;
        b.y -= dy * diff * wb;
      }
    }

    // Péndulo de la tarjeta: sigue la cinta y se retrasa al acelerar.
    const end = p[n];
    const prev = p[n - 1];
    const follow = -Math.atan2(end.x - prev.x, end.y - prev.y) * 0.55;
    const vx = (end.x - end.px) / dt;
    const vy = (end.y - end.py) / dt;
    const ax = (vx - this.prevVx) / dt;
    this.prevVx = vx;
    this.thetaV +=
      (clamp(ax * 0.0007, -40, 40) - 22 * Math.sin(this.theta - follow) - 3.2 * this.thetaV) * dt;
    this.theta = clamp(this.theta + this.thetaV * dt, -1.1, 1.1);

    // Giro en Y: resorte hacia la cara en reposo, con inclinación según la velocidad.
    this.spinV += ((this.restSpin - this.spin) * 34 - this.spinV * 6.5) * dt;
    this.spin += this.spinV * dt;
    this.tilt += (clamp(-vy * 0.012, -14, 14) - this.tilt) * Math.min(1, dt * 8);
  }

  private render(): void {
    const p = this.points;
    const end = p[p.length - 1];
    const yaw = this.spin + clamp((end.x - end.px) * 120 * 0.022, -28, 28);
    this.card().nativeElement.style.transform =
      `translate3d(${end.x - this.cardW / 2}px, ${end.y - 6}px, 0) ` +
      `perspective(1100px) rotateZ(${this.theta}rad) rotateX(${this.tilt}deg) rotateY(${yaw}deg)`;

    let d = `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
    for (let i = 1; i < p.length - 1; i++) {
      const mx = (p[i].x + p[i + 1].x) / 2;
      const my = (p[i].y + p[i + 1].y) / 2;
      d += ` Q${p[i].x.toFixed(1)} ${p[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }
    d += ` L${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
    this.ribbon().nativeElement.setAttribute('d', d);
    this.ribbonEdge().nativeElement.setAttribute('d', d);
  }

  private pointer(e: PointerEvent): { x: number; y: number } {
    const rect = this.host.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  protected onDown(e: PointerEvent): void {
    if (e.button !== 0) return;
    const { x, y } = this.pointer(e);
    const end = this.points[this.points.length - 1];
    this.grabX = x - end.x;
    this.grabY = y - end.y;
    this.targetX = end.x;
    this.targetY = end.y;
    this.moved = 0;
    this.dragging = true;
    this.card().nativeElement.setPointerCapture(e.pointerId);
    this.card().nativeElement.classList.add('grabbing');
  }

  protected onMove(e: PointerEvent): void {
    if (!this.dragging) return;
    const { x, y } = this.pointer(e);
    const nx = x - this.grabX;
    const ny = y - this.grabY;
    const delta = Math.hypot(nx - this.targetX, ny - this.targetY);
    this.moved += delta;
    // Mover la credencial con fuerza saca chispas del gancho metálico.
    const now = performance.now();
    if (delta > 7 && now - this.lastSpark > 60) {
      this.lastSpark = now;
      const end = this.points[this.points.length - 1];
      const rect = this.host.getBoundingClientRect();
      this.sparks.burst(rect.left + end.x, rect.top + end.y, 9, 0.9);
    }
    this.targetX = nx;
    this.targetY = ny;
  }

  protected onUp(): void {
    if (!this.dragging) return;
    this.dragging = false;
    this.card().nativeElement.classList.remove('grabbing');
    const end = this.points[this.points.length - 1];
    if (this.moved < 6) {
      this.flip();
      return;
    }
    // Un lanzamiento fuerte hace que la tarjeta dé la vuelta.
    const throwV = (end.x - end.px) * 120;
    if (Math.abs(throwV) > 1400) {
      this.spinV += clamp(throwV * 0.5, -1100, 1100);
      this.restSpin = Math.round((this.spin + this.spinV * 0.22) / 180) * 180;
    }
  }

  /** El navegador tomó el gesto para hacer scroll: se suelta sin voltear. */
  protected onCancel(): void {
    this.dragging = false;
    this.card().nativeElement.classList.remove('grabbing');
  }

  protected flip(): void {
    const end = this.points[this.points.length - 1];
    const rect = this.host.getBoundingClientRect();
    this.sparks.burst(rect.left + end.x, rect.top + end.y, 16);
    this.restSpin += 180;
    this.spinV += 120;
    if (this.reduced) {
      this.spin = this.restSpin;
      this.spinV = 0;
      this.render();
    }
  }
}
