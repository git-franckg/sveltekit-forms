# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a reactive form management library for SvelteKit that provides type-safe form handling with automatic validation. It uses Svelte 5's new features (runes and attachments) and integrates with Standard Schema validation libraries.

## Commands

### Development

- `yarn dev` - Start development server
- `yarn preview` - Preview production build

### Building & Packaging

- `yarn build` - Build library and prepare for publishing
- `yarn prepack` - Create npm package (runs automatically during build)

### Code Quality

- `yarn check` - Run svelte-check for TypeScript errors
- `yarn check:watch` - Run svelte-check in watch mode
- `yarn lint` - Check code formatting and run ESLint
- `yarn format` - Format code with Prettier

### Testing

- `yarn test` - Run all tests once
- `yarn test:unit` - Run unit tests (add `--watch` for watch mode)

## Architecture

### Core Components

1. **Form Class** (`src/lib/form.svelte.ts`)

   - Central form state management with reactive validation
   - Generic type `T extends FormInput` for type safety
   - Key methods: `submit()`, `tick()`, `fixed()`
   - Properties: `input` (form data), `behaviors` (field behaviors), `issues` (validation errors)

2. **Behavior Class** (`src/lib/behavior.svelte.ts`)

   - Manages individual field UI behavior and accessibility
   - Provides attachments for: input, label, error, caption elements
   - Handles error visibility timing (show on blur, hide on input)
   - Manages ARIA attributes automatically

3. **Validation Integration**
   - Uses Standard Schema V1 specification
   - Compatible with Valibot, Zod, and other Standard Schema libraries
   - Synchronous validation only (async schemas throw error)
   - Issues flattened into `formIssues` and `fieldIssues`

### Key Patterns

1. **Svelte 5 Features**

   - Uses `$state` and `$derived` runes for reactivity
   - Attachment pattern for DOM manipulation
   - Effects for continuous validation

2. **Type Safety**

   - Full TypeScript support with proper inference
   - Union type support via `fixed()` method
   - Type-safe object keys with `typedKeys()` utility

3. **Testing**
   - Component tests use `.svelte.test.ts` pattern with jsdom
   - Non-component tests use standard `.test.ts` pattern
   - Jest DOM matchers available for assertions

## Development Guidelines

### Code Style

- Spaces for indentation
- Single quotes for strings
- No trailing commas
- 140 character line width
- Format before committing: `yarn format`

### Testing Approach

- Write tests in `*.test.ts` or `*.svelte.test.ts` files
- Use Testing Library for component tests
- Mock window.matchMedia is already set up for jsdom

### Package Development

- Library exports from `src/lib/index.ts`
- Demo/documentation in `src/routes/+page.svelte`
- Run `yarn check` before building to catch TypeScript errors
- Use `yarn lint` to ensure code quality

## Important Implementation Notes

### Form Reactivity

**CRITICAL**: When using the Form class in components, you MUST add `$effect(() => form.tick())` to ensure proper reactivity. This effect triggers validation and updates the form state when inputs change.

```svelte
<script lang="ts">
  const form = new Form(schema, { input: defaultValues });
  
  // This is REQUIRED for form reactivity
  $effect(() => form.tick());
</script>
```

### Attachment Usage

When using Behavior attachments (for input, label, error, caption), use Svelte 5's `{@attach` directive:

```svelte
<label {@attach form.behaviors.fieldName.label}>Field Label</label>
<input {@attach form.behaviors.fieldName.input} bind:value={form.input.fieldName} />
<span {@attach form.behaviors.fieldName.error}></span>
<span {@attach form.behaviors.fieldName.caption}>Helper text</span>
```

**NOTE**: Do NOT use the deprecated `use:` directive. Always use `{@attach` for Svelte 5 attachments.

The attachments handle:
- ARIA attributes automatically
- Error visibility timing
- Proper accessibility relationships
