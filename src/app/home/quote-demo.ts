import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../shared/icon';

const SAMPLE =
  'Buenas tardes, soy Rosa Huamán Quispe, DNI 40123456. Necesito un portón para mi casa en Carmen Alto. Mi celular es 966 123 456.';

const WORD = '[A-ZÁÉÍÓÚÑ][\\p{L}]+';
const NAME = new RegExp(`(?:soy|me llamo|nombre:?)\\s+(${WORD}(?:\\s+${WORD}){0,3})`, 'iu');
const PLACE = new RegExp(`\\ben\\s+(${WORD}(?:\\s+${WORD}){0,2})`, 'u');
const RUC = /\b(?:10|20)\d{9}\b/;
const DNI = /\b\d{8}\b/;
const PHONE = /\b9\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/;
const JOB = /\b(port[oó]n|reja|techo|escalera|baranda|puerta|ventana)\b/i;

/**
 * Demo interactiva de la idea del Cotizador del Taller. Es una versión
 * simplificada, escrita para esta página: no usa datos ni precios del sistema real.
 */
@Component({
  selector: 'app-quote-demo',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card demo">
      <div class="head">
        <div>
          <span class="tag">Pruébalo</span>
          <h3>Del WhatsApp a la cotización</h3>
          <p>
            En el taller, cotizar era un proceso manual. Edita este mensaje y mira cómo se
            ordena solo. Es una demo simplificada de la idea de mi
            <a routerLink="/proyecto/cotizador-taller">Cotizador del Taller</a>.
          </p>
        </div>
      </div>

      <div class="cols">
        <div class="input">
          <label for="demo-msg">Mensaje del cliente</label>
          <textarea id="demo-msg" rows="5" [value]="message()" (input)="message.set($any($event.target).value)"></textarea>

          <div class="dims">
            <label>Ancho (m)
              <input type="number" min="0" step="0.1" [value]="width()" (input)="width.set(+$any($event.target).value)" />
            </label>
            <label>Alto (m)
              <input type="number" min="0" step="0.1" [value]="height()" (input)="height.set(+$any($event.target).value)" />
            </label>
            <label>Piezas
              <input type="number" min="0" step="1" [value]="pieces()" (input)="pieces.set(+$any($event.target).value)" />
            </label>
          </div>
        </div>

        <span class="arrow" aria-hidden="true"><app-icon name="arrowRight" [size]="22" /></span>

        <dl class="sheet" aria-live="polite">
          <h4>Cotización · borrador</h4>
          @for (row of rows(); track row.label) {
            <div [class.missing]="!row.value">
              <dt>{{ row.label }}</dt>
              <dd>{{ row.value || 'No detectado' }}</dd>
            </div>
          }
          <div class="total">
            <dt>Área total</dt>
            <dd>{{ area() }} m²</dd>
          </div>
        </dl>
      </div>
    </div>
  `,
  styles: `
    .demo {
      margin-bottom: 28px;
      padding: 24px;
      border-color: rgba(255, 181, 71, 0.4);
    }
    .tag {
      font: 700 0.72rem var(--mono);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent-2);
    }
    h3 {
      margin: 6px 0 8px;
      font-family: var(--display);
      font-size: clamp(1.4rem, 3vw, 1.9rem);
      font-weight: 800;
    }
    .head p {
      margin: 0;
      max-width: 68ch;
      line-height: 1.65;
      color: var(--muted);
    }
    .head a {
      color: var(--accent-2);
      text-decoration: underline;
    }
    .cols {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 18px;
      margin-top: 22px;
    }
    label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
    }
    textarea,
    input {
      width: 100%;
      margin-top: 6px;
      padding: 10px 12px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: rgba(11, 6, 20, 0.7);
      font: inherit;
      font-weight: 400;
      color: var(--text);
    }
    textarea {
      resize: vertical;
      line-height: 1.55;
    }
    .dims {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 12px;
    }
    .arrow {
      color: var(--accent-2);
    }
    .sheet {
      margin: 0;
      padding: 18px 20px;
      border-radius: 10px;
      background: #f6ead6;
      color: #1d1020;
    }
    h4 {
      margin: 0 0 10px;
      font: 700 0.72rem var(--mono);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #8f1450;
    }
    .sheet > div {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      padding: 7px 0;
      border-bottom: 1px dashed rgba(29, 16, 32, 0.25);
      font-size: 0.9rem;
    }
    dt {
      color: #5a4350;
    }
    dd {
      margin: 0;
      font-weight: 700;
      text-align: right;
    }
    .missing dd {
      font-weight: 500;
      color: #a3213f;
    }
    .sheet .total {
      border-bottom: 0;
      font-size: 1.05rem;
    }
    @media (max-width: 800px) {
      .cols {
        grid-template-columns: 1fr;
      }
      .arrow {
        justify-self: center;
        transform: rotate(90deg);
      }
    }
  `,
})
export class QuoteDemo {
  protected readonly message = signal(SAMPLE);
  protected readonly width = signal(3);
  protected readonly height = signal(2.4);
  protected readonly pieces = signal(1);

  protected readonly rows = computed(() => {
    const text = this.message();
    const job = text.match(JOB)?.[1] ?? '';
    return [
      { label: 'Cliente', value: text.match(NAME)?.[1] ?? '' },
      { label: 'DNI / RUC', value: text.match(RUC)?.[0] ?? text.match(DNI)?.[0] ?? '' },
      { label: 'Celular', value: text.match(PHONE)?.[0] ?? '' },
      { label: 'Lugar', value: text.match(PLACE)?.[1] ?? '' },
      { label: 'Trabajo', value: job && job[0].toUpperCase() + job.slice(1).toLowerCase() },
    ];
  });

  protected readonly area = computed(() =>
    (Math.max(0, this.width()) * Math.max(0, this.height()) * Math.max(0, this.pieces())).toFixed(2),
  );
}
