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

export type ParticipantRoutes<T extends ParticipantInput> = {
  forms: Record<keyof T, string>;
  abortRoute: string;
  successRoute: string;
  onSubmit: <K extends keyof T>(name: K, input: T[K]) => Promise<void>;
};

export class Participant<T extends ParticipantInput> {
  readonly input: Partial<T>;

  constructor(
    private readonly config: ParticipantConfig<T>,
    private readonly routes: ParticipantRoutes<T>,
    initialInput: Partial<T> = {}
  ) {
    this.input = $state(initialInput);
  }

  private makeOnSubmit<K extends keyof T>(form: K): (output: T[K]) => Promise<void> {
    return async (input) => {
      this.input[form] = input;

      await this.routes.onSubmit(form, input);

      const href = this.getNextHref(form);
      await this.config.navigate(href);
    };
  }

  getNextHref(form: keyof T): string {
    const curr = this.config.flow.indexOf(form);
    if (curr == -1) throw new Error();

    const isLast = curr == this.config.flow.length - 1;

    if (isLast) {
      return this.routes.successRoute;
    } else {
      const nextForm = this.config.flow[curr + 1];
      return this.routes.forms[nextForm];
    }
  }

  getBackHref(form: keyof T): string {
    const curr = this.config.flow.indexOf(form);
    if (curr == -1) throw new Error();

    const isFirst = curr == 0;

    if (isFirst) {
      return this.routes.abortRoute;
    } else {
      const nextForm = this.config.flow[curr - 1];
      return this.routes.forms[nextForm];
    }
  }

  set<K extends keyof T>(form: K, defaultValue: T[K]): Form<T[K]> {
    return new Form(this.config.forms[form], this.input[form] ?? defaultValue, this.makeOnSubmit(form));
  }

  replace<K extends keyof T>(form: K, initialValue: T[K]): Form<T[K]> {
    return new Form(this.config.forms[form], initialValue, this.makeOnSubmit(form));
  }
}

export type ParticipantFactory<T extends ParticipantInput> = (
  initialInput: Partial<T> | undefined,
  routes: ParticipantRoutes<T>
) => Participant<T>;

export type ParticipantFactoryInput<T extends ParticipantFactory<ParticipantInput>> = T extends ParticipantFactory<infer R> ? R : never;

export function participant<T extends ParticipantInput>(config: ParticipantConfig<T>): ParticipantFactory<T> {
  return (initialInput, routes) => {
    return new Participant(config, routes, initialInput);
  };
}
