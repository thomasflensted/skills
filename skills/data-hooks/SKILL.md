---
name: data-hooks
description: Guide for writing hooks that fetch or mutate data via TanStack Query. Use when creating or modifying data fetching hooks or data functions.
version: 0.1.0
---

# Data hooks

Guide for writing hooks that fetch or mutate data via TanStack Query.

## Architecture

Data fetching is split into two layers:

- **Data functions** — plain async functions that call the API. No React, no TanStack Query.
- **Hooks** — TanStack Query hooks (`useQuery`, `useMutation`) that wrap data functions.

Components only import hooks — never data functions directly.

## Rules

### Always use TanStack Query

Every data hook uses `useQuery` or `useMutation` — no raw `fetch`, no other state management for server state.

### Export a named function, then spread the rest

For mutations, rename `mutation.mutate` to a descriptive name and spread the rest:

```ts
const mutation = useMutation({ ... });
return { deleteEvent: mutation.mutate, ...mutation };
```

For queries, return `useQuery(...)` directly — no wrapping needed.

### Data functions live outside the hook

The async function that calls the API lives in its own file. The hook imports and calls it — never define the fetch/mutate logic inline inside the hook.

### Use query/mutation config properties

Prefer built-in TanStack Query options (`select`, `enabled`, `staleTime`, etc.) over manual logic inside the hook. Let the library do the work.

### Use `status` over multiple booleans at callsites

When a component needs both the pending and error/success state, destructure `status` instead of `isPending` + `isError` + `isSuccess`:

```ts
const { status } = useEvent(id);
// status === "pending" | "error" | "success"
```

### Centralise query keys in larger codebases

In codebases with many queries, centralise query keys in a factory instead of inlining key arrays. This prevents key mismatches and makes invalidation predictable.

### Data functions must throw on error

Data functions should throw on failure so TanStack Query can surface the error through `status === "error"`. Never return an error object — throw it.

```ts
const res = await fetch("/api/v1/events");
if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
return res.json();
```

### Mutations: rename mutate, invalidate related caches

- Rename `mutation.mutate` to a domain-specific verb (`createEvent`, `deleteEvent`, `participate`).
- In `onSuccess` or `onSettled`, invalidate all related query keys — both the specific detail and any lists that might be stale.

### Mutations: accept callbacks via props

When a callsite needs to react to mutation lifecycle events (e.g. navigate on success), accept them as a typed props argument to the hook:

```ts
type Props = {
  onSuccess?: () => void;
};

export const useDeleteEvent = ({ onSuccess }: Props) => { ... };
```

### Optimistic updates

When doing optimistic updates, follow the pattern: cancel in-flight queries → `setQueryData` in `onMutate` → invalidate in `onSettled` to reconcile with the server.
