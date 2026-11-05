import { Injectable, signal } from '@angular/core';

/** Estado global de la interfaz: pantalla de carga y sonido ambiente. */
@Injectable({ providedIn: 'root' })
export class UiState {
  readonly loaded = signal(false);
  readonly soundOn = signal(false);

  private ctx?: AudioContext;
  private master?: GainNode;

  toggleSound(): void {
    const next = !this.soundOn();
    this.soundOn.set(next);
    if (next && !this.ctx) this.createPad();
    if (!this.ctx || !this.master) return;
    if (next) void this.ctx.resume();
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(next ? 0.05 : 0, this.ctx.currentTime + 1.2);
  }

  /** Sonido ambiente generado con Web Audio: no necesita archivos de música. */
  private createPad(): void {
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 520;
    filter.connect(master).connect(ctx.destination);

    for (const [freq, detune] of [
      [110, -6],
      [164.81, 5],
      [220, 3],
      [329.63, -4],
    ]) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      osc.connect(filter);
      osc.start();
    }

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 240;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    this.ctx = ctx;
    this.master = master;
  }
}
