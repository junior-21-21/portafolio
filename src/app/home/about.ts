import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EDUCATION, EXPERIENCE, LANGUAGES, ORIGINS, PROFILE, SOFT_SKILLS, STATS } from '../data/portfolio.data';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';
import { Sparks } from '../shared/sparks';

@Component({
  selector: 'app-about',
  imports: [RouterLink, Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="sobre-mi" class="section wrap">
      <h2 class="weld-title" appReveal>Sobre mí</h2>

      <div class="intro">
        <div class="name" appReveal>
          <p class="hi gradient">Hola, soy</p>
          <p class="fullname">{{ profile.firstLine }}<br />{{ profile.secondLine }}</p>
          <a class="btn btn-primary" routerLink="/" fragment="contacto">
            <app-icon name="send" [size]="15" /> Hablemos
          </a>
        </div>
        <figure class="photo" appReveal="100">
          <img
            src="img/cristhian-recorte.webp"
            alt="Retrato de Cristhian Quicaño con traje y corbata"
            width="960"
            height="1000"
            loading="lazy"
          />
        </figure>
        <div class="bio" appReveal="200">
          @for (paragraph of profile.about; track $index) {
            <p>{{ paragraph }}</p>
          }
          <a class="link" [href]="profile.cv" download>
            <app-icon name="download" [size]="16" /> Descargar CV
          </a>
        </div>
      </div>

      <div class="stats">
        @for (stat of stats; track stat.label; let i = $index) {
          <div class="card stat" [appReveal]="i * 80">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
            <small>{{ stat.note }}</small>
          </div>
        }
      </div>

      <h3 class="origin-title" appReveal>Primero lo viví, luego lo programé</h3>
      <div class="origins">
        @for (item of origins; track item.slug; let i = $index) {
          <a class="card origin" [routerLink]="['/proyecto', item.slug]" [appReveal]="i * 80">
            <div>
              <small>Lo viví</small>
              <strong>{{ item.lived }}</strong>
              <p>{{ item.saw }}</p>
            </div>
            <span class="joint" aria-hidden="true"><app-icon name="arrowRight" [size]="20" /></span>
            <div>
              <small class="built">Lo programé</small>
              <strong>{{ item.built }}</strong>
              <p>{{ item.did }}</p>
            </div>
          </a>
        }
      </div>

      <div class="columns">
        <div>
          <h3 class="sub" appReveal><app-icon name="briefcase" /> Experiencia</h3>
          <div class="seam-wrap" #timeline>
          <span class="seam" #seam aria-hidden="true"><i></i></span>
          <ol class="timeline">
            @for (job of experience; track job.role) {
              <li appReveal>
                <div class="job-head">
                  <h4>{{ job.role }}</h4>
                  @if (job.period) {
                    <span class="pill">{{ job.period }}</span>
                  }
                </div>
                <p class="company">{{ job.company }}</p>
                <ul>
                  @for (point of job.points; track point) {
                    <li>{{ point }}</li>
                  }
                </ul>
              </li>
            }
          </ol>
          </div>
        </div>

        <div class="side">
          <h3 class="sub" appReveal><app-icon name="cap" /> Formación</h3>
          @for (item of education; track item.title) {
            <div class="card edu" appReveal>
              <h4>{{ item.title }}</h4>
              <p>{{ item.place }}</p>
              <small>{{ item.status }}</small>
            </div>
          }

          <h3 class="sub" appReveal>Idiomas</h3>
          <div class="langs" appReveal>
            @for (lang of languages; track lang.name) {
              <div>
                <strong>{{ lang.name }}</strong>
                <small>{{ lang.level }}</small>
              </div>
            }
          </div>

          <h3 class="sub" appReveal>Habilidades</h3>
          <div class="chips" appReveal>
            @for (skill of skills; track skill) {
              <span class="chip">{{ skill }}</span>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .intro {
      display: grid;
      grid-template-columns: 1fr minmax(240px, 340px) 1fr;
      align-items: end;
      gap: 32px;
      margin-top: 40px;
    }
    .hi {
      margin: 0;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      letter-spacing: -0.03em;
    }
    .fullname {
      margin: 0 0 24px;
      font-size: clamp(1.9rem, 3.4vw, 2.7rem);
      font-weight: 800;
      line-height: 1.08;
      letter-spacing: -0.03em;
      color: #ddcfd2;
    }
    .photo {
      margin: 0;
      -webkit-mask-image: linear-gradient(#000 76%, transparent);
      mask-image: linear-gradient(#000 76%, transparent);
      background: radial-gradient(60% 55% at 50% 42%, rgba(217, 24, 79, 0.5), transparent 75%);
    }
    .photo img {
      display: block;
      width: 100%;
      height: auto;
    }
    .bio p {
      margin: 0 0 16px;
      line-height: 1.75;
      color: var(--muted);
    }
    .link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: var(--accent-2);
    }
    .link:hover {
      text-decoration: underline;
    }
    .origin-title {
      margin: 64px 0 18px;
      font-family: var(--display);
      font-size: clamp(1.5rem, 3vw, 2.1rem);
      font-weight: 800;
    }
    .origins {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .origin {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: start;
      gap: 14px;
      padding: 20px;
      transition: border-color 0.2s;
    }
    .origin:hover {
      border-color: var(--accent-2);
    }
    .origin small {
      display: block;
      margin-bottom: 6px;
      font: 700 0.68rem var(--mono);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .origin small.built {
      color: var(--accent-2);
    }
    .origin strong {
      display: block;
      font-size: 1rem;
      line-height: 1.3;
    }
    .origin p {
      margin: 6px 0 0;
      font-size: 0.86rem;
      line-height: 1.55;
      color: var(--muted);
    }
    .joint {
      align-self: center;
      color: var(--accent-2);
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 56px;
    }
    .stat {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 2px 12px;
      padding: 22px;
    }
    .stat strong {
      grid-row: 1 / 3;
      grid-column: 2;
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1;
    }
    .stat span {
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .stat small {
      font-size: 0.8rem;
      color: var(--muted);
    }
    .columns {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 48px;
      margin-top: 64px;
    }
    .sub {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 0 18px;
      font-size: 1.15rem;
      font-weight: 700;
    }
    .side .sub:not(:first-child) {
      margin-top: 30px;
    }
    .seam-wrap {
      position: relative;
    }
    .seam {
      position: absolute;
      z-index: 1;
      left: -1px;
      top: 0;
      bottom: 0;
      width: 3px;
      pointer-events: none;
    }
    .seam i {
      display: block;
      width: 100%;
      height: 0;
      border-radius: 3px;
      background: linear-gradient(#6b5f68, #a8552c 70%, #ff8a2f 92%, #fff3c4);
      box-shadow: 0 2px 10px rgba(255, 138, 47, 0.7);
    }
    .timeline {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .timeline > li {
      position: relative;
      padding: 0 0 28px 24px;
      border-left: 1px solid var(--line);
    }
    .timeline > li::before {
      content: '';
      position: absolute;
      left: -5px;
      top: 7px;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 12px var(--accent);
    }
    .job-head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 12px;
    }
    h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
    }
    .pill {
      padding: 2px 10px;
      border-radius: 999px;
      background: rgba(217, 24, 79, 0.18);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--accent-2);
    }
    .company {
      margin: 4px 0 10px;
      font-size: 0.88rem;
      color: var(--accent-2);
    }
    .timeline ul {
      margin: 0;
      padding-left: 18px;
      font-size: 0.92rem;
      line-height: 1.65;
      color: var(--muted);
    }
    .edu {
      padding: 16px 18px;
      margin-bottom: 12px;
    }
    .edu p {
      margin: 4px 0;
      font-size: 0.88rem;
      color: var(--muted);
    }
    .edu small {
      font-size: 0.78rem;
      color: var(--accent-2);
    }
    .langs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .langs strong {
      display: block;
      font-size: 0.95rem;
    }
    .langs small {
      color: var(--muted);
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    @media (max-width: 900px) {
      .intro {
        grid-template-columns: 1fr;
        justify-items: start;
      }
      .photo {
        width: min(320px, 80%);
        justify-self: center;
      }
      .columns,
      .origins {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 560px) {
      .stats {
        grid-template-columns: 1fr;
      }
      .origin {
        grid-template-columns: 1fr;
      }
      .joint {
        transform: rotate(90deg);
        justify-self: start;
      }
    }
  `,
})
export class About implements AfterViewInit, OnDestroy {
  protected readonly origins = ORIGINS;
  protected readonly profile = PROFILE;
  protected readonly experience = EXPERIENCE;
  protected readonly education = EDUCATION;
  protected readonly languages = LANGUAGES;
  protected readonly skills = SOFT_SKILLS;
  protected readonly stats = STATS;

  private readonly sparks = inject(Sparks);
  private readonly timeline = viewChild.required<ElementRef<HTMLElement>>('timeline');
  private readonly seam = viewChild.required<ElementRef<HTMLElement>>('seam');
  private progress = 0;
  private lastSpark = 0;
  private pending = false;

  /** La experiencia se va soldando con el scroll: el cordón avanza y lanza chispas. */
  private readonly onScroll = () => {
    if (this.pending) return;
    this.pending = true;
    requestAnimationFrame(() => {
      this.pending = false;
      this.updateSeam();
    });
  };

  ngAfterViewInit(): void {
    addEventListener('scroll', this.onScroll, { passive: true });
    this.updateSeam();
  }

  ngOnDestroy(): void {
    removeEventListener('scroll', this.onScroll);
  }

  private updateSeam(): void {
    const rect = this.timeline().nativeElement.getBoundingClientRect();
    const next = Math.min(1, Math.max(0, (innerHeight * 0.62 - rect.top) / rect.height));
    const fill = this.seam().nativeElement.firstElementChild as HTMLElement;
    fill.style.height = `${next * 100}%`;
    const now = performance.now();
    if (next > this.progress && next < 1 && now - this.lastSpark > 70) {
      this.lastSpark = now;
      this.sparks.burst(rect.left, rect.top + rect.height * next, 8, 0.8);
    }
    this.progress = next;
  }
}
