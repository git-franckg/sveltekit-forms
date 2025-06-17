import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

/**
 * Définit le comportement d'un champs.
 * Gère l'affichage des erreurs ().
 */
export type BehaviorOptions = {
  /**
   * @summary choisis à quel moment l'erreur du champs est visible.
   *
   * ## `onblur`
   * L'erreur est caché lors de la saisi (event `oninput`) et visible lors de la perte du focus (`onchange` et `onblur`).
   *
   * @default 'onblur'
   */
  validationMethod?: 'onblur';
};

export class Behavior {
  private static nextId = 0;
  private id = Behavior.nextId++;
  private ids = {
    label: `forms-${this.id}-label`,
    caption: `forms-${this.id}-caption`,
    input: `forms-${this.id}-input`,
    issue: `forms-${this.id}-issue`
  };

  issueText = $state<[string, ...string[]]>();
  issueShown = $state(false);
  touched = $state(false);

  constructor({}: BehaviorOptions) {}

  input: Attachment<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = (el) => {
    el.setAttribute('id', this.ids.input);
    el.setAttribute('aria-labelledby', `${this.ids.label} ${this.ids.caption}`);
    el.setAttribute('aria-errormessage', this.ids.issue);

    $effect(() => {
      if (this.issueShown && this.issueText) {
        el.setAttribute('aria-invalid', 'true');
      } else {
        el.removeAttribute('aria-invalid');
      }
    });

    const listeners = [
      on(el, 'input', () => {
        this.touched = true;
        this.issueShown = false;
      }),
      on(el, 'change', () => {
        this.touched = true;
        this.issueShown = true;
      }),
      on(el, 'blur', () => {
        // Si l'utilisateur modifie l'input, puis remet celle de départ, oninput aura été call mais pas onchange.
        this.issueShown = this.touched;
      })
    ];

    return () => {
      listeners.forEach((fn) => fn());
    };
  };

  label: Attachment<HTMLLabelElement> = (el) => {
    el.setAttribute('id', this.ids.label);
    el.setAttribute('for', this.ids.input);
  };

  error: Attachment<HTMLElement> = (el) => {
    el.setAttribute('id', this.ids.issue);
    el.setAttribute('role', 'alert');

    $effect(() => {
      if (this.issueShown && this.issueText) {
        el.removeAttribute('hidden');
      } else {
        el.setAttribute('hidden', 'true');
      }
    });
  };

  caption: Attachment<HTMLElement> = (el) => {
    el.setAttribute('id', this.ids.caption);
    el.setAttribute('role', 'note');
  };
}
