<script lang="ts">
  import type { PageProps } from './$types.js';

  const { data }: PageProps = $props();
  const form = data.participant.set('login', {
    email: '',
    password: ''
  });
  $effect(() => form.tick());
</script>

<div class="form-container">
  <h2>Login</h2>
  <div class="form-group">
    <label for="(will be replaced automatically by the attachment)" {@attach form.behaviors.email.label}>Email</label>
    <input type="email" placeholder="you@example.com" bind:value={form.input.email} {@attach form.behaviors.email.input} />
    <p class="error" {@attach form.behaviors.email.error}>
      {form.behaviors.email.issueText}
    </p>
  </div>

  <div class="form-group">
    <label for="(will be replaced automatically by the attachment)" {@attach form.behaviors.password.label}>Password</label>
    <input type="password" placeholder="Enter your password" bind:value={form.input.password} {@attach form.behaviors.password.input} />
    <span class="error" {@attach form.behaviors.password.error}>
      {form.behaviors.password.issueText}
    </span>
  </div>

  <button type="button" disabled={form.submitting} onclick={form.submit}>
    {form.submitting ? 'Logging in...' : 'Continue to Billing'}
  </button>
</div>

<style>
  .form-container {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 8px;
  }

  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.15s ease-in-out;
  }

  input:focus {
    outline: none;
    border-color: #007bff;
  }

  input[aria-invalid='true'] {
    border-color: #dc3545;
  }

  .error {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #dc3545;
    min-height: 1.2em;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
  }

  button:hover:not(:disabled) {
    background: #0056b3;
  }

  button:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
</style>
