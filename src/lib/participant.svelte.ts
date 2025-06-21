import { type FormInput, type FormConfig, Form } from './form.svelte.js';

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
    [K in keyof T]: FormConfig<T[K]>;
  };
  /** Array qui contient les noms des formulaires, où celui au tout début sera le premier formulaire. */
  flow: (keyof T)[];
  /** Adapteur vers sveltekit's `goto` par exemple. */
  navigate(route: string): Promise<void>;
};

export class Participant<T extends ParticipantInput> {
  readonly input: Partial<T>;

  constructor(
    private readonly config: ParticipantConfig<T>,
    initialInput: Partial<T> = {}
  ) {
    this.input = $state(initialInput);
  }

  private makeOnSubmit<K extends keyof T>(form: K): (output: T[K]) => Promise<void> {
    return async (output) => {
      this.input[form] = output;

      const href = this.getNextHref(form);
      await this.config.navigate(href);
    };
  }

  getNextHref(form: keyof T): string {
    const curr = this.config.flow.indexOf(form);
    if (curr == -1) throw new Error();

    const isLast = curr == this.config.flow.length - 1;

    if (isLast) {
      return this.config.completeRoute;
    } else {
      const nextForm = this.config.flow[curr + 1];
      return this.config.forms[nextForm].route;
    }
  }

  getBackHref(form: keyof T): string | undefined {
    const curr = this.config.flow.indexOf(form);
    if (curr == -1) throw new Error();

    const isFirst = curr == 0;

    if (isFirst) {
      return this.config.abortRoute;
    } else {
      const nextForm = this.config.flow[curr - 1];
      return this.config.forms[nextForm].route;
    }
  }

  set<K extends keyof T>(form: K, defaultValue: T[K]): Form<T[K]> {
    return new Form(this.config.forms[form], this.input[form] ?? defaultValue, this.makeOnSubmit(form));
  }

  replace<K extends keyof T>(form: K, initialValue: T[K]): Form<T[K]> {
    return new Form(this.config.forms[form], initialValue, this.makeOnSubmit(form));
  }
}
