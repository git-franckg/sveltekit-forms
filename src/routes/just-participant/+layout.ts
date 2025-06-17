import { goto } from '$app/navigation';
import { Participant } from '$lib/participant.svelte.js';
import type { LayoutLoad } from './$types.js';
import { loginSchema, billingSchema, creditCardSchema, otpSchema } from './schemas.js';

export const load: LayoutLoad = () => {
  const participant = new Participant({
    forms: {
      login: {
        schema: loginSchema,
        behavior: {
          // {} are of type BehaviorOptions
          email: {},
          password: {}
        },
        route: '/just-participant'
      },
      billing: {
        schema: billingSchema,
        behavior: {
          firstName: {},
          lastName: {},
          address: {},
          city: {},
          state: {},
          zipCode: {}
        },
        route: '/just-participant/billing'
      },
      creditCard: {
        schema: creditCardSchema,
        behavior: {
          cardNumber: {},
          cardholderName: {},
          cvv: {},
          expiryDate: {}
        },
        route: '/just-participant/credit-card'
      },
      otp: {
        schema: otpSchema,
        behavior: {
          otp: {},
          phoneNumber: {}
        },
        route: '/just-participant/otp'
      }
    },
    flow: ['login', 'billing', 'creditCard', 'otp'],
    endRoute: '/just-participant/success',
    async navigate(route) {
      await goto(route);
    }
  });
  return { participant };
};
