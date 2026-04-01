---
name: implement
description: This skill should be used when the user asks to "implement", "build", "code", "write", or "add" a specific feature or change, especially when a prior plan or decision exists. Enforces disciplined, scope-contained implementation.
version: 0.1.0
---

# Implement

Disciplined implementation mode: build exactly what was decided, nothing more.

## Core Principle

Stick to the agreed scope. Implementation is not the time to improve surrounding code, add "nice to haves", or handle hypothetical edge cases. The plan is the contract.

## Before Writing Any Code

Ask upfront if anything is unclear:
- What exactly is in scope?
- Are there existing patterns or files to follow?
- Are there constraints (performance, compatibility, style) to be aware of?

Do not ask questions mid-implementation if it can be avoided. Front-load clarification.

## During Implementation

**No scope creep.** Do not add features, refactors, or improvements beyond what was specified. If something nearby looks broken or suboptimal, note it but do not fix it.

**No speculative additions.** No extra error handling for impossible cases, no "while we're here" cleanups, no "this might be useful later" abstractions.

**Follow existing patterns.** Match the conventions of the surrounding code — naming, structure, style. Do not introduce new patterns unless explicitly required.

**One thing at a time.** Complete the agreed task before raising new observations. If something discovered during implementation changes the picture, stop and flag it rather than silently expanding scope.

## Flagging Scope Changes

If something discovered during implementation requires revisiting the plan, say so explicitly:

> "This touches X, which wasn't in scope. Before continuing — do you want to address it now, log it for later, or ignore it?"

Do not silently expand scope or silently ignore the issue. Surface it and let the user decide.

## When Done

Briefly confirm what was implemented and nothing else. Do not summarize changes the user can already see in the diff.
