import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { PROFILE, PROJECTS, TECH_ICON_BY_NAME } from '../data/portfolio.data';
import { Icon } from '../shared/icon';
import { ProjectThumb } from '../shared/project-thumb';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, Icon, ProjectThumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (project(); as p) {
      <article class="wrap page">
        <nav class="crumbs" aria-label="Ruta de navegación">
          <a class="back" routerLink="/" fragment="portafolio"><app-icon name="arrowLeft" [size]="15" /> Volver</a>
          <span>Proyectos</span>
          <span aria-hidden="true">›</span>
          <span class="current" aria-current="page">{{ p.title }}</span>
        </nav>

        <div class="head">
          <div>
            <span class="category">{{ p.category }}</span>
            <h1>{{ p.title }}</h1>
            <p class="desc">{{ p.description }}</p>
            @if (p.repos.length) {
              <div class="repos">
                @for (repo of p.repos; track repo.url; let first = $first) {
                  <a class="btn" [class.btn-primary]="first" [class.btn-ghost]="!first" [href]="repo.url" target="_blank" rel="noopener">
                    <app-icon name="github" [size]="16" /> {{ repo.label }}
                  </a>
                }
              </div>
            }
          </div>
          <app-project-thumb class="thumb" [project]="p" />
        </div>

        @if (p.highlights.length) {
          <section>
            <h2>Qué hace</h2>
            <ul class="highlights">
              @for (item of p.highlights; track item) {
                <li class="card">{{ item }}</li>
              }
            </ul>
          </section>
        }

        @if (p.tech.length) {
          <section>
            <h2><app-icon name="code" /> Tecnologías usadas</h2>
            <ul class="tech">
              @for (name of p.tech; track name) {
                <li class="chip">
                  @if (icons[name]; as icon) {
                    <img [src]="'tech/' + icon + '.svg'" alt="" width="18" height="18" />
                  }
                  {{ name }}
                </li>
              }
            </ul>
          </section>
        }
      </article>
    }
  `,
  styles: `
    .page {
      min-height: 80vh;
      padding-top: 104px;
    }
    .crumbs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      font-size: 0.86rem;
      color: var(--muted);
    }
    .back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-right: 8px;
      padding: 7px 12px;
      border: 1px solid var(--line);
      border-radius: 10px;
      color: var(--text);
    }
    .back:hover {
      border-color: var(--accent-2);
    }
    .current {
      color: var(--text);
    }
    .head {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      align-items: center;
      gap: 48px;
      margin-top: 44px;
    }
    .category {
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent-2);
    }
    h1 {
      margin: 8px 0 18px;
      font-size: clamp(2.2rem, 5vw, 3.4rem);
      font-weight: 800;
      line-height: 1.08;
      letter-spacing: -0.03em;
    }
    .desc {
      margin: 0;
      line-height: 1.75;
      color: var(--muted);
    }
    .repos {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 26px;
    }
    h2 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 52px 0 18px;
      font-size: 1.15rem;
      font-weight: 700;
    }
    .highlights {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 14px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .highlights li {
      padding: 16px 18px;
      font-size: 0.92rem;
      line-height: 1.6;
      color: #e8dbd8;
    }
    .tech {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .chip img {
      width: 18px;
      height: 18px;
    }
    @media (max-width: 800px) {
      .head {
        grid-template-columns: 1fr;
        gap: 28px;
      }
    }
  `,
})
export class ProjectDetail {
  /** Parámetro :slug de la ruta. */
  readonly slug = input.required<string>();

  protected readonly icons = TECH_ICON_BY_NAME;
  protected readonly project = computed(() => PROJECTS.find((p) => p.slug === this.slug()));

  private readonly title = inject(Title);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const project = this.project();
      if (!project) {
        void this.router.navigateByUrl('/');
        return;
      }
      this.title.setTitle(`${project.title} | ${PROFILE.shortName}`);
    });
  }
}
