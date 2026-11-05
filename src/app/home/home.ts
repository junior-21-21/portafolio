import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Weave } from '../shared/weave';
import { About } from './about';
import { Contact } from './contact';
import { Hero } from './hero';
import { PortfolioSection } from './portfolio-section';

@Component({
  selector: 'app-home',
  imports: [Hero, About, PortfolioSection, Contact, Weave],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    <app-weave class="fill band" text="HUAMANGA" [tiles]="64" [slice]="true" />
    <app-about />
    <app-weave class="fill band" text="AYACUCHO" [tiles]="64" [slice]="true" />
    <app-portfolio-section />
    <app-weave class="fill band" text="QUECHUA" [tiles]="64" [slice]="true" />
    <app-contact />
  `,
  styles: `
    .band {
      height: 44px;
      margin-top: 40px;
      border-block: 1px solid var(--line);
    }
  `,
})
export class Home {}
