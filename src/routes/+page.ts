import { Form } from '$lib/index.js';
import type { PageLoad } from './$types.js';
import { email, minLength, nonEmpty, object, pipe, string } from 'valibot';

export const load: PageLoad = () => {
  const form = new Form(
    {
      schema: object({
        email: pipe(string(), nonEmpty(), email()),
        password: pipe(string(), nonEmpty(), minLength(6))
      }),
      behavior: {
        email: {},
        password: {}
      }
    },
    {
      email: '',
      password: ''
    },
    async (output) => {
      // Normally sveltekit's goto would be used.
      console.log('Form is valid', output);
    }
  );
  return { form };
};
