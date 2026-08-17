# Invento AI Frontend Constitution

Version: 1.0.0

## Principles

### Principle 1: Strict FSD and Nx Boundaries

Nx applications (`apps/`) must only consume from `libs/` and never import from each other. Strict adherence to Feature-Sliced Design (FSD).

### Principle 2: Modern Angular Standards

Exclusively use Standalone Components, modern block control flow (`@if`, `@for`), and Signals for local state management. No `any` types.

### Principle 3: Concise Component Naming

Folders and files drop the `.component` suffix for cleaner imports (e.g., `loader/loader.ts`). Every feature folder must expose an `index.ts` public API barrel file.

### Principle 4: Universal Guarding

All navigation between apps or pages must be guarded (`authGuard`, `stepGuard`).

### Principle 5: Git Workflows

Commits must be Conventional Commits. Branches must follow `<type>/<feature-name>--<app-name>`.

## Governance

This constitution is enforced by Antigravity AI rules and Husky hooks.
