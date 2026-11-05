import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Project } from '../data/portfolio.data';
import { Icon } from './icon';
import { Weave } from './weave';

/** Cada proyecto tiene su propio tejido, generado a partir de su nombre. */
@Component({
  selector: 'app-project-thumb',
  imports: [Icon, Weave],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-weave [text]="project().title" [tiles]="7" [rows]="3" />
    <div class="over" aria-hidden="true">
      <span class="glyph"><app-icon [name]="project().icon" [size]="24" /></span>
      <div class="mods">
        @for (mod of project().modules; track mod) {
          <span>{{ mod }}</span>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: #0b0514;
    }
    .over {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12px;
      padding: 12px;
      background: linear-gradient(transparent 25%, rgba(11, 5, 20, 0.92));
    }
    .glyph {
      display: grid;
      place-items: center;
      flex: none;
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: #f6ead6;
      color: #2a0f4e;
    }
    .mods {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 5px;
    }
    .mods span {
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(11, 5, 20, 0.88);
      font: 500 0.66rem var(--mono);
      color: #f6ead6;
    }
  `,
})
export class ProjectThumb {
  readonly project = input.required<Project>();
}
