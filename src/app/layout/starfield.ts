import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  viewChild,
} from '@angular/core';

interface Star {
  x: number;
  y: number;
  r: number;
  depth: number;
  phase: number;
  speed: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

/** Fondo fijo: estrellas con parpadeo, paralaje con el scroll y estrellas fugaces. */
@Component({
  selector: 'app-starfield',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="nebula"></div><canvas #canvas aria-hidden="true"></canvas>`,
  styles: `
    :host,
    canvas,
    .nebula {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
    .nebula {
      background:
        radial-gradient(45vw 70vh at 88% 16%, rgba(217, 24, 79, 0.24), transparent 70%),
        radial-gradient(42vw 60vh at 2% 72%, rgba(74, 35, 140, 0.34), transparent 70%),
        radial-gradient(34vw 40vh at 62% 110%, rgba(255, 138, 47, 0.1), transparent 70%),
        var(--bg);
    }
  `,
})
export class Starfield implements AfterViewInit, OnDestroy {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private ctx!: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private meteors: Meteor[] = [];
  private raf = 0;
  private w = 0;
  private h = 0;
  private nextMeteor = 1500;
  private last = 0;
  private readonly reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  private readonly onResize = () => {
    this.resize();
    if (this.reduced) this.draw(0, 0);
  };

  private readonly onVisibility = () => {
    cancelAnimationFrame(this.raf);
    if (!document.hidden && !this.reduced) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
  };

  ngAfterViewInit(): void {
    this.ctx = this.canvas().nativeElement.getContext('2d')!;
    this.resize();
    addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    if (this.reduced) {
      this.draw(0, 0);
    } else {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private resize(): void {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const el = this.canvas().nativeElement;
    this.w = innerWidth;
    this.h = innerHeight;
    el.width = this.w * dpr;
    el.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(220, (this.w * this.h) / 7000));
    this.stars = Array.from({ length: count }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      r: Math.random() ** 2 * 1.3 + 0.3,
      depth: Math.random() * 0.14 + 0.02,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 1.4 + 0.3,
    }));
  }

  private readonly tick = (now: number) => {
    const dt = Math.min(now - this.last, 50);
    this.last = now;
    this.nextMeteor -= dt;
    if (this.nextMeteor <= 0) {
      this.spawnMeteor();
      this.nextMeteor = 2500 + Math.random() * 5000;
    }
    this.draw(now, dt);
    this.raf = requestAnimationFrame(this.tick);
  };

  private spawnMeteor(): void {
    const speed = 0.7 + Math.random() * 0.5;
    this.meteors.push({
      x: Math.random() * this.w * 0.8 + this.w * 0.2,
      y: Math.random() * this.h * 0.5,
      vx: -speed,
      vy: speed * 0.62,
      life: 0,
      max: 700 + Math.random() * 500,
    });
  }

  private draw(now: number, dt: number): void {
    const { ctx, w, h } = this;
    const scroll = scrollY;
    ctx.clearRect(0, 0, w, h);

    for (const s of this.stars) {
      const y = (((s.y - scroll * s.depth) % h) + h) % h;
      const twinkle = this.reduced ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(now * 0.001 * s.speed + s.phase));
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = '#fff2e0';
      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const m of this.meteors) {
      m.life += dt;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      const t = m.life / m.max;
      const alpha = Math.sin(Math.min(t, 1) * Math.PI);
      const tailX = m.x - m.vx * 170;
      const tailY = m.y - m.vy * 170;
      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, 'rgba(255,242,224,0.9)');
      grad.addColorStop(1, 'rgba(255,120,60,0)');
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
    }
    this.meteors = this.meteors.filter((m) => m.life < m.max);
    ctx.globalAlpha = 1;
  }
}
