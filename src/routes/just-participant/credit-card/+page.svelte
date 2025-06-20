<script lang="ts">
  import type { PageProps } from './$types.js';

  const { data }: PageProps = $props();
  const form = data.participant.set('creditCard', {
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  $effect(() => form.tick());

  // Format card number with spaces
  function formatCardNumber(value: string) {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ');
  }

  // Format expiry date
  function formatExpiry(value: string) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  }
</script>

<div class="form-container">
  <h2>Payment Details</h2>
  <div class="form-group">
    <label for="(will be replaced automatically by the attachment)" {@attach form.behaviors.cardNumber.label}>Card Number</label>
    <input
      type="text"
      placeholder="1234 5678 9012 3456"
      maxlength="19"
      bind:value={form.input.cardNumber}
      oninput={(e) => {
        const target = e.target as HTMLInputElement;
        target.value = formatCardNumber(target.value);
      }}
      {@attach form.behaviors.cardNumber.input}
    />
    <span class="error" {@attach form.behaviors.cardNumber.error}>
      {form.behaviors.cardNumber.issueText}
    </span>
  </div>

  <div class="form-group">
    <label for="(will be replaced automatically by the attachment)" {@attach form.behaviors.cardholderName.label}>Cardholder Name</label>
    <input
      type="text"
      placeholder="JOHN DOE"
      style="text-transform: uppercase"
      bind:value={form.input.cardholderName}
      {@attach form.behaviors.cardholderName.input}
    />
    <span class="error" {@attach form.behaviors.cardholderName.error}>
      {form.behaviors.cardholderName.issueText}
    </span>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="(will be replaced automatically by the attachment)" {@attach form.behaviors.expiryDate.label}>Expiry Date</label>
      <input
        type="text"
        placeholder="MM/YY"
        maxlength="5"
        bind:value={form.input.expiryDate}
        oninput={(e) => {
          const target = e.target as HTMLInputElement;
          target.value = formatExpiry(target.value);
        }}
        {@attach form.behaviors.expiryDate.input}
      />
      <span class="error" {@attach form.behaviors.expiryDate.error}>
        {form.behaviors.expiryDate.issueText}
      </span>
    </div>

    <div class="form-group">
      <label for="(will be replaced automatically by the attachment)" {@attach form.behaviors.cvv.label}>CVV</label>
      <input
        type="text"
        placeholder="123"
        maxlength="4"
        bind:value={form.input.cvv}
        oninput={(e) => {
          const target = e.target as HTMLInputElement;
          target.value = target.value.replace(/\D/g, '');
        }}
        {@attach form.behaviors.cvv.input}
      />
      <span class="error" {@attach form.behaviors.cvv.error}>
        {form.behaviors.cvv.issueText}
      </span>
    </div>
  </div>

  <div class="security-info">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
    Your payment information is encrypted and secure
  </div>

  <button type="button" disabled={form.submitting} onclick={form.submit}>
    {form.submitting ? 'Processing...' : 'Continue to Verification'}
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

  input[aria-invalid='true'] {
    border-color: #dc3545;
  }

  .error {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #dc3545;
    min-height: 1.2em;
  }

  .security-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.75rem;
    background: #e7f3ff;
    border-radius: 4px;
    font-size: 0.875rem;
    color: #0056b3;
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
    margin-top: 1.5rem;
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

    .form-group {
      margin-bottom: 1rem;
    }
  }
</style>
