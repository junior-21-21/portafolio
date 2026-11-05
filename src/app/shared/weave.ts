import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Colores de los anillos, del centro hacia afuera. */
const RING_COLORS = ['#ffb547', '#f6ead6', '#e0245e', '#19b6a6', '#ffb547', '#f6ead6', '#e0245e', '#19b6a6'];
const CORNERS = ['#2a0f4e', '#4a1036'];
const OFF = '#12081f';

const RADIUS = 7;
const TILE = RADIUS * 2 + 1;
const STEP = TILE + 1;

/**
 * Tejido generado a partir de un texto. Cada letra es un rombo y cada anillo del
 * rombo es un bit de su código: anillo con color = 1, anillo oscuro = 0.
 * El mismo texto siempre produce el mismo tejido.
 */
@Component({
  selector: 'app-weave',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.viewBox]="viewBox()"
      [attr.preserveAspectRatio]="slice() ? 'xMidYMid slice' : 'xMidYMid meet'"
      shape-rendering="crispEdges"
      aria-hidden="true"
    >
      <rect [attr.width]="width()" [attr.height]="height()" fill="#0b0514" />
      @for (layer of layers(); track layer.color) {
        <path [attr.d]="layer.d" [attr.fill]="layer.color" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: block;
      overflow: hidden;
    }
    svg {
      display: block;
      width: 100%;
      height: auto;
    }
    :host(.fill) svg {
      height: 100%;
    }
  `,
})
export class Weave {
  readonly text = input.required<string>();
  /** Rombos por fila. El texto se repite hasta completarlos. */
  readonly tiles = input(10);
  readonly rows = input(1);
  /** Recorta en vez de encoger, para bandas de altura fija y ancho completo. */
  readonly slice = input(false);

  protected readonly width = computed(() => this.tiles() * STEP + 1);
  protected readonly height = computed(() => this.rows() * STEP + 1);
  protected readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);

  protected readonly layers = computed(() => {
    const clean = this.text().trim().toUpperCase().replace(/\s+/g, ' ') || 'HOLA';
    const bytes = Array.from(clean, (ch) => ch.charCodeAt(0) & 0xff);
    const paths = new Map<string, string>();
    const add = (color: string, x: number, y: number) =>
      paths.set(color, `${paths.get(color) ?? ''}M${x} ${y}h1v1h-1z`);

    for (let row = 0; row < this.rows(); row++) {
      for (let col = 0; col < this.tiles(); col++) {
        const index = row * this.tiles() + col;
        const byte = bytes[index % bytes.length];
        const corner = CORNERS[(col + row) % 2];
        for (let y = 0; y < TILE; y++) {
          for (let x = 0; x < TILE; x++) {
            const ring = Math.abs(x - RADIUS) + Math.abs(y - RADIUS);
            const px = col * STEP + 1 + x;
            const py = row * STEP + 1 + y;
            if (ring > RADIUS) add(corner, px, py);
            else add((byte >> ring) & 1 ? RING_COLORS[ring] : OFF, px, py);
          }
        }
      }
    }
    return Array.from(paths, ([color, d]) => ({ color, d }));
  });
}
