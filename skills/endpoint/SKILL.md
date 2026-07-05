---
name: endpoint
description: Use this skill when adding or changing an API endpoint. Triggers include "new endpoint", "add an endpoint", "create a GET/POST/PUT/DELETE for X", "new route for X", "add an endpoint for X", "update the response for X", "add a field to X". Covers response design, handler structure, and testing.
version: 0.1.0
---

# Adding or changing an API endpoint

## 1. Response design — think before you code

Every field you ship is a contract you maintain. Adding a v2 costs real work
across multiple repos — so get v1 right by designing for extensibility from the
start.

Before writing any handler code, review the response shape field by field using
these rules:

### Prefer enums over booleans

Booleans can't grow. Two related booleans push combinatorial logic to the
client and create impossible states. A single enum is one source of truth, can
grow by adding a value, and makes it explicit that only one state applies at a
time.

Bad — two booleans that are really one state:

```json
{ "is_scheduled": true, "is_cancelled": false }
```

Good — one enum:

```json
{ "status": "scheduled" }
```

Now `"postponed"` is a one-line addition with zero client changes.

### Prefer objects over flat fields

Flat fields can't be extended without breaking the top-level namespace.
Whenever two or more fields are logically related, group them into an object.
Even a single field is worth wrapping if you can foresee related fields joining
it later.

Bad — related fields scattered at the top level:

```json
{ "location": "Central Park", "lat": 40.78, "lng": -73.97 }
```

Good — one extensible object:

```json
{ "location": { "name": "Central Park", "lat": 40.78, "lng": -73.97 } }
```

Adding `"address"` or `"timezone"` later doesn't pollute the top level.

### Server-formatted display values

Any value the client will render as text should include a server-computed
`display` string. This avoids duplicating formatting logic across multiple
clients and lets the server change formatting without a client release.

Display strings for values that vary by user preference (e.g. unit system)
should use consistent keys so the client can select with a single lookup:
`field.display[pref]`. Keep display keys consistent across all fields — the
client shouldn't need a mapping per field type.

### Empty arrays, not null

When a field is typed as an array and has no items, always return `[]` — never
`null`. This keeps the client from needing nil-checks on every list field.

### Defer logic to the API

When multiple clients consume the API, every piece of logic that lives
client-side is duplicated, hard to update, and risks drift. Push it
server-side:

- **Permissions as computed booleans** — the client gets `can_manage: true`,
  not a role it has to interpret. The server owns the rules.
- **Labels and display strings** — e.g. `action_label: "Join"`.
  The client renders it; the server computes it from status, context,
  and auth state.
- **Derived state** — anything that combines multiple fields into a single
  decision should be resolved server-side and sent as one field.

### Separate data from per-user context

When a response mixes entity data with user-specific metadata (permissions,
status, labels), split them into distinct top-level objects. This makes
caching, sharing, and unauthenticated access cleaner. Example:

```json
{
  "item": { ... },
  "context": { "permissions": { ... }, "user_status": "can_edit" }
}
```

`context` is `null` for unauthenticated requests.

## 2. Handler structure

Follow the existing patterns in the codebase. Don't invent new patterns. Read
a recent, well-structured handler and match it.

Handlers should read as a flat sequence of calls and checks — no inlined
logic, no anonymous functions, no deep nesting. The handler calls extracted
functions and acts on their results:

```
input   = parse request
resource = fetch from DB
check   = validate permissions / business rules
result  = perform action
respond = serialize and return
```

If a block of logic is more than a single call + error check, extract it into
a named function. The handler itself should stay a readable list of
"do X, check, do Y, check, respond."

Extract pure functions wherever possible — formatting, mapping, computation.
Pure functions are trivially unit-testable.

Before writing a new function, grep the codebase to check if one already exists
that does what you need. Duplicates create drift and double maintenance.

## 3. Testing

- **Unit tests** — for every pure function you extracted (formatting, mapping,
  computation).
- **Integration tests** — for queries/services that hit the database or
  external services.
- **Handler/route tests** — for the HTTP layer: auth gates, status codes,
  response shape.

## 4. Checklist

- [ ] Response shape reviewed field by field against the rules above.
- [ ] No unnecessary booleans — used enums where state can grow.
- [ ] Related fields grouped into objects.
- [ ] Display values server-computed where the client would render text.
- [ ] Logic pushed server-side — client gets computed results, not raw inputs.
- [ ] Handler follows existing codebase patterns.
- [ ] Pure functions extracted and unit-tested.
- [ ] Integration tests for queries/services.
- [ ] Handler test for the HTTP layer.
