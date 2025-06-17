<script lang="ts">
  import { page } from '$app/state';
  import type { LayoutProps } from './$types.js';

  const { data, children }: LayoutProps = $props();

  // Determine which form to show based on the current route
  let currentForm = $derived(
    {
      '/just-participant': 'login',
      '/just-participant/billing': 'billing',
      '/just-participant/credit-card': 'creditCard',
      '/just-participant/otp': 'otp',
      '/just-participant/success': 'success'
    }[page.url.pathname]
  );
</script>

<div class="container">
  <h1>Multi-Step Form Example</h1>

  <div class="progress">
    <div class="step" class:active={currentForm === 'login'} class:completed={data.participant.input.login}>
      <span>1</span>
      Login
    </div>
    <div class="step" class:active={currentForm === 'billing'} class:completed={data.participant.input.billing}>
      <span>2</span>
      Billing
    </div>
    <div class="step" class:active={currentForm === 'creditCard'} class:completed={data.participant.input.creditCard}>
      <span>3</span>
      Payment
    </div>
    <div class="step" class:active={currentForm === 'otp'} class:completed={data.participant.input.otp}>
      <span>4</span>
      Verify
    </div>
  </div>

  {@render children()}

  {#if currentForm === 'login'}{:else if currentForm === 'billing'}{:else if currentForm === 'creditCard'}{:else if currentForm === 'otp'}{:else if currentForm === 'success'}{/if}
</div>

<style>
  .container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  .progress {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3rem;
    position: relative;
  }

  .progress::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background: #e0e0e0;
    z-index: -1;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #666;
  }

  .step span {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: 2px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .step.active span {
    border-color: #007bff;
    color: #007bff;
  }

  .step.completed span {
    background: #28a745;
    border-color: #28a745;
    color: white;
  }

  .success {
    text-align: center;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .success h2 {
    color: #28a745;
    margin-bottom: 1rem;
  }

  .success button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .success button:hover {
    background: #0056b3;
  }

  details {
    margin-top: 1rem;
    text-align: left;
  }

  summary {
    cursor: pointer;
    color: #007bff;
  }

  pre {
    margin-top: 0.5rem;
    padding: 1rem;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.875rem;
  }
</style>
