#!/usr/bin/env node

import { readdir, mkdir, rm, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_RAW =
  "https://raw.githubusercontent.com/thomasflensted/skills/main/skills";
const REPO_API =
  "https://api.github.com/repos/thomasflensted/skills/contents/skills";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const bundledSkillsDir = resolve(__dirname, "..", "skills");

const [, , command, ...rest] = process.argv;
const globalFlag = rest.includes("--global") || rest.includes("-g");
const names = rest.filter((a) => !a.startsWith("-"));

const targetDir = globalFlag
  ? join(process.env.HOME, ".claude", "skills")
  : join(process.cwd(), ".claude", "skills");

async function fetchSkill(name) {
  const url = `${REPO_RAW}/${name}/SKILL.md`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Skill "${name}" not found in repo`);
  return res.text();
}

async function listRemote() {
  const res = await fetch(REPO_API, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) throw new Error("Failed to list skills from GitHub");
  const entries = await res.json();
  return entries.filter((e) => e.type === "dir").map((e) => e.name);
}

async function listBundled() {
  const entries = await readdir(bundledSkillsDir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function installSkill(name, content) {
  const dir = join(targetDir, name);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "SKILL.md"), content);
}

async function add(names) {
  if (!names.length) {
    console.error("Usage: skills add <name> [--global]");
    process.exit(1);
  }

  for (const name of names) {
    try {
      const bundledPath = join(bundledSkillsDir, name, "SKILL.md");
      let content;
      if (existsSync(bundledPath)) {
        content = await readFile(bundledPath, "utf-8");
      } else {
        content = await fetchSkill(name);
      }
      await installSkill(name, content);
      const where = globalFlag ? "~/.claude/skills" : ".claude/skills";
      console.log(`  + ${name} → ${where}/${name}/SKILL.md`);
    } catch (e) {
      console.error(`  ✗ ${name}: ${e.message}`);
    }
  }
}

async function remove(names) {
  if (!names.length) {
    console.error("Usage: skills remove <name> [--global]");
    process.exit(1);
  }
  for (const name of names) {
    const dir = join(targetDir, name);
    if (!existsSync(dir)) {
      console.error(`  ✗ ${name}: not installed`);
      continue;
    }
    await rm(dir, { recursive: true });
    console.log(`  - ${name}`);
  }
}

async function list() {
  let available;
  try {
    available = await listBundled();
  } catch {
    available = await listRemote();
  }

  const installed = existsSync(targetDir)
    ? (await readdir(targetDir, { withFileTypes: true }))
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
    : [];

  console.log("Available skills:\n");
  for (const name of available) {
    const marker = installed.includes(name) ? " (installed)" : "";
    console.log(`  ${name}${marker}`);
  }
}

async function update() {
  if (!existsSync(targetDir)) {
    console.log("No skills installed.");
    return;
  }

  const installed = (await readdir(targetDir, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  if (!installed.length) {
    console.log("No skills installed.");
    return;
  }

  console.log("Updating skills:\n");
  for (const name of installed) {
    try {
      const bundledPath = join(bundledSkillsDir, name, "SKILL.md");
      let content;
      if (existsSync(bundledPath)) {
        content = await readFile(bundledPath, "utf-8");
      } else {
        content = await fetchSkill(name);
      }
      await installSkill(name, content);
      console.log(`  ↑ ${name}`);
    } catch (e) {
      console.error(`  ✗ ${name}: ${e.message}`);
    }
  }
}

switch (command) {
  case "add":
    await add(names);
    break;
  case "remove":
  case "rm":
    await remove(names);
    break;
  case "list":
  case "ls":
    await list();
    break;
  case "update":
    await update();
    break;
  default:
    console.log(`Usage: skills <command>

Commands:
  add <name...> [--global]   Install skills
  remove <name...> [--global] Remove skills
  update [--global]           Update all installed skills
  list [--global]             List available skills`);
}
