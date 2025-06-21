import { goto } from '$app/navigation';
import { Participant } from '$lib/participant.svelte.js';
import type { LayoutLoad } from './$types.js';
import { loginSchema, billingSchema, creditCardSchema, otpSchema } from './schemas.js';

export const load: LayoutLoad = () => {
  const participant = new Participant(
    {
      forms: {
        login: {
          schema: loginSchema,
          behavior: {
            // {} are of type BehaviorOptions
            email: {},
            password: {}
          }
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
          }
        },
        creditCard: {
          schema: creditCardSchema,
          behavior: {
            cardNumber: {},
            cardholderName: {},
            cvv: {},
            expiryDate: {}
          }
        },
        otp: {
          schema: otpSchema,
          behavior: {
            otp: {},
            phoneNumber: {}
          }
        }
      },
      flow: ['login', 'billing', 'creditCard', 'otp'],
      async navigate(route) {
        await goto(route);
      }
    },
    {
      forms: {
        login: '/just-participant/login',
        billing: '/just-participant/billing',
        creditCard: '/just-participant/creditCard',
        otp: '/just-participant/otp'
      },
      abortRoute: '/just-participant',
      successRoute: '/just-participant/success'
    }
  );
  return { participant };
};
