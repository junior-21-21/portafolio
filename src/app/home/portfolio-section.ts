import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CERTIFICATES, Certificate, PROFILE, PROJECTS, TECH_GROUPS } from '../data/portfolio.data';
import { Icon } from '../shared/icon';
import { ProjectThumb } from '../shared/project-thumb';
import { Reveal } from '../shared/reveal';
import { QuoteDemo } from './quote-demo';

const TABS = [
  { id: 'proyectos', label: 'Proyectos', icon: 'code' },
  { id: 'certificados', label: 'Certificados', icon: 'award' },
  { id: 'tecnologias', label: 'Tecnologías', icon: 'layers' },
] as const;

type TabId = (typeof TABS)[number]['id'];

@Component({
  selector: 'app-portfolio-section',
  imports: [RouterLink, Icon, ProjectThumb, Reveal, QuoteDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="portafolio" class="section wrap">
      <h2 class="weld-title center" appReveal>Portafolio</h2>

      <div class="tabs" role="tablist" aria-label="Contenido del portafolio" appReveal (keydown)="onTabKey($event)">
        @for (t of tabs; track t.id) {
          <button
            type="button"
            role="tab"
            [id]="'tab-' + t.id"
            [attr.aria-selected]="tab() === t.id"
            [attr.aria-controls]="'panel-' + t.id"
            [attr.tabindex]="tab() === t.id ? 0 : -1"
            [class.active]="tab() === t.id"
            (click)="tab.set(t.id)"
          >
            <app-icon [name]="t.icon" [size]="15" /> {{ t.label }}
          </button>
        }
      </div>

      <div class="panel" role="tabpanel" [id]="'panel-' + tab()" [attr.aria-labelledby]="'tab-' + tab()">
        @switch (tab()) {
          @case ('proyectos') {
            <app-quote-demo />
            <div class="projects">
              @for (project of projects; track project.slug; let i = $index) {
                <article class="card project" [appReveal]="(i % 3) * 70">
                  <app-project-thumb [project]="project" />
                  <span class="category">{{ project.category }}</span>
                  <h3>{{ project.title }}</h3>
                  <p>{{ project.summary }}</p>
                  <a class="details" [routerLink]="['/proyecto', project.slug]" [attr.aria-label]="'Detalles de ' + project.title">
                    Detalles <app-icon name="arrowRight" [size]="15" />
                  </a>
                </article>
              }
            </div>
            <a class="more" [href]="profile.github" target="_blank" rel="noopener">
              <app-icon name="github" /> Ver más repositorios en GitHub
            </a>
          }
          @case ('certificados') {
            <div class="certs">
              @for (cert of certificates; track cert.title) {
                <button type="button" class="card cert" (click)="open(cert)">
                  <img [src]="cert.image" [alt]="'Certificado de ' + cert.title" width="1025" height="725" loading="lazy" />
                  <strong>{{ cert.title }}</strong>
                  <span>{{ cert.issuer }}</span>
                  <small>{{ cert.date }}@if (cert.detail) { · {{ cert.detail }} }</small>
                </button>
              }
            </div>
          }
          @case ('tecnologias') {
            @for (group of groups; track group.title) {
              <h3 class="group-title">{{ group.title }}</h3>
              <ul class="tech">
                @for (item of group.items; track item.name) {
                  <li class="card">
                    @if (item.icon) {
                      <img [src]="'tech/' + item.icon + '.svg'" alt="" width="38" height="38" [class.invert]="item.icon === 'github' || item.icon === 'latex'" />
                    } @else {
                      <span class="glyph">{{ item.glyph }}</span>
                    }
                    <span>{{ item.name }}</span>
                  </li>
                }
              </ul>
            }
          }
        }
      </div>

      <dialog #viewer (click)="onDialogClick($event)" [attr.aria-label]="selected()?.title">
        @if (selected(); as cert) {
          <button type="button" class="close" aria-label="Cerrar" (click)="viewer.close()"><app-icon name="close" /></button>
          <img [src]="cert.image" [alt]="'Certificado de ' + cert.title" />
          <p><strong>{{ cert.title }}</strong> · {{ cert.issuer }} · {{ cert.date }}</p>
        }
      </dialog>
    </section>
  `,
  styles: `
    .tabs {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
      margin: 28px 0 36px;
    }
    .tabs button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border: 0;
      border-radius: 10px;
      background: none;
      font: 500 0.9rem var(--sans);
      color: var(--muted);
      cursor: pointer;
      transition:
        color 0.2s,
        background 0.2s;
    }
    .tabs button:hover {
      color: var(--text);
    }
    .tabs button.active {
      background: var(--accent);
      color: #fff;
      box-shadow: 0 8px 24px rgba(217, 24, 79, 0.4);
    }
    .projects {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .project {
      display: flex;
      flex-direction: column;
      padding: 14px;
      transition:
        border-color 0.25s,
        transform 0.25s;
    }
    .project:hover {
      border-color: rgba(255, 181, 71, 0.55);
    }
    .category {
      margin: 16px 4px 0;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent-2);
    }
    .project h3 {
      margin: 6px 4px 8px;
      font-size: 1.2rem;
      font-weight: 700;
    }
    .project p {
      flex: 1;
      margin: 0 4px 16px;
      font-size: 0.9rem;
      line-height: 1.6;
      color: var(--muted);
    }
    .details {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin: 0 4px 4px;
      padding: 8px 14px;
      border: 1px solid var(--line);
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      transition:
        background 0.2s,
        border-color 0.2s;
    }
    .details:hover {
      background: var(--accent);
      border-color: var(--accent);
    }
    .more {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-top: 32px;
      font-weight: 600;
      color: var(--accent-2);
    }
    .more:hover {
      text-decoration: underline;
    }
    .certs {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 400px));
      justify-content: center;
      gap: 20px;
    }
    .cert {
      display: grid;
      gap: 4px;
      padding: 14px;
      text-align: left;
      font: inherit;
      color: inherit;
      cursor: zoom-in;
    }
    .cert:hover {
      border-color: rgba(255, 181, 71, 0.55);
    }
    .cert img {
      width: 100%;
      height: auto;
      aspect-ratio: 1.41;
      object-fit: contain;
      margin-bottom: 10px;
      border-radius: 8px;
      background: #fff;
    }
    .cert span {
      font-size: 0.88rem;
      color: var(--muted);
    }
    .cert small {
      font-size: 0.78rem;
      color: var(--accent-2);
    }
    .group-title {
      margin: 30px 0 14px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .tech {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
      gap: 14px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .tech li {
      display: grid;
      justify-items: center;
      align-content: center;
      gap: 12px;
      min-height: 112px;
      padding: 16px 8px;
      font-size: 0.82rem;
      font-weight: 500;
      text-align: center;
    }
    .tech img {
      width: 38px;
      height: 38px;
    }
    .tech img.invert {
      filter: invert(1);
    }
    .glyph {
      display: grid;
      place-items: center;
      height: 38px;
      font: 800 0.95rem var(--mono);
      color: var(--accent-2);
    }
    dialog {
      width: min(960px, calc(100vw - 32px));
      padding: 16px;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: #160a24;
      color: var(--text);
    }
    dialog::backdrop {
      background: rgba(8, 4, 14, 0.82);
      backdrop-filter: blur(6px);
    }
    dialog img {
      display: block;
      width: 100%;
      max-height: 76vh;
      object-fit: contain;
      border-radius: 8px;
      background: #fff;
    }
    dialog p {
      margin: 12px 4px 2px;
      font-size: 0.9rem;
      color: var(--muted);
    }
    dialog strong {
      color: var(--text);
    }
    .close {
      position: absolute;
      top: 24px;
      right: 24px;
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border: 0;
      border-radius: 10px;
      background: rgba(20, 10, 32, 0.86);
      color: #fff;
      cursor: pointer;
    }
    @media (max-width: 480px) {
      .projects,
      .certs {
        grid-template-columns: 1fr;
      }
      .tabs button {
        padding: 9px 12px;
        font-size: 0.84rem;
      }
    }
  `,
})
export class PortfolioSection {
  protected readonly profile = PROFILE;
  protected readonly tabs = TABS;
  protected readonly projects = PROJECTS;
  protected readonly certificates = CERTIFICATES;
  protected readonly groups = TECH_GROUPS;
  protected readonly tab = signal<TabId>('proyectos');
  protected readonly selected = signal<Certificate | null>(null);

  private readonly viewer = viewChild.required<ElementRef<HTMLDialogElement>>('viewer');

  protected open(cert: Certificate): void {
    this.selected.set(cert);
    this.viewer().nativeElement.showModal();
  }

  protected onDialogClick(e: MouseEvent): void {
    // Un clic en el fondo cierra el visor.
    if (e.target === this.viewer().nativeElement) this.viewer().nativeElement.close();
  }

  protected onTabKey(e: KeyboardEvent): void {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const index = TABS.findIndex((t) => t.id === this.tab());
    const next = TABS[(index + dir + TABS.length) % TABS.length].id;
    this.tab.set(next);
    document.getElementById(`tab-${next}`)?.focus();
  }
}
