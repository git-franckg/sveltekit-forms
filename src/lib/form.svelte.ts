import type { StandardSchemaV1 } from '@standard-schema/spec';
import { typedKeys, type KeyofUnion } from './utils.js';
import type { BehaviorOptions } from './behavior.svelte.js';
import { Behavior } from './behavior.svelte.js';
import { flattenIssues, type FlattenedIssues } from './@standard-schema/utils/flattenIssues.js';

/**
 * Tout les champs d'un formulaire.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormInput = Record<string, any>;

export type FormConfig<T extends FormInput> = {
  /** Schema de validation. */
  schema: StandardSchemaV1<T>;

  /** Configuration du comportement de chacun des champs. `Behavior` sera automatiquement instantié. */
  behavior: Record<KeyofUnion<T>, BehaviorOptions>;
};

export class Form<T extends FormInput> {
  /** Champs saisi par l'utilisateur */
  readonly input: T;

  /** Comportement des champs. */
  readonly behaviors: Record<KeyofUnion<T>, Behavior>;

  /** Erreurs des champs */
  readonly issues: FlattenedIssues<T> | null;

  constructor(
    config: FormConfig<T>,
    initialValue: T,
    private readonly onSubmit: (output: T) => void
  ) {
    this.input = $state(initialValue);

    this.behaviors = $state({} as Record<KeyofUnion<T>, Behavior>);
    for (const key of typedKeys(config.behavior)) this.behaviors[key] = new Behavior(config.behavior[key]);

    this.issues = $derived.by(() => {
      const result = config.schema['~standard'].validate(this.input);

      // It's documented that async schemas are unsupported.
      if (result instanceof Promise) {
        console.error('Schema must be synchronous');
        return null;
      }

      if (result.issues) {
        return flattenIssues(config.schema, result.issues);
      } else {
        return null;
      }
    });
  }

  // Helper to create a fixed variant of the form, makes typescript happy with variants
  // If the current has the input `{ type: 'a', a: boolean } | { type: 'b', b: boolean }`, I can pass `{ type: 'a' }` to
  // have a Form with the input `{ type: 'a', a: boolean }`, and have easily access to field `a` in my `+page.svelte` file.
  fixed<TFixed extends Partial<T>>(fixedInput: TFixed): Form<Extract<T, TFixed>> {
    Object.assign(this.input, fixedInput);
    return this as unknown as Form<Extract<T, TFixed>>;
  }

  /**
   * @summary Valide tout les champs dès qu'il y a un changement.
   *
   * @tutorial
   * `+page.svelte`
   * ```typescript
   * const form: Form<FormInput> = ...
   * $effect(() => form.tick())
   * ```
   */
  tick() {
    for (const key of typedKeys(this.behaviors)) {
      const msg = this.issues?.fieldIssues?.[key];
      if (msg?.[0]?.length) {
        const [firstMsg, ...otherMsgs] = msg;
        this.behaviors[key].issueText = [firstMsg, ...otherMsgs];
      } else {
        this.behaviors[key].issueText = undefined;
      }
    }
  }

  submit = () => {
    // Submit canceled due to issues, which are now displayed to the user.
    if (this.issues) {
      // Show potential issues on all fields
      for (const behavior of Object.values<Behavior>(this.behaviors)) {
        behavior.issueShown = true;
        behavior.touched = true;
      }

      return;
    }

    this.onSubmit($state.snapshot(this.input) as T);
  };
}
