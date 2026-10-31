# Packaging an agent skill as an npm package with `npx <name>` and its own sub-commands (state as of 2026-10-30)

Fast-moving warning: `npx skills` 1.7.4, Claude Code 2.1.309 (the version installed locally), and impeccable 4.8.0 were the versions observed on 2026-10-30. Harness paths change often. Impeccable's own capability file warns that it is "point-in-time" ([docs/HARNESSES.md](https://github.com/pbakaus/impeccable/blob/main/docs/HARNESSES.md)).

## What do the Agent Skills spec and the Claude Code docs require?

### Takeaway
Write `SKILL.md` to the strict open-spec subset (`name`, `description`, plus optional `license`, `compatibility`, `metadata`). Add Claude-only frontmatter through a per-harness build step, or accept that other harnesses may ignore or reject it. Claude Code has merged commands into skills, so one skill can act as a command with sub-commands.

### Cited Findings
**Open spec**
- A skill is a directory with a required `SKILL.md`, and optional `scripts/`, `references/`, `assets/` and any other files — [Spec](https://agentskills.io/specification)
- `name`: 1-64 characters, `a-z 0-9 -` only, no leading, trailing or consecutive hyphens, and it must match the parent directory — [Spec](https://agentskills.io/specification)
- `description`: 1-1024 characters, stating what the skill does and when to use it — [Spec](https://agentskills.io/specification)
- `compatibility`: max 500 characters. `metadata`: a string-to-string map. `license`: free text. `allowed-tools`: a space-separated string, marked experimental, with support varying by agent — [Spec](https://agentskills.io/specification)
- Progressive disclosure: about 100 tokens of metadata at startup, a body under 5000 tokens (recommended) on activation, resources on demand. Keep `SKILL.md` under 500 lines and file references one level deep — [Spec](https://agentskills.io/specification)
- Validation command: `skills-ref validate ./my-skill` — [Spec](https://agentskills.io/specification)
- The reference library is Python-installed (`pip install -e .` or `uv sync`) and is labelled "for demonstration purposes only", not for production. It also offers `read-properties` and `to-prompt` — [skills-ref README](https://github.com/agentskills/agentskills/blob/main/skills-ref/README.md)
- An npm package named `skills-ref` exists (0.1.5, bin `skills-ref`, last modified 2025-12-27) — [npm registry](https://registry.npmjs.org/skills-ref)

**Claude Code**
- Locations: enterprise managed, `~/.claude/skills/<name>/SKILL.md`, `.claude/skills/<name>/SKILL.md`, nested `<subdir>/.claude/skills/`, `--add-dir`, and plugin `<plugin>/skills/<name>/SKILL.md`. Precedence is enterprise, then personal, then project; plugin skills are namespaced `/plugin-name:skill-name` — [Claude Code skills](https://code.claude.com/docs/en/skills)
- Commands and skills are merged: `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy`, and old command files keep working — [Claude Code skills](https://code.claude.com/docs/en/skills)
- Frontmatter accepted: `name`, `description`, `when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `disallowed-tools`, `model`, `effort`, `context`, `agent`, `background`, `hooks`, `paths`, `shell`, and `metadata`/`license`/`compatibility` (accepted but not acted on). Unrecognized fields are silently ignored — [Claude Code skills](https://code.claude.com/docs/en/skills)
- `description` plus `when_to_use` is truncated at 1,536 characters in the listing — [Claude Code skills](https://code.claude.com/docs/en/skills)
- Arguments: `$ARGUMENTS` (if no placeholder receives them, Claude Code appends `ARGUMENTS: <value>`), `$ARGUMENTS[N]` or `$N` (0-based), `$name` (declared in `arguments`), and `\$` as an escape — [Claude Code skills](https://code.claude.com/docs/en/skills)
- `allowed-tools` grants permission only for the invoking turn and does not restrict other tools, e.g. `Bash(git add *) Bash(git status *)` — [Claude Code skills](https://code.claude.com/docs/en/skills)
- `disable-model-invocation: true` makes a skill user-only. `user-invocable: false` makes it Claude-only — [Claude Code skills](https://code.claude.com/docs/en/skills)
- `${CLAUDE_SKILL_DIR}` expands to the skill's directory, including inside `allowed-tools`. `` !`command` `` injects command output before the model sees the skill, and a failing command aborts the invocation. Admins can disable this with `disableSkillShellExecution` — [Claude Code skills](https://code.claude.com/docs/en/skills)

**Plugins and marketplaces**
- `plugin.json` lives at `.claude-plugin/plugin.json`, is optional, and `name` is its only required key. All other components stay at the plugin root, not inside `.claude-plugin/` — [Manifest reference](https://code.claude.com/docs/en/plugins-reference)
- Default layout: `skills/`, `commands/` (prefer `skills/` for new plugins), `agents/`, `hooks/hooks.json`, `.mcp.json`, `.lsp.json`, `output-styles/`, `workflows/`, `themes/`, `monitors/monitors.json`, `bin/`, `settings.json`. A plugin with a root `SKILL.md`, no `skills/` and no `skills` key loads as a single skill — [Manifest reference](https://code.claude.com/docs/en/plugins-reference)
- **Collision trap:** a plugin's top-level `bin/` goes on the Bash tool's `PATH`, and claude.ai and Cowork do not install a plugin that has this directory — [Manifest reference](https://code.claude.com/docs/en/plugins-reference)
- `skills` in the manifest adds to the default scan; `commands`, `agents` and others replace theirs. Paths must start with `./` and stay inside the plugin root — [Manifest reference](https://code.claude.com/docs/en/plugins-reference)
- `${CLAUDE_PLUGIN_ROOT}` changes with each version, so durable state belongs in `${CLAUDE_PLUGIN_DATA}`. These variables are not present in the environment of Bash-tool commands, so write the `${...}` reference in the Markdown body, where it is substituted inline — [Manifest reference](https://code.claude.com/docs/en/plugins-reference)
- Plugin names starting with `claude-`, `anthropic-`, `anthropics-` or `cc-plugin-` are validation errors — [Manifest reference](https://code.claude.com/docs/en/plugins-reference)
- `marketplace.json` lives at `.claude-plugin/marketplace.json` and requires `name`, `owner`, `plugins`. Each entry needs `name` and `source` — [Create a marketplace](https://code.claude.com/docs/en/plugin-marketplaces)
- Commands: `claude plugin validate ./path` (`--strict` in CI), `claude plugin marketplace add <owner>/<repo>`, `claude plugin install <plugin>@<marketplace>`, `claude plugin list`, `claude plugin details <name>` — [Create a marketplace](https://code.claude.com/docs/en/plugin-marketplaces); [Manifest reference](https://code.claude.com/docs/en/plugins-reference)
- Plugin source types: relative path, `github`, `url`, `git-subdir`, `npm`, `archive`, `command` — [Marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference.md)
- An `npm` plugin source takes `package`, `version`, `registry`. Install scripts never run during the fetch. An `npm` *marketplace* source fails with `NPM marketplace sources not yet implemented` — [Marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference.md)
- With an `npm` source and no `version` field the computed version is `unknown`. Use `npm-shrinkwrap.json` because npm excludes `package-lock.json` from published packages. Dependency installs run with `--ignore-scripts` and a 60-second timeout — [Plugin loading](https://code.claude.com/docs/en/plugins/loading.md)
- A manifest `version` pins users until the string changes. Auto-update defaults to off for third-party marketplaces — [Plugin loading](https://code.claude.com/docs/en/plugins/loading.md)
- Reserved marketplace names include `agent-skills`, `claude-plugins-official`, `npm`, `github` and others — [Marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference.md)

### Inferences
- Use a description of 1024 characters or fewer (the spec's limit is stricter than Claude's 1,536).
- `disable-model-invocation: true` is wrong for a skill that should also trigger on natural language. Leave it unset for the main router skill.
- A plugin install yields a namespaced command such as `/gestalt:gestalt`, while a directory install yields `/gestalt`. Docs and examples must account for both.

### Gaps
- `skills-ref` was not run: this session's permission system blocked `npx --yes skills-ref@0.1.5`. The relationship between the npm `skills-ref` package and the Python reference library was not established.
- `argument-hint` and `$ARGUMENTS` support outside Claude Code was not checked harness by harness.

## How does `npx skills` (vercel-labs/skills, skills.sh) install skills?

### Takeaway
`npx skills add` installs from git, URL or local sources, not by npm package name. It symlinks by default from a canonical copy into agent directories. It is a free second distribution channel if the repo uses `skills/<name>/SKILL.md`, but it requires Node 22.20+.

### Cited Findings
- Package `skills` 1.7.4, bins `skills` and `add-skill`, dependencies `tar` and `yaml`, engines `>=22.20.0` — [npm registry](https://registry.npmjs.org/skills)
- Supports "OpenCode, Claude Code, Codex, Cursor, and 75 more" — [README](https://github.com/vercel-labs/skills/blob/main/README.md)
- Commands: `add`, `find`, `list`, `use <source>@<skill>`, `check` (exit 1 when updates exist), `update`, `remove`, `init` — [README](https://github.com/vercel-labs/skills/blob/main/README.md); [commands.md](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)
- Sources: `owner/repo`, GitHub tree URLs, GitLab, Azure Repos, any git URL, local paths, and a direct `SKILL.md` or archive URL — [commands.md](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)
- Flags: `-g/--global`, `-a/--agent`, `-s/--skill`, `-l/--list`, `--copy`, `-y/--yes`, `--all` — [commands.md](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)
- Non-interactive example: `npx skills add vercel-labs/agent-skills --skill frontend-design -g -a claude-code -y` — [commands.md](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)
- Symlink (recommended) points each agent at a canonical copy. Copy is for cases where symlinks aren't supported — [commands.md](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)
- Discovery covers a root `SKILL.md`, `skills/` (up to three levels deep), `skills/.curated/`, `.claude/skills/`, `.agents/skills/` and many agent directories — [creating-skills.md](https://github.com/vercel-labs/skills/blob/main/docs/creating-skills.md)
- `.claude-plugin/marketplace.json` and `plugin.json` skill declarations are also discovered — [creating-skills.md](https://github.com/vercel-labs/skills/blob/main/docs/creating-skills.md)
- `metadata.internal: true` hides a skill unless `INSTALL_INTERNAL_SKILLS=1` is set — [creating-skills.md](https://github.com/vercel-labs/skills/blob/main/docs/creating-skills.md)
- Experimental: `npx skills experimental_sync` reads installed npm dependencies and discovers a root `SKILL.md`, `skills/<name>/SKILL.md` or `dist/skills/<name>/SKILL.md`, then links them into `.agents/skills/` and selected agents. Names and behaviour may change — [commands.md](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)
- Anonymous telemetry is on by default. `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1` disables telemetry and security-audit requests — [README](https://github.com/vercel-labs/skills/blob/main/README.md)

### Inferences
- A `skills/<name>/SKILL.md` layout satisfies `npx skills add owner/repo`, `experimental_sync`, and the Claude plugin default scan all at once.
- Do not depend on `npx skills` as the only installer, since its Node floor is higher than the floor a custom zero-dependency CLI can offer (impeccable declares `>=18.19.0`).

### Gaps
- skills.sh ranking and audit mechanics were not investigated.
- `experimental_sync` is explicitly unstable, so do not document it as the primary path.

## How do real skills with sub-commands and CLIs work?

### Takeaway
Two idioms dominate. A single router skill with `reference/<command>.md` (impeccable) gives one menu entry with many sub-commands. Many separate skills (superpowers) give many triggers. Terminal CLI verbs (install, detect) are a different surface from in-agent commands (`/impeccable audit`), and impeccable keeps them explicitly separate.

### Cited Findings
**pbakaus/impeccable** (about 96k stars, Apache-2.0, npm 4.8.0)
- `bin: {"impeccable": "cli/bin/cli.js"}`, `files: ["cli/bin/", "skill/scripts/engine-checksums.txt", "LICENSE"]`, no `dependencies`, and five `optionalDependencies` `@impeccable/cli-<os>-<arch>` — [package.json](https://github.com/pbakaus/impeccable/blob/main/package.json)
- The tarball holds 7 files and about 60 KB — [npm registry](https://registry.npmjs.org/impeccable)
- `cli/bin/cli.js` (116 lines, Node built-ins only) is a shim. It resolves `$IMPECCABLE_BIN`, then the platform optional dependency, then the `~/.impeccable/bin/<version>/` cache, then a GitHub Releases download. It fails closed on a missing or mismatched SHA-256 from `engine-checksums.txt`, then `spawnSync`s the binary with argv — [cli.js](https://github.com/pbakaus/impeccable/blob/main/cli/bin/cli.js)
- Terminal verbs: `npx impeccable install`, `install -y --providers=claude,codex --scope=project`, `update`, `install --no-hooks`, `link --source=.impeccable --providers=claude,cursor`, `help`, `detect src/`, `detect https://example.com`, `detect --json`, `detect --github`, `detect --list-rules` — [README.npm.md](https://github.com/pbakaus/impeccable/blob/main/README.npm.md)
- Detector exit codes: `2` means findings, `1` means a target could not be scanned. URL scans use the installed Chrome or Edge — [README](https://github.com/pbakaus/impeccable/blob/main/README.md)
- `playwright` and `puppeteer` are dev dependencies only — [package.json](https://github.com/pbakaus/impeccable/blob/main/package.json)
- As recorded in the contract, the CLI rejects agent-only verbs with guidance: `"init" is not a CLI command. Type /impeccable init in your AI coding agent's chat...`. That section's snapshot is v3.6.0 (2026-08-17), before the Rust engine swap — [CLI-CONTRACT.md](https://github.com/pbakaus/impeccable/blob/main/docs/CLI-CONTRACT.md)
- Source of truth: `skill/SKILL.src.md`, `skill/reference/*.md` (e.g. `audit.md`, `generate.md`, plus `audit.native.md` variants), `skill/scripts/`, `skill/agents/`. `{{scripts_path}}`, `{{command_prefix}}` and `{{command_hint}}` placeholders are filled at build — [SKILL.src.md](https://github.com/pbakaus/impeccable/blob/main/skill/SKILL.src.md)
- Routing is a Commands table mapping each command to a reference file, plus prose rules: no argument means read `reference/routing.md` and show a menu, never auto-run; an explicit or clearly implied command means load its reference; otherwise treat as general design work — [SKILL.src.md](https://github.com/pbakaus/impeccable/blob/main/skill/SKILL.src.md)
- `plugin.json` advertises "1 skill with 24 commands" — [plugin.json](https://github.com/pbakaus/impeccable/blob/main/.claude-plugin/plugin.json)
- `impeccable pin <pin|unpin> <command>` creates or removes a standalone shortcut — [SKILL.src.md](https://github.com/pbakaus/impeccable/blob/main/skill/SKILL.src.md)
- Per-harness bundling: `scripts/lib/transformers/providers.js` sets, for each provider, `configDir`, `providerTags` (keeps blocks like `<codex>...</codex>`), `frontmatterFields`, agent format and hooks manifest. Claude keeps `user-invocable`, `argument-hint`, `license`, `compatibility`, `metadata`; Codex and Gemini emit none of the optional fields — [providers.js](https://github.com/pbakaus/impeccable/blob/main/scripts/lib/transformers/providers.js)
- Comments there state "Codex's validator rejects unknown top-level keys" (version goes under `metadata`, and it writes OpenAI metadata), and `allowed-tools` is omitted for Claude because of an activation failure in non-interactive sessions — [providers.js](https://github.com/pbakaus/impeccable/blob/main/scripts/lib/transformers/providers.js); [issue #736](https://github.com/pbakaus/impeccable/issues/736) (closed)
- The repo also commits per-harness output (`.claude/skills/impeccable`, `.cursor/skills/impeccable`, `.agents/skills/impeccable`, `plugin/`, and others) and marketplace files with source `./plugin` — [repo tree](https://github.com/pbakaus/impeccable); [marketplace.json](https://github.com/pbakaus/impeccable/blob/main/.claude-plugin/marketplace.json)
- `prepack` swaps `README.npm.md` in for `README.md`, and `postpack` restores it — [package.json](https://github.com/pbakaus/impeccable/blob/main/package.json)
- The skill fetches visual directions from the impeccable.style catalog, and turning telemetry off does not stop that fetch — [README](https://github.com/pbakaus/impeccable/blob/main/README.md)

**obra/superpowers** (about 309k stars, 7.0.1)
- A library of 15 separate skills (`brainstorming`, `systematic-debugging`, ...) with no `commands/` directory. `package.json` has no `bin` — [repo](https://github.com/obra/superpowers); [package.json](https://github.com/obra/superpowers/blob/main/package.json)
- One repo ships a manifest per harness: `.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`, `.antigravity-plugin/`, `.devin-plugin/`, `.kimi-plugin/`, `gemini-extension.json`, `.opencode/plugins/`, `.pi/extensions/`. "Installation differs by harness." — [repo](https://github.com/obra/superpowers); [README](https://github.com/obra/superpowers/blob/main/README.md)
- Install examples: `/plugin install superpowers@claude-plugins-official`, `/add-plugin superpowers` (Cursor), `/plugins` (Codex CLI) — [README](https://github.com/obra/superpowers/blob/main/README.md)
- The npm name `superpowers` is an unrelated 2022 placeholder (0.0.2, "TODO: description") — [npm registry](https://registry.npmjs.org/superpowers)

**anthropics/skills** (about 185k stars)
- No npm CLI. `/plugin marketplace add anthropics/skills`, then `/plugin install document-skills@anthropic-agent-skills` — [README](https://github.com/anthropics/skills/blob/main/README.md)
- Uses `"source": "./"`, `"strict": false` with `skills` arrays to slice one repo into several plugins — [marketplace.json](https://github.com/anthropics/skills/blob/main/.claude-plugin/marketplace.json)

**nextlevelbuilder/ui-ux-pro-max-skill** (about 143k stars)
- `bin: {"uipro": "dist/index.js"}`, `files: ["dist", "assets"]`, dependencies `chalk`, `commander`, `ora`, `prompts`; package name in repo is `ui-ux-pro-max-cli` 2.5.0 — [cli/package.json](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/package.json)
- Conflicting signal: npm `uipro-cli` is at 2.2.3, last modified 2026-01-29 — [npm registry](https://registry.npmjs.org/uipro-cli)
- Verbs are installer-only: `init` (`--ai`, `--force`, `--offline`, `--global`, `--token`, `--dry-run`), `versions`, `update`, `uninstall` — [cli/src/index.ts](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/src/index.ts)
- Each harness is a JSON template (`cli/assets/templates/platforms/<ai>.json`) with `folderStructure.root`, `skillPath`, `filename`, frontmatter and sections, rendered with a shared base. Claude root is `.claude`, Codex `.agents`, Cursor `.cursor` — [claude.json](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/assets/templates/platforms/claude.json); [codex.json](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/assets/templates/platforms/codex.json); [cursor.json](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/assets/templates/platforms/cursor.json)
- The skill's engine is `skills/ui-ux-pro-max/scripts/search.py`, meaning a Python script at runtime — [claude.json](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/assets/templates/platforms/claude.json)

**shadcn** (npm 4.23.0, provenance present)
- The product CLI is separate from the skill, and `skills/shadcn/SKILL.md` wraps it. The skill sets `user-invocable: false`, pre-approves `Bash(npx shadcn@latest *)`, and injects live context with `` !`npx shadcn@latest info --json` `` — [SKILL.md](https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/SKILL.md)
- Its `allowed-tools` is comma-separated, unlike the spec's space-separated form — [SKILL.md](https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/SKILL.md); [Spec](https://agentskills.io/specification)
- It has 30+ runtime dependencies, so it is a counter-example to zero-dependency — [npm registry](https://registry.npmjs.org/shadcn)

**get-shit-done-cc** (1.42.3)
- Multiple bins: `get-shit-done-cc` (`bin/install.js`), `gsd-sdk`, `gsd-tools`. 1,414 files and about 10 MB — [npm registry](https://registry.npmjs.org/get-shit-done-cc)

### Inferences
- For a sub-command skill such as `audit|generate|fix`, the router pattern is the best fit: one description in the startup listing, and each command's detail costs nothing until loaded.
- Routing by a prose table rather than `$ARGUMENTS` substitution is more portable. Impeccable's `SKILL.src.md` routing, in the portion read, is written as instructions to the model.
- Deterministic work (rule scanning, install, update) belongs in the CLI. Judgment work belongs in `reference/*.md`.
- A Rust engine is optional complexity. A pure Node CLI suits a small detector.

### Gaps
- Where `impeccable install` gets the skill payload was not traced. The tarball has no skill files, and `crates/bundle` and `crates/skills` suggest the binary carries or fetches it, unconfirmed.
- Current `npx impeccable` no-argument behaviour was not run (only the older contract was read).
- npm status of `ui-ux-pro-max-cli` was not checked; the README uses `npm install -g ui-ux-pro-max-cli`.
- The GSD README was not retrieved; only registry data is cited.
- Issue #736's resolution and whether Claude Code's `allowed-tools` behaviour under `claude -p` still holds were not verified; only the opening of the issue was read.

## Where do skills install, per agent?

### Takeaway
Target `.claude/skills/` and `.agents/skills/` as the first two destinations; together they cover Claude Code, Codex and Cursor. Claude Code's documented locations do not include `.agents/skills`, so a `.agents`-only install misses it.

### Cited Findings
| Agent | Project | User | Source |
|---|---|---|---|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` | [Claude docs](https://code.claude.com/docs/en/skills) |
| Codex | `$CWD/.agents/skills`, parent, `$REPO_ROOT/.agents/skills` | `$HOME/.agents/skills`; admin `/etc/codex/skills` | [OpenAI docs](https://learn.chatgpt.com/docs/build-skills) |
| Cursor | `.agents/skills/`, `.cursor/skills/`; compat `.claude/skills/`, `.codex/skills/` | `~/.agents/skills/`, `~/.cursor/skills/`; compat `~/.claude/skills/`, `~/.codex/skills/` | [Cursor docs](https://cursor.com/docs/skills) |
| Gemini CLI | `.agents/skills/` | `~/.gemini/skills/` | [vercel agents.md](https://github.com/vercel-labs/skills/blob/main/docs/agents.md) (not vendor docs) |
| GitHub Copilot | `.agents/skills/` per vercel; impeccable maps to `.github` | `~/.copilot/skills/` | [vercel agents.md](https://github.com/vercel-labs/skills/blob/main/docs/agents.md); [providers.rs](https://github.com/pbakaus/impeccable/blob/main/crates/skills/src/providers.rs) |
| OpenCode | `.agents/skills/` per vercel; impeccable uses `.opencode` | `~/.config/opencode/skills/` | [vercel agents.md](https://github.com/vercel-labs/skills/blob/main/docs/agents.md); [providers.rs](https://github.com/pbakaus/impeccable/blob/main/crates/skills/src/providers.rs) |
| Windsurf | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` | [vercel agents.md](https://github.com/vercel-labs/skills/blob/main/docs/agents.md) |

- Codex: the current page lists only `.agents/skills`, not `.codex/skills`, as a discovery path. It follows symlinks, and duplicate names are not merged — [OpenAI docs](https://learn.chatgpt.com/docs/build-skills)
- Codex invocation is `/skills` or a `$` mention, or implicit from the description. Optional `agents/openai.yaml` sets UI metadata, tool dependencies and `policy.allow_implicit_invocation` — [OpenAI docs](https://learn.chatgpt.com/docs/build-skills)
- Cursor frontmatter: `name` (must match folder), `description`, `paths`, `disable-model-invocation`, `icon`, `color`, `metadata`. Invocation is `/skill-name` — [Cursor docs](https://cursor.com/docs/skills)
- Cursor 2.4+ `/migrate-to-skills` converts dynamic rules and slash commands to skills. Rules with `alwaysApply: true` or specific `globs` are not migrated, so `.cursor/rules` remains a separate mechanism — [Cursor docs](https://cursor.com/docs/skills)
- Impeccable maps `codex` and `replit` to `.agents`, `antigravity` to `.agent`, and `copilot` to `.github` — [providers.rs](https://github.com/pbakaus/impeccable/blob/main/crates/skills/src/providers.rs)
- `npx skills` makes `.agents/skills/` the shared location and creates links under `.claude/skills/` for Claude Code — [commands.md](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)

### Inferences
- Default `install`: write a real copy to `.agents/skills/<name>` and a copy or symlink to `.claude/skills/<name>`. Use copies when symlink creation fails.
- Installing to both may make Cursor see duplicates, because it reads both directories. Treat duplicate handling as something to test.
- Do not write a new install to `.codex/skills`; Codex's current page does not list it.

### Gaps
- Vendor docs for Gemini CLI, Copilot, OpenCode and Windsurf were not fetched. The table relies on vercel's table and impeccable's source, and they disagree on Copilot and OpenCode. A web search returned only third-party pages, including one claiming Windsurf uses `.windsurf/rules/`. Vendor URLs to check are listed in [HARNESSES.md](https://github.com/pbakaus/impeccable/blob/main/docs/HARNESSES.md).
- Cursor duplicate-skill behaviour was not documented on the page read.

## What Node CLI, publishing and security practices apply?

### Takeaway
Ship a small zero-dependency ESM CLI with an explicit `files` allowlist and no install scripts. Publish through trusted publishing with provenance, and treat every installed skill as a supply-chain artifact. Keep browser automation optional.

### Cited Findings
**npx and package.json**
- npx picks the executable as follows: a single `bin` entry (or aliases of one command) runs; with several, the one matching the unscoped package name runs; otherwise it errors. `--package` runs another bin, e.g. `npx --package=foo bar` — [npx docs](https://docs.npmjs.com/cli/v11/commands/npx)
- npx prompts before installing a non-local package. `-y/--yes` suppresses the prompt. Flags must come before positional arguments; anything after the package name goes to the command — [npx docs](https://docs.npmjs.com/cli/v11/commands/npx)
- An unversioned name matches the version in the local project, if present — [npx docs](https://docs.npmjs.com/cli/v11/commands/npx)
- `bin` files must start with `#!/usr/bin/env node` — [package.json docs](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
- `files` defaults to `["*"]`. `package.json`, README, LICENSE, `main` and `bin` files are always included. `.git`, `.npmrc`, `node_modules` and lockfiles other than shrinkwrap can't be force-included — [package.json docs](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
- `engines` is advisory unless `engine-strict` is set — [package.json docs](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
- Optional peers: mark them in `peerDependenciesMeta`, and npm won't auto-install them. `optionalDependencies` failures don't fail the install, and the program must handle absence — [package.json docs](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)

**Publishing**
- Trusted publishing needs npm CLI 11.5.1+ and Node 22.14.0+, with GitHub Actions (GitHub-hosted), GitLab.com shared runners or CircleCI cloud. Self-hosted runners are unsupported — [Trusted publishers](https://docs.npmjs.com/trusted-publishers)
- A minimal workflow sets `permissions: id-token: write, contents: read`, then runs `actions/checkout@v6`, `actions/setup-node@v6` (Node 24, registry URL), `npm ci`, `npm publish` — [Trusted publishers](https://docs.npmjs.com/trusted-publishers)
- Provenance is automatic for GitHub Actions and GitLab, not CircleCI, and requires a public source repo and public package. `repository.url` must match exactly. A new configuration expires unless first used within 2 days — [Trusted publishers](https://docs.npmjs.com/trusted-publishers)
- After it works, the docs recommend "Require two-factor authentication and disallow tokens", optionally only `npm stage publish`, and revoking old tokens — [Trusted publishers](https://docs.npmjs.com/trusted-publishers)
- Without trusted publishing: `npm publish --provenance --access public`, with `id-token: write` and a hosted runner — [Provenance docs](https://docs.npmjs.com/generating-provenance-statements)
- Observed on 2026-10-30: `skills` and `shadcn` have SLSA provenance attestations. `impeccable` and `uipro-cli` do not show any and were published by personal accounts — [npm registry: skills](https://registry.npmjs.org/skills); [shadcn](https://registry.npmjs.org/shadcn); [impeccable](https://registry.npmjs.org/impeccable); [uipro-cli](https://registry.npmjs.org/uipro-cli)

**Security**
- Snyk's ToxicSkills audit (3,984 skills from ClawHub and skills.sh, as of 2026-02-05): 1,467 (36.82%) with a flaw, 534 (13.4%) critical, 76 confirmed malicious, 91% of those combining prompt injection with malicious code. This is a vendor study, and vendor-promoted — [Snyk](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)
- Snyk's advice: audit with `uvx mcp-scan@latest --skills`, beware `curl | bash`, password-protected archives and remote instruction loading, and threat-model fetched third-party content — [Snyk](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)
- Impeccable's pattern is to pin SHA-256 digests in the package, fail closed before any request when no digest exists, write atomically via a temp file and rename, and never trust a checksum published beside the binary — [cli.js](https://github.com/pbakaus/impeccable/blob/main/cli/bin/cli.js); [launcher](https://github.com/pbakaus/impeccable/blob/main/skill/scripts/impeccable)
- Project-scope plugins load only after a trust check, and their MCP servers go through per-server approval — [Plugin loading](https://code.claude.com/docs/en/plugins/loading.md)
- A failing `` !`command` `` aborts the whole skill invocation, and it runs before the model sees the skill — [Claude Code skills](https://code.claude.com/docs/en/skills)
- Plugin validation warns on a header value that looks like a literal credential — [Manifest reference](https://code.claude.com/docs/en/plugins-reference)

### Inferences
- Avoid `postinstall`: Claude's npm source never runs it, and it adds risk. All setup should happen in an explicit `install` verb.
- Avoid `` !`npx <name>...` `` injection unless the version is pinned, because a network fetch runs before each activation and failure aborts the skill.
- Add a runtime Node version check, since `engines` is only advisory.
- If rendered-page checks are needed, either detect an installed Chrome as impeccable does, or make `playwright` an optional peer and import it lazily with a clear message when absent. A hard dependency would make every `npx` run far heavier.
- Skills should state any network access in `compatibility` and in the README, and offer an opt-out.
- Do not put secrets in `userConfig` references inside skill text; sensitive values become placeholders there.

### Gaps
- Whether a package must already exist before configuring a trusted publisher was not confirmed on the page read. Plan for a possible manual first publish.
- No independent replication of Snyk's numbers was found.
- `npx` behaviour in non-interactive CI beyond `--yes`/`--no` is not described in the docs.

## What is the concrete blueprint?

### Takeaway
One repo, one npm package: a zero-dependency CLI at `cli/bin/` that copies a single router skill from `skills/<name>/` into each harness directory, plus Claude marketplace files and a per-harness frontmatter step. Terminal verbs handle install and deterministic scanning. `reference/<command>.md` handles agent sub-commands.

### Cited Findings
- Local smoke test (2026-10-30, npm 11.19.1, Node 26.10.0, Claude Code 2.1.309), using a throwaway package I wrote: `npm pack --dry-run` listed exactly the 5 expected files. `npx --yes --package=./demo-gestalt-probe-0.0.1.tgz demo-gestalt-probe install` wrote `.claude/skills/gestalt/SKILL.md` and `reference/audit.md`. `npx --yes ./demo-gestalt-probe-0.0.1.tgz` also resolved the single bin. `claude plugin validate ./proto` reported `Validation passed with warnings` (warning text was not captured) — local test, not an external source
- `gestalt` on npm is taken (Pinterest's React UI components, 177.0.12) — [npm registry](https://registry.npmjs.org/gestalt)
- `gestalt-skill` and `gestalt-ui` returned 404 on 2026-10-30, meaning apparently free, though npm's name-similarity rules at publish time were not tested — [gestalt-skill](https://registry.npmjs.org/gestalt-skill); [gestalt-ui](https://registry.npmjs.org/gestalt-ui)

### Inferences
Everything below is my synthesis of the findings above. The exact CLI flags are a proposed design, not an existing tool's flags. Only the npm, `claude plugin` and `npx skills` commands are real, verified commands.

**Repo layout**
```text
gestalt-skill/
├── package.json
├── README.md / README.npm.md
├── LICENSE
├── cli/bin/cli.mjs            # not top-level bin/: that trips the Claude plugin bin/ rule
├── cli/lib/{install,detect,harnesses}.mjs
├── skills/gestalt/            # source of truth, also what npx skills discovers
│   ├── SKILL.md
│   ├── reference/{audit,generate,fix,routing}.md
│   └── scripts/               # optional, self-contained
├── .claude-plugin/{plugin.json,marketplace.json}
└── .github/workflows/publish.yml
```

**package.json**
```json
{
  "name": "gestalt-skill",
  "version": "0.1.0",
  "type": "module",
  "bin": { "gestalt-skill": "cli/bin/cli.mjs" },
  "files": ["cli/", "skills/", ".claude-plugin/"],
  "engines": { "node": ">=18.19" },
  "repository": { "type": "git", "url": "git+https://github.com/<owner>/gestalt-skill.git" },
  "license": "MIT",
  "peerDependencies": { "playwright": "*" },
  "peerDependenciesMeta": { "playwright": { "optional": true } }
}
```
Drop the peer entries if no rendered-page checks ship. A single `bin` whose name matches the package gives `npx gestalt-skill <verb>`.

**SKILL.md**
```markdown
---
name: gestalt
description: Audit, generate and fix web UI layouts with Gestalt principles (proximity, similarity, closure, continuity, figure-ground). Use when ... Not for ...
argument-hint: "[audit|generate|fix] [target]"
license: MIT
metadata:
  version: "0.1.0"
---
## Commands
| Command | Purpose | Reference |
| `audit [target]` | ... | [reference/audit.md](reference/audit.md) |
| `generate [brief]` | ... | [reference/generate.md](reference/generate.md) |
| `fix [target]` | ... | [reference/fix.md](reference/fix.md) |

## Routing
- No argument: read reference/routing.md and show a menu; do not auto-run.
- Command named or clearly implied: load only its reference and follow it.
- Otherwise: treat as general Gestalt guidance.
```
Keep this under 500 lines, with references one level deep. Strip `argument-hint` for Codex in the installer, or test whether its validator rejects it. Leave out `allowed-tools` at first, given issue #736 and the format disagreement between sources.

**CLI verbs (proposed)**
- `npx gestalt-skill install [--providers=claude,codex,cursor] [--scope=project|global] [--yes] [--dry-run]`
- `npx gestalt-skill update`, `uninstall`, `check`, `help`, `--version`
- `npx gestalt-skill detect <path> [--json]`, with exit `0` clean, `2` findings, `1` scan error (impeccable's convention)
- Agent-only names (`audit`, `generate`, `fix`) typed in a terminal print: "Run this inside your agent: /gestalt audit"

**Installer behaviour**
- Map destinations: `claude` to `.claude/skills/gestalt`, `codex` to `.agents/skills/gestalt`, `cursor` to `.cursor/skills/gestalt` or the shared `.agents/skills/gestalt`.
- For global scope use `~/.claude/skills`, `~/.agents/skills`, `~/.cursor/skills`.
- Resolve paths from `import.meta.url`. Use `fs.cpSync(..., {recursive:true})`, which is confirmed working in the smoke test.
- Detect harnesses by the presence of `.claude`, `.cursor` and similar, and prompt only when stdin is a TTY.
- Refuse to overwrite unmanaged files without `--force`. Write a small marker recording the version so `update` and `uninstall` are safe.

**Plugin channel**
- `plugin.json`: `{"name":"gestalt","version":"0.1.0","description":"...","license":"MIT"}`; the default `skills/` scan picks up the skill.
- `marketplace.json`: `{"name":"gestalt-skill","owner":{"name":"..."},"plugins":[{"name":"gestalt","source":"./"}]}`. Avoid reserved names, and bump `version` for every release so pinned users receive updates.

**Publish and test checklist**
1. `npm pack --dry-run` and inspect the list.
2. `npm pack`, then in an empty directory run `npx --yes --package=<abs>/x.tgz <bin> install`.
3. `claude plugin validate . --strict` and `skills-ref validate skills/gestalt`.
4. Test `claude --plugin-dir .` and `npx skills add ./ --list` (local source format), plus a real Codex and Cursor session.
5. Publish from GitHub Actions with trusted publishing, then enable "disallow tokens".
6. Check for the provenance attestation: `npm view gestalt-skill dist.attestations`.

**User-facing install matrix**
- Any harness: `npx gestalt-skill install`
- Claude Code plugin: `/plugin marketplace add <owner>/gestalt-skill`, then `/plugin install gestalt@gestalt-skill` (the command becomes `/gestalt:gestalt`)
- skills.sh route: `npx skills add <owner>/gestalt-skill`

**Sequencing recommendation**
Start with one router skill, a pure-Node CLI and Claude, Codex and Cursor only. Add a build step that transforms frontmatter per harness only when a harness actually rejects a field. Impeccable's Rust engine and 20+ provider targets are the result of long iteration, not a starting point.

### Gaps
- The blueprint as a whole has not been tested in a live Codex or Cursor session, or under `claude -p`.
- The smoke test did not cover Windows or `npx skills add` on the package.
- `skills-ref` validation was not run (blocked in this session).
- Whether Codex rejects `argument-hint` today rests only on a code comment in impeccable, not on OpenAI docs.
