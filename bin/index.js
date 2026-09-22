#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prompts from "prompts";
import pc from "picocolors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.resolve(__dirname, "../template");

const DEPENDENCIES = [
  "cva@beta",
  "tailwind-merge@latest",
  "@base-ui/react@latest",
  "lucide-react@latest",
];

const DEV_DEPENDENCIES = [
  "prettier@latest",
  "prettier-plugin-tailwindcss@latest",
  "prettier-plugin-organize-imports@latest",
];

const SCRIPTS = {
  format: "prettier --write .",
  typecheck: "tsc --noEmit",
};

async function main() {
  console.log(pc.bold(`\n  F5 Media Next.js starter\n`));

  let target = process.argv[2];

  if (!target) {
    const res = await prompts({
      type: "text",
      name: "target",
      message: "Project name",
      initial: "my-app",
    });
    target = res.target;
  }

  if (!target) process.exit(1);

  const root = path.resolve(process.cwd(), target);

  if (fs.existsSync(root) && fs.readdirSync(root).length > 0) {
    fail(`Directory "${target}" already exists and is not empty.`);
  }

  step("Scaffolding Next.js (latest)");
  run(
    [
      `pnpm create next-app ${JSON.stringify(target)}`,
      `--eslint --app --src-dir --use-pnpm --skip-install --disable-git --import-alias "~/*"`,
    ].join(" "),
    process.cwd(),
  );

  step("Applying template");
  copyTemplate(TEMPLATE_DIR, root);

  step("Patching package.json");
  patchPackageJson(root);

  step("Installing dependencies");
  run("pnpm install", root);
  run(`pnpm add ${DEPENDENCIES.join(" ")}`, root);
  run(`pnpm add -D ${DEV_DEPENDENCIES.join(" ")}`, root);

  step("Formatting");
  run("pnpm run format", root);

  step("Initialising git");
  run("git init -b main", root);
  run("git add -A", root);

  console.log(`${pc.green("Done.")}`);
}

/* ------------------------------------------------------------------ */

function copyTemplate(from, to) {
  fs.cpSync(from, to, { recursive: true });
}

function patchPackageJson(root) {
  const file = path.join(root, "package.json");
  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));

  pkg.scripts = { ...pkg.scripts, ...SCRIPTS };
  pkg.private = true;

  fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
}

function run(command, cwd) {
  execSync(command, { cwd, stdio: "inherit" });
}

function step(label) {
  console.log(`\n${pc.cyan("›")} ${label}`);
}

function fail(message) {
  console.error(`\n${pc.red("✗")} ${message}\n`);
  process.exit(1);
}

main().catch((error) => fail(error.message));
