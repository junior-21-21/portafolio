import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PROFILE } from '../data/portfolio.data';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';
import { Weave } from '../shared/weave';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, Icon, Reveal, Weave],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contacto" class="section wrap">
      <h2 class="weld-title center" appReveal>Contacto</h2>
      <p class="lead" appReveal>Busco prácticas preprofesionales donde aportar y seguir creciendo. Escríbeme.</p>

      <div class="grid">
        <form class="card form" appReveal [formGroup]="form" (ngSubmit)="send()" novalidate>
          <div class="loom">
            <app-weave [text]="typedName() || 'HOLA'" [tiles]="12" />
            <small>Escribe tu nombre y míralo tejido: cada rombo es una letra.</small>
          </div>
          <label for="c-name">Nombre</label>
          <input id="c-name" type="text" formControlName="name" autocomplete="name" placeholder="Tu nombre"
            [attr.aria-invalid]="showError('name')" [attr.aria-describedby]="showError('name') ? 'e-name' : null" />
          @if (showError('name')) {
            <small class="error" id="e-name">Escribe tu nombre.</small>
          }

          <label for="c-email">Correo</label>
          <input id="c-email" type="email" formControlName="email" autocomplete="email" placeholder="tu@correo.com"
            [attr.aria-invalid]="showError('email')" [attr.aria-describedby]="showError('email') ? 'e-email' : null" />
          @if (showError('email')) {
            <small class="error" id="e-email">Escribe un correo válido.</small>
          }

          <label for="c-msg">Mensaje</label>
          <textarea id="c-msg" rows="5" formControlName="message" placeholder="¿En qué puedo ayudarte?"
            [attr.aria-invalid]="showError('message')" [attr.aria-describedby]="showError('message') ? 'e-msg' : null"></textarea>
          @if (showError('message')) {
            <small class="error" id="e-msg">Escribe un mensaje.</small>
          }

          <button class="btn btn-primary" type="submit"><app-icon name="send" [size]="15" /> Enviar mensaje</button>
          @if (sent()) {
            <p class="note" role="status">
              Se abrió tu app de correo con el mensaje listo. Si no apareció, escríbeme a
              <a [href]="'mailto:' + profile.email">{{ profile.email }}</a>.
            </p>
          } @else {
            <p class="note">El botón abre tu app de correo con el mensaje listo para enviar.</p>
          }
        </form>

        <div class="links" appReveal="100">
          <a class="card row" [href]="'mailto:' + profile.email">
            <span class="ico"><app-icon name="mail" /></span>
            <span class="text"><strong>Correo</strong><small>{{ profile.email }}</small></span>
            <app-icon name="arrowRight" [size]="16" />
          </a>
          <a class="card row" [href]="profile.github" target="_blank" rel="noopener">
            <span class="ico"><app-icon name="github" /></span>
            <span class="text"><strong>GitHub</strong><small>{{ profile.githubUser }}</small></span>
            <app-icon name="external" [size]="16" />
          </a>
          @if (profile.linkedin) {
            <a class="card row" [href]="profile.linkedin" target="_blank" rel="noopener">
              <span class="ico"><app-icon name="linkedin" /></span>
              <span class="text"><strong>LinkedIn</strong><small>Ver perfil</small></span>
              <app-icon name="external" [size]="16" />
            </a>
          }
          <a class="card row" [href]="profile.phoneHref">
            <span class="ico"><app-icon name="phone" /></span>
            <span class="text"><strong>Teléfono</strong><small>{{ profile.phone }}</small></span>
            <app-icon name="arrowRight" [size]="16" />
          </a>
          <div class="card row">
            <span class="ico"><app-icon name="pin" /></span>
            <span class="text"><strong>Ubicación</strong><small>{{ profile.location }}</small></span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .lead {
      margin: 14px auto 36px;
      max-width: 56ch;
      text-align: center;
      color: var(--muted);
    }
    .grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 20px;
      align-items: start;
    }
    .form {
      display: grid;
      padding: 24px;
    }
    label {
      margin: 14px 0 6px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .loom {
      margin-bottom: 4px;
    }
    .loom app-weave {
      border-radius: 6px;
    }
    .loom small {
      display: block;
      margin-top: 8px;
      font-size: 0.78rem;
      color: var(--muted);
    }
    input,
    textarea {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: rgba(11, 6, 20, 0.6);
      font: inherit;
      color: var(--text);
      resize: vertical;
    }
    input::placeholder,
    textarea::placeholder {
      color: #8d8095;
    }
    input:focus,
    textarea:focus {
      outline: 2px solid var(--accent-2);
      outline-offset: 1px;
    }
    [aria-invalid='true'] {
      border-color: #f87171;
    }
    .error {
      margin-top: 6px;
      color: #fca5a5;
    }
    button {
      justify-content: center;
      margin-top: 20px;
    }
    .note {
      margin: 12px 0 0;
      font-size: 0.8rem;
      line-height: 1.55;
      color: var(--muted);
    }
    .note a {
      color: var(--accent-2);
      overflow-wrap: anywhere;
    }
    .links {
      display: grid;
      gap: 12px;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      color: var(--text);
      transition: border-color 0.2s;
    }
    a.row:hover {
      border-color: rgba(255, 181, 71, 0.55);
    }
    .ico {
      display: grid;
      place-items: center;
      flex: none;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(217, 24, 79, 0.16);
      color: var(--accent-2);
    }
    .text {
      flex: 1;
      min-width: 0;
    }
    .text strong {
      display: block;
      font-size: 0.92rem;
    }
    .text small {
      display: block;
      font-size: 0.8rem;
      color: var(--muted);
      overflow-wrap: anywhere;
    }
    @media (max-width: 800px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Contact {
  protected readonly profile = PROFILE;
  protected readonly sent = signal(false);
  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });
  protected readonly typedName = toSignal(this.form.controls.name.valueChanges, { initialValue: '' });
  private readonly attempted = signal(false);

  protected showError(field: 'name' | 'email' | 'message'): boolean {
    return this.attempted() && this.form.controls[field].invalid;
  }

  protected send(): void {
    this.attempted.set(true);
    if (this.form.invalid) {
      this.sent.set(false);
      return;
    }
    const { name, email, message } = this.form.getRawValue();
    const subject = encodeURIComponent(`Contacto desde tu portafolio – ${name}`);
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    this.sent.set(true);
  }
}
