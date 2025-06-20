import { SvelteMap } from 'svelte/reactivity';
import { Participant, type ParticipantConfig, type ParticipantInput } from './participant.svelte.js';

export class MultiParticipant<T extends ParticipantInput> {
  readonly value: SvelteMap<string, Partial<T>>;

  constructor(
    private readonly config: ParticipantConfig<T>,
    initialValue: Record<string, Partial<T>>
  ) {
    this.value = new SvelteMap(Object.entries(initialValue));
  }

  getOrCreate(id: string, defaultInput: Partial<T> = {}): Participant<T> {
    const initialInput = this.value.get(id) || defaultInput;

    const participant = new Participant(
      {
        ...this.config,
        navigate: (route) => {
          this.value.set(id, participant.input);
          return this.config.navigate(route);
        }
      },
      initialInput
    );

    return participant;
  }
}
