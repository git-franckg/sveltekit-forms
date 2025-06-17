<script lang="ts">
  import type { PageProps } from './$types.js';

  const { data }: PageProps = $props();
  $effect(() => data.form.tick());
</script>

<fieldset>
  <legend>
    <label for="" {@attach data.form.behaviors.email.label}>Email</label>
  </legend>

  <p {@attach data.form.behaviors.email.caption}>par exemple: email@exemple.fr</p>

  <input bind:value={data.form.input.email} {@attach data.form.behaviors.email.input} />

  <p {@attach data.form.behaviors.email.error}>{data.form.behaviors.email.issueText?.[0]}</p>
</fieldset>

<fieldset>
  <legend>
    <label for="" {@attach data.form.behaviors.password.label}>Password</label>
  </legend>

  <p {@attach data.form.behaviors.password.caption}>6 caractères minimum</p>

  <input bind:value={data.form.input.password} {@attach data.form.behaviors.password.input} />

  <p {@attach data.form.behaviors.password.error}>{data.form.behaviors.password.issueText?.[0]}</p>
</fieldset>

<button type="button" onclick={data.form.submit}>Se connecter</button>

<style>
  p {
    margin: 0;
  }
  fieldset {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
  }
</style>
