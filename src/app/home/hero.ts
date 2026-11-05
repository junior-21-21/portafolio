import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../data/portfolio.data';
import { Icon } from '../shared/icon';
import { UiState } from '../shared/ui-state';
import { Badge } from './badge';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, Icon, Badge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="inicio" class="hero" [class.ready]="ui.loaded()">
      <div class="wrap layout">
        <div class="copy">
          <p class="greet"><span class="gradient">Rimaykullayki</span></p>
          <h1>Soy Cristhian.<br />Del taller al código.</h1>
          <p class="typed" [attr.aria-label]="profile.role">
            <span aria-hidden="true">{{ typed() }}</span><i aria-hidden="true"></i>
          </p>
          <p class="intro">{{ profile.intro }}</p>
          <div class="actions">
            <a class="btn btn-primary" routerLink="/" fragment="portafolio">
              Ver proyectos <app-icon name="arrowRight" [size]="16" />
            </a>
            <a class="btn btn-ghost" routerLink="/" fragment="contacto">
              Contáctame <app-icon name="send" [size]="15" />
            </a>
          </div>
          <div class="find">
            <span>ENCUÉNTRAME</span>
            <a [href]="profile.github" target="_blank" rel="noopener" aria-label="GitHub"><app-icon name="github" [size]="16" /></a>
            <a [href]="'mailto:' + profile.email" aria-label="Correo"><app-icon name="mail" [size]="16" /></a>
            @if (profile.linkedin) {
              <a [href]="profile.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn"><app-icon name="linkedin" [size]="16" /></a>
            }
          </div>
        </div>
      </div>
      <div class="stage"><app-badge /></div>
    </section>
  `,
  styles: `
    .hero {
      position: relative;
      min-height: 100svh;
      display: flex;
      align-items: center;
      padding: 96px 0 56px;
    }
    .layout {
      width: 100%;
    }
    .copy {
      position: relative;
      z-index: 2;
      max-width: 560px;
    }
    .copy > * {
      opacity: 0;
      transform: translateY(18px);
      transition:
        opacity 0.7s ease,
        transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
    }
    .ready .copy > * {
      opacity: 1;
      transform: none;
    }
    .ready .copy > :nth-child(2) {
      transition-delay: 0.08s;
    }
    .ready .copy > :nth-child(3) {
      transition-delay: 0.16s;
    }
    .ready .copy > :nth-child(4) {
      transition-delay: 0.24s;
    }
    .ready .copy > :nth-child(5) {
      transition-delay: 0.32s;
    }
    .ready .copy > :nth-child(6) {
      transition-delay: 0.4s;
    }
    .greet {
      margin: 0 0 10px;
      font-family: var(--display);
      font-size: clamp(2.5rem, 6.4vw, 4.8rem);
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.03em;
    }
    h1 {
      margin: 0;
      font-family: var(--display);
      font-size: clamp(1.45rem, 2.8vw, 2.15rem);
      font-weight: 600;
      line-height: 1.18;
      letter-spacing: -0.015em;
      text-wrap: balance;
    }
    .typed {
      min-height: 1.6em;
      margin: 18px 0 18px;
      font-size: clamp(1.02rem, 1.7vw, 1.2rem);
      font-weight: 600;
      color: var(--accent-2);
    }
    .typed i {
      display: inline-block;
      width: 2px;
      height: 1em;
      margin-left: 3px;
      vertical-align: -0.12em;
      background: currentColor;
      animation: blink 1s steps(2) infinite;
    }
    .intro {
      margin: 0;
      max-width: 52ch;
      line-height: 1.75;
      color: var(--muted);
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 30px;
    }
    .find {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 34px;
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.16em;
      color: var(--muted);
    }
    .find span {
      margin-right: 6px;
    }
    .find a {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      border: 1px solid var(--line);
      border-radius: 10px;
      color: var(--text);
      transition:
        border-color 0.2s,
        color 0.2s;
    }
    .find a:hover {
      border-color: var(--accent-2);
      color: var(--accent-2);
    }
    .stage {
      position: absolute;
      top: 0;
      bottom: 0;
      right: max(0px, calc((100vw - 1180px) / 2));
      width: 46%;
      max-width: 560px;
    }
    @keyframes blink {
      50% {
        opacity: 0;
      }
    }
    @media (max-width: 900px) {
      .hero {
        display: block;
        padding-top: 92px;
        padding-bottom: 0;
      }
      .stage {
        position: relative;
        right: auto;
        width: 100%;
        max-width: none;
        height: 560px;
        margin-top: 8px;
      }
    }
  `,
})
export class Hero implements OnInit, OnDestroy {
  protected readonly ui = inject(UiState);
  protected readonly profile = PROFILE;
  protected readonly typed = signal(PROFILE.typed[0]);
  private timer = 0;

  ngOnInit(): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let phrase = 0;
    let chars = PROFILE.typed[0].length;
    let deleting = true;
    const tick = () => {
      const text = PROFILE.typed[phrase];
      chars += deleting ? -1 : 1;
      this.typed.set(text.slice(0, chars));
      let wait = deleting ? 28 : 58;
      if (!deleting && chars === text.length) {
        deleting = true;
        wait = 2100;
      } else if (deleting && chars === 0) {
        deleting = false;
        phrase = (phrase + 1) % PROFILE.typed.length;
        wait = 300;
      }
      this.timer = window.setTimeout(tick, wait);
    };
    this.timer = window.setTimeout(tick, 3400);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
