import { Injectable } from '@angular/core';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

const GRAVITY = 1100;
const MAX_SPARKS = 320;

/**
 * Chispas de soldadura sobre toda la página, en coordenadas de la ventana.
 * El lienzo solo se anima mientras hay chispas vivas.
 */
@Injectable({ providedIn: 'root' })
export class Sparks {
  private readonly reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private list: Spark[] = [];
  private raf = 0;
  private last = 0;

  burst(x: number, y: number, count = 14, power = 1): void {
    if (this.reduced || document.hidden) return;
    for (let i = 0; i < count && this.list.length < MAX_SPARKS; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
      const speed = (120 + Math.random() * 420) * power;
      const max = 0.3 + Math.random() * 0.6;
      this.list.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0, max });
    }
    if (!this.raf) this.start();
  }

  private start(): void {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.setAttribute('aria-hidden', 'true');
      this.canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:45;pointer-events:none';
      document.body.append(this.canvas);
      this.ctx = this.canvas.getContext('2d') ?? undefined;
    }
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(innerWidth * dpr);
    const h = Math.round(innerHeight * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private readonly tick = (now: number) => {
    const ctx = this.ctx;
    if (!ctx) return;
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';

    for (const s of this.list) {
      s.life += dt;
      s.vy += GRAVITY * dt;
      s.vx *= 0.985;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const t = s.life / s.max;
      // Se enfría: blanco, ámbar, rojo.
      ctx.strokeStyle = t < 0.25 ? '#fff4cf' : t < 0.65 ? '#ffb020' : '#e2452a';
      ctx.globalAlpha = Math.max(0, 1 - t * t);
      ctx.lineWidth = t < 0.25 ? 1.8 : 1.2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 0.022, s.y - s.vy * 0.022);
      ctx.stroke();
    }

    this.list = this.list.filter((s) => s.life < s.max);
    if (this.list.length) {
      this.raf = requestAnimationFrame(this.tick);
    } else {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      this.raf = 0;
    }
  };
}
