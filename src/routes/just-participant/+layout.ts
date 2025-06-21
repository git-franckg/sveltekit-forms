import type { LayoutLoad } from './$types.js';
import { myParticipant } from './schemas.js';

export const load: LayoutLoad = () => {
  const participant = myParticipant(undefined, {
    forms: {
      login: '/just-participant/login',
      billing: '/just-participant/billing',
      creditCard: '/just-participant/creditCard',
      otp: '/just-participant/otp'
    },
    abortRoute: '/just-participant',
    successRoute: '/just-participant/success'
  });
  return { participant };
};
