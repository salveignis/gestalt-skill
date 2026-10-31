#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const source = join(root, 'skills', 'gestalt');
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const MARKER = '.gestalt-install.json';

// claude: .claude/skills. codex: .agents/skills. cursor reads both, plus its own.
const PROVIDERS = {
  claude: { project: '.claude/skills', global: join(homedir(), '.claude/skills'), detect: '.claude' },
  codex: { project: '.agents/skills', global: join(homedir(), '.agents/skills'), detect: '.agents' },
  cursor: { project: '.cursor/skills', global: join(homedir(), '.cursor/skills'), detect: '.cursor' },
};

const HELP = `gestalt-skill ${version}: Gestalt perception for web frontends

In your terminal:
  npx gestalt-skill install [--providers=claude,codex,cursor] [--global] [--force] [--dry-run]
  npx gestalt-skill update [--providers=...] [--global]
  npx gestalt-skill uninstall [--providers=...] [--global]
  npx gestalt-skill check [--global]
  npx gestalt-skill detect <url|file.html|dir> [options]
  npx gestalt-skill rules
  npx gestalt-skill help | --version

In your agent:
  /gestalt audit [target]     Find grouping and hierarchy problems, with evidence
  /gestalt generate [brief]   Build new UI from an explicit grouping plan
  /gestalt fix [target]       Repair findings and verify them
  /gestalt explain [topic]    Explain a principle and its evidence

Run "npx gestalt-skill detect --help" for detector options.`;

function parse(argv) {
  const flags = {};
  const rest = [];
  for (const arg of argv) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      flags[key] = value ?? true;
    } else rest.push(arg);
  }
  return { flags, rest };
}

function chooseProviders(flags) {
  if (typeof flags.providers === 'string') {
    const names = flags.providers.split(',').map((s) => s.trim()).filter(Boolean);
    const bad = names.filter((n) => !PROVIDERS[n]);
    if (bad.length) throw new Error(`Unknown provider: ${bad.join(', ')}. Known: ${Object.keys(PROVIDERS).join(', ')}`);
    return names;
  }
  const found = Object.keys(PROVIDERS).filter((n) => existsSync(flags.global ? join(homedir(), PROVIDERS[n].detect) : PROVIDERS[n].detect));
  return found.length ? found : ['claude', 'codex'];
}

const destination = (name, flags) => join(flags.global ? PROVIDERS[name].global : PROVIDERS[name].project, 'gestalt');

function install(flags, { replace = false } = {}) {
  let failed = false;
  for (const name of chooseProviders(flags)) {
    const dest = destination(name, flags);
    const shown = flags.global ? dest : relative(process.cwd(), dest);
    const exists = existsSync(dest);
    const managed = existsSync(join(dest, MARKER));
    if (exists && !managed && !flags.force) {
      console.error(`skip ${name}: ${shown} exists and was not installed by gestalt-skill. Use --force to replace it.`);
      failed = true;
      continue;
    }
    if (exists && !replace && !flags.force) {
      console.log(`skip ${name}: already installed at ${shown}. Use "update" to refresh it.`);
      continue;
    }
    if (flags['dry-run']) { console.log(`would install ${name}: ${shown}`); continue; }
    if (exists) rmSync(dest, { recursive: true, force: true });
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(source, dest, { recursive: true });
    writeFileSync(join(dest, MARKER), `${JSON.stringify({ version })}\n`);
    console.log(`installed ${name}: ${shown}`);
  }
  return failed ? 1 : 0;
}

function uninstall(flags) {
  let failed = false;
  const names = typeof flags.providers === 'string' ? chooseProviders(flags) : Object.keys(PROVIDERS);
  for (const name of names) {
    const dest = destination(name, flags);
    if (!existsSync(dest)) continue;
    if (!existsSync(join(dest, MARKER))) {
      console.error(`skip ${name}: ${dest} was not installed by gestalt-skill.`);
      failed = true;
      continue;
    }
    rmSync(dest, { recursive: true, force: true });
    console.log(`removed ${name}: ${dest}`);
  }
  return failed ? 1 : 0;
}

function check(flags) {
  let any = false;
  for (const name of Object.keys(PROVIDERS)) {
    const dest = destination(name, flags);
    if (!existsSync(dest)) continue;
    any = true;
    const marker = join(dest, MARKER);
    const installed = existsSync(marker) ? JSON.parse(readFileSync(marker, 'utf8')).version : 'unmanaged';
    console.log(`${name}: ${installed}${installed === version ? ' (current)' : ` (this package: ${version})`}  ${dest}`);
  }
  if (!any) console.log('Not installed here. Run: npx gestalt-skill install');
  return 0;
}

async function main(argv) {
  const [command, ...rest] = argv;
  if (!command || command === 'help' || command === '--help' || command === '-h') { console.log(HELP); return 0; }
  if (command === '--version' || command === '-v') { console.log(version); return 0; }
  if (['audit', 'generate', 'fix', 'explain'].includes(command)) {
    console.error(`"${command}" runs inside your agent. Type: /gestalt ${command}\nFor the terminal detector, use: npx gestalt-skill detect <target>`);
    return 1;
  }
  if (command === 'detect' || command === 'rules') {
    if (Number(process.versions.node.split('.')[0]) < 22) { console.error('The detector needs Node 22 or newer.'); return 1; }
    const { runDetect } = await import('../../skills/gestalt/scripts/detect.mjs');
    return runDetect(command === 'rules' ? ['--list-rules'] : rest);
  }
  const { flags } = parse(rest);
  if (command === 'install') return install(flags);
  if (command === 'update') return install(flags, { replace: true });
  if (command === 'uninstall') return uninstall(flags);
  if (command === 'check') return check(flags);
  console.error(`Unknown command: ${command}\n\n${HELP}`);
  return 1;
}

try {
  process.exitCode = await main(process.argv.slice(2));
} catch (error) {
  console.error(`gestalt-skill: ${error.message}`);
  process.exitCode = 1;
}
