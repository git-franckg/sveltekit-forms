import { type FormInput, type FormConfig, Form } from './form.svelte.js';
import type { EnsureUniqueArray } from './utils.js';

/**
 * Les champs des formulaires d'un participant.
 */
export type ParticipantInput = Record<string, FormInput>;

/**
 * Configure les formualaires et leur ordre.
 */
export type ParticipantConfig<T extends ParticipantInput> = {
  /** Formulaires auquel le participant devra répondre. */
  forms: {
    [K in keyof T]: FormConfig<T[K]> & {
      /** Href vers le formulaire */
      route: string;
    };
  };
  /** Href lorsque le dernier formulaire a été rempli. */
  endRoute: string;
  /** Array qui contient les noms des formulaires, où celui au tout début sera le premier formulaire. */
  flow: EnsureUniqueArray<(keyof T)[]>;
  /** Adapteur vers sveltekit's `goto` par exemple. */
  navigate(route: string): Promise<void>;
};

export class Participant<T extends ParticipantInput> {
  readonly input: Partial<T> = $state({});

  constructor(private readonly config: ParticipantConfig<T>) {}

  set<K extends keyof T>(form: K, defaultValue: T[K]): Form<T[K]> {
    return new Form(this.config.forms[form], this.input[form] ?? defaultValue, async (output) => {
      this.input[form] = output;

      const curr = this.config.flow.indexOf(form);
      if (curr == -1) throw new Error();

      if (curr == this.config.flow.length - 1) {
        console.log('Redirecting to last route');
        await this.config.navigate(this.config.endRoute);
      } else {
        const next = this.config.flow[curr + 1];
        console.log('Redirecting to next route', next);
        await this.config.navigate(this.config.forms[next].route);
      }
    });
  }
}
