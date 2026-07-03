# Skills

A collection of reusable [Claude Code](https://claude.ai/code) skills, installable into any project with a single command.

## Install a skill

```sh
npx @thomasflensted/skills add <name>
```

This copies the skill into `.claude/skills/` in the current project. Use `--global` (or `-g`) to install to `~/.claude/skills/` instead, making it available everywhere.

You can install multiple skills at once:

```sh
npx @thomasflensted/skills add pingpong verify-states
```

## Other commands

```sh
npx @thomasflensted/skills list              # list available skills
npx @thomasflensted/skills update            # update all installed skills
npx @thomasflensted/skills remove <name>     # remove a skill
```

Add `--global` to any command to target `~/.claude/skills/` instead of the current project.

## Available skills

| Skill | Description |
| --- | --- |
| `pingpong` | Back-and-forth sparring mode for exploring ideas and stress-testing thinking before jumping to solutions. |
| `verify-states` | Walk through every visual state of a component one at a time, mocking each so you can verify it in the app. |
