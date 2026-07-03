---
name: verify-states
description: Walk through every visual state of a component one at a time, mocking each so the user can verify it in the app.
version: 0.1.0
---

# Verify component states

Walk through every visual state of a component one at a time, mocking each with temporary variables so the user can see it in the app.

## Workflow

### Step 1 — List all states

Read the component and identify every distinct visual state. Common states include:

- **Loading** — skeleton is shown while data is pending
- **Error** — error screen when the fetch fails
- **Empty** — data loaded successfully but the collection/content is empty
- **Conditional branches** — every early return or branch that produces a distinct visual result (e.g. with/without cover image, no-permission state, admin vs member view, compact vs full layout)
- **Pending async action** — an async operation (e.g. mutation, form submit) is in flight, showing spinners, disabled buttons, or other pending UI
- **Success** — the default happy path with data

Present the full list to the user and wait for confirmation before proceeding. The user may add, remove, or reorder states.

### Step 2 — Mock the first state

Once the user confirms the list, mock the first state by adding temporary variables or hardcoded values at the top of the component. For example:

- **Loading**: override `status` to `"pending"` right after the hook call
- **Error**: override `status` to `"error"` right after the hook call
- **Empty**: override the data with an empty array/null right after destructuring
- **Conditional branches**: override the field that controls the branch to force each path (e.g. set `coverUri` to `null` to hit the no-image branch, set `role` to `"admin"` to hit the admin view)
- **Pending async action**: if the component has an async operation (e.g. a mutation) that sets a pending/loading state while in flight, mock it by replacing the handler with a function that awaits a long timeout: `async () => { await new Promise((r) => setTimeout(r, 5000)); }`. This lets the user see the in-flight UI (disabled buttons, spinners, etc.).

Always mock by inserting temporary lines — never change hook calls, prop types, or component structure.

Tell the user which state is now mocked and wait.

### Step 3 — Wait for the user

**Never advance to the next state until the user explicitly says to move on.** The user may:

- Ask for adjustments to the current mock
- Point out a visual issue to fix before continuing
- Confirm and ask to move to the next state

### Step 4 — Repeat

When the user confirms, revert the current mock and apply the next one. Repeat until all states have been reviewed.

### Step 5 — Clean up

After the last state is confirmed, remove all temporary mock code and restore the component to its original working state. Verify the component still works by leaving it in the success state.
