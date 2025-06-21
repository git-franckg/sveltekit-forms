import { browser } from '$app/environment';
import type { ParticipantFactoryInput } from '$lib/participant.svelte.js';
import type { LayoutLoad } from './$types.js';
import { myParticipant } from './schemas.js';

const STORAGE_KEY = 'sveltekit_forms_preview_justParticipant';

type StorageData = Partial<ParticipantFactoryInput<typeof myParticipant>>;

export const load: LayoutLoad = () => {
  const json = browser ? window.localStorage.getItem(STORAGE_KEY) : null;

  const participant = myParticipant(json ? JSON.parse(json) : undefined, {
    forms: {
      login: '/just-participant/login',
      billing: '/just-participant/billing',
      creditCard: '/just-participant/creditCard',
      otp: '/just-participant/otp'
    },
    abortRoute: '/just-participant',
    successRoute: '/just-participant/success',
    async onSubmit(name, input) {
      const json = window.localStorage.getItem(STORAGE_KEY);
      const value: StorageData = json ? JSON.parse(json) : {};

      value[name] = input;

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    }
  });
  return { participant };
};
