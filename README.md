# Skills

CLI for installing my personal [Claude Code](https://claude.ai/code) skills into any project.

## Install a skill

```sh
npx @thomasflensted/skills add <name>
```

This copies the skill into `.claude/skills/` in the current project. Use `--global` (or `-g`) to install to `~/.claude/skills/` instead, making it available everywhere.

You can install multiple skills at once:

```sh
npx @thomasflensted/skills add pingpong verify-states
```

## Update installed skills

```sh
npx @thomasflensted/skills update
```

Re-fetches the latest version of every installed skill. Add `--global` to update globally installed skills.

## Remove a skill

```sh
npx @thomasflensted/skills remove <name>
```

## List available skills

```sh
npx @thomasflensted/skills list
```

Shows all available skills and marks which ones are currently installed.

## Available skills

| Skill | Description |
| --- | --- |
| `pingpong` | Back-and-forth sparring mode for exploring ideas and stress-testing thinking before jumping to solutions. |
| `verify-states` | Walk through every visual state of a component one at a time, mocking each so you can verify it in the app. |

## Adding a new skill

1. Create `skills/<name>/SKILL.md` with frontmatter (`name`, `description`, `version`) and the skill content.
2. Bump the version in `package.json`.
3. `npm publish --access public`.
