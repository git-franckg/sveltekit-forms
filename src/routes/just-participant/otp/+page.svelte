<script lang="ts">
  import type { PageProps } from './$types.js';

  const { data }: PageProps = $props();
  const form = data.participant.set('otp', {
    otp: '',
    phoneNumber: ''
  });
  $effect(() => form.tick());

  // Format phone number
  function formatPhone(value: string) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }

  // Mock SMS sending
  let smsSent = $state(false);
  let resendTimer = $state(0);

  function sendSMS() {
    if (form.behaviors.phoneNumber.issueText) return;

    smsSent = true;
    resendTimer = 30;

    const interval = setInterval(() => {
      resendTimer--;
      if (resendTimer <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    // Mock SMS - in real app, this would call an API
    console.log(`SMS sent to ${form.input.phoneNumber} with code: 123456`);
  }
</script>

<div class="form-container">
  <h2>Verify Your Phone</h2>

  <div class="form-group">
    <label for="(will be replaced automatically by the attachment)" {@attach form.behaviors.phoneNumber.label}>Phone Number</label>
    <div class="phone-input-group">
      <input
        type="tel"
        placeholder="(555) 123-4567"
        maxlength="14"
        bind:value={form.input.phoneNumber}
        oninput={(e) => {
          const target = e.target as HTMLInputElement;
          target.value = formatPhone(target.value);
        }}
        {@attach form.behaviors.phoneNumber.input}
      />
      <button type="button" onclick={sendSMS} disabled={!!form.behaviors.phoneNumber.issueText || resendTimer > 0} class="send-btn">
        {resendTimer > 0 ? `Resend in ${resendTimer}s` : smsSent ? 'Resend Code' : 'Send Code'}
      </button>
    </div>
    <span class="error" {@attach form.behaviors.phoneNumber.error}>
      {form.behaviors.phoneNumber.issueText}
    </span>
  </div>

  {#if smsSent}
    <div class="form-group" style="margin-top: 2rem;">
      <label for="(will be replaced automatically by attachment)" {@attach form.behaviors.otp.label}>Enter 6-digit code</label>
      <input
        type="text"
        placeholder="123456"
        maxlength="6"
        class="otp-input"
        bind:value={form.input.otp}
        oninput={(e) => {
          const target = e.target as HTMLInputElement;
          target.value = target.value.replace(/\D/g, '');
        }}
        {@attach form.behaviors.otp.input}
      />
      <span class="error" {@attach form.behaviors.otp.error}>
        {form.behaviors.otp.issueText}
      </span>
      <p class="help-text" {@attach form.behaviors.otp.caption}>
        A verification code has been sent to your phone.
        <br />
        <small>(Demo: use code 123456)</small>
      </p>
    </div>
  {/if}

  <button type="button" disabled={form.submitting || !smsSent} onclick={form.submit}>
    {form.submitting ? 'Verifying...' : 'Complete Registration'}
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

  .phone-input-group {
    display: flex;
    gap: 0.5rem;
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

  .otp-input {
    font-size: 1.5rem;
    text-align: center;
    letter-spacing: 0.5em;
    font-family: monospace;
  }

  .error {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #dc3545;
    min-height: 1.2em;
  }

  .help-text {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #6c757d;
    line-height: 1.5;
  }

  .help-text small {
    color: #28a745;
  }

  .send-btn {
    flex-shrink: 0;
    padding: 0.75rem 1rem;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
    white-space: nowrap;
  }

  .send-btn:hover:not(:disabled) {
    background: #218838;
  }

  .send-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
</style>
