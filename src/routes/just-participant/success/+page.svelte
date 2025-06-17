<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageProps } from './$types.js';
  const { data }: PageProps = $props();
</script>

<div class="success">
  <h2>All Done!</h2>

  <p>Your multi-step form has been completed successfully.</p>

  <details>
    <summary>View submitted data</summary>
    <pre>{JSON.stringify(data.participant.input, null, 2)}</pre>
  </details>

  <button onclick={() => goto('/just-participant')}>Start Over</button>
</div>
