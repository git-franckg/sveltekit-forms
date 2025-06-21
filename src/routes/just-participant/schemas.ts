import { goto } from '$app/navigation';
import { participant } from '$lib/participant.svelte.js';
import * as v from 'valibot';

// Login form schema
export const loginSchema = v.object({
  email: v.pipe(v.string(), v.email('Please enter a valid email')),
  password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters'))
});

// Billing address schema
export const billingSchema = v.object({
  firstName: v.pipe(v.string(), v.minLength(1, 'First name is required')),
  lastName: v.pipe(v.string(), v.minLength(1, 'Last name is required')),
  address: v.pipe(v.string(), v.minLength(1, 'Address is required')),
  city: v.pipe(v.string(), v.minLength(1, 'City is required')),
  state: v.pipe(v.string(), v.length(2, 'State must be 2 characters')),
  zipCode: v.pipe(v.string(), v.regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'))
});

// Credit card schema
export const creditCardSchema = v.object({
  cardNumber: v.pipe(v.string(), v.regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, 'Please enter a valid card number')),
  cardholderName: v.pipe(v.string(), v.minLength(1, 'Cardholder name is required')),
  expiryDate: v.pipe(v.string(), v.regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Please enter MM/YY format')),
  cvv: v.pipe(v.string(), v.regex(/^\d{3,4}$/, 'CVV must be 3-4 digits'))
});

// SMS OTP schema
export const otpSchema = v.object({
  phoneNumber: v.pipe(v.string(), v.regex(/^\+?1?\d{10}$/, 'Please enter a valid phone number')),
  otp: v.pipe(v.string(), v.regex(/^\d{6}$/, 'OTP must be 6 digits'))
});

export const myParticipant = participant({
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
});
