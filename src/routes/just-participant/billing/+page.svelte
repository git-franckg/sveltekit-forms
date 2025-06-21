<script lang="ts">
  import type { PageProps } from './$types.js';

  const { data }: PageProps = $props();
  const form = data.participant.set('billing', {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  $effect(() => form.tick());
</script>

<div class="form-container">
  <h2>Billing Address</h2>
  <div class="form-row">
    <div class="form-group">
      <label for="(will be replaced automatically by the attachment)" {@attach form.behaviors.firstName.label}>First Name</label>
      <input type="text" placeholder="John" bind:value={form.input.firstName} {@attach form.behaviors.firstName.input} />
      <span class="error" {@attach form.behaviors.firstName.error}>
        {form.behaviors.firstName.issueText}
      </span>
    </div>

    <div class="form-group">
      <label for="(will be replaced automatically by the attachment)" {@attach form.behaviors.lastName.label}>Last Name</label>
      <input type="text" placeholder="Doe" bind:value={form.input.lastName} {@attach form.behaviors.lastName.input} />
      <span class="error" {@attach form.behaviors.lastName.error}>
        {form.behaviors.lastName.issueText}
      </span>
    </div>
  </div>

  <div class="form-group">
    <label for="(will be replaced automatically by the attachment)" {@attach form.behaviors.address.label}>Street Address</label>
    <input type="text" placeholder="123 Main St" bind:value={form.input.address} {@attach form.behaviors.address.input} />
    <span class="error" {@attach form.behaviors.address.error}>
      {form.behaviors.address.issueText}
    </span>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="(will be replaced automatically by the attachment)" {@attach form.behaviors.city.label}>City</label>
      <input type="text" placeholder="New York" bind:value={form.input.city} {@attach form.behaviors.city.input} />
      <span class="error" {@attach form.behaviors.city.error}>
        {form.behaviors.city.issueText}
      </span>
    </div>

    <div class="form-group small">
      <label for="(will be replaced automatically by the attachment)" {@attach form.behaviors.state.label}>State</label>
      <input type="text" placeholder="NY" maxlength="2" bind:value={form.input.state} {@attach form.behaviors.state.input} />
      <span class="error" {@attach form.behaviors.state.error}>
        {form.behaviors.state.issueText}
      </span>
    </div>

    <div class="form-group">
      <label for="(will be replaced automatically by the attachment)" {@attach form.behaviors.zipCode.label}>ZIP Code</label>
      <input type="text" placeholder="10001" bind:value={form.input.zipCode} {@attach form.behaviors.zipCode.input} />
      <span class="error" {@attach form.behaviors.zipCode.error}>
        {form.behaviors.zipCode.issueText}
      </span>
    </div>
  </div>

  <button type="button" disabled={form.submitting} onclick={form.submit}>
    {form.submitting ? 'Processing...' : 'Continue to Payment'}
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

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-row:has(.small) {
    grid-template-columns: 2fr 1fr 1fr;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-row .form-group {
    margin-bottom: 0;
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
    margin-top: 1rem;
  }

  button:hover:not(:disabled) {
    background: #0056b3;
  }

  button:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .form-row:has(.small) {
      grid-template-columns: 1fr;
    }

    .form-group {
      margin-bottom: 1rem;
    }
  }
</style>
