---
name: design-for-agents
description: >
  Design skills, CLIs, docs, and onboarding flows for AI coding agents.
  Use when writing agent skills, authoring SKILL.md files, designing
  CLI tools agents will use, creating onboarding READMEs, or reviewing
  any artifact where the primary consumer is a coding agent.
  Do NOT use for general technical writing or user-facing documentation.
---

# Design for Agents

Principles for designing artifacts — skills, CLIs, documentation, onboarding — where the primary consumer is an AI coding agent.

These principles were refined through building and testing [Arize skills](https://github.com/Arize-ai/arize-skills), studying [evals-skills](https://github.com/hamelsmu/evals-skills), and running E2E tests that exposed where agents actually break.

## Core Principle

The agent is capable. It knows general programming, standard tools, and common concepts. It does NOT know your domain-specific CLI flags, data shapes, gotchas, and multi-step workflows. Write only what it can't figure out on its own.

---

## Writing Skills

### Write directives, not wisdom

The agent needs to be told what to do, not why.

Bad: "It's important to note that the Arrow Flight export path returns a different JSON shape than the REST path, which can cause confusion."

Good: "REST exports return nested JSON (`context.trace_id`). Flight exports (`--all`) return flat dot-separated keys (`context.trace_id`). Do not assume the same shape across both paths."

### Cut general knowledge

Only include information the agent wouldn't already know. It knows what traces, datasets, JSON, CSV, and Parquet are. It knows `jq`, Python, and shell scripting.

Cut:
- Definitions of standard concepts ("A trace is a tree of spans...")
- General prompt engineering advice
- Workflow motivation ("The typical flow is...")
- Framework comparisons or tool descriptions

Keep:
- Exact CLI syntax with required and optional flags
- Data shape examples showing real JSON structure
- Domain-specific gotchas (truncated IDs, stdout pollution, silent defaults)
- Escalation rules (when to switch from one approach to another)

### Scope every sentence

Ask: "Does this sentence help the agent run a command, process output, or avoid a known mistake?" If not, cut it.

### Start with the default, then escalate

Show the simplest working command first. Show advanced options only when the default fails or the task requires them.

Good:
```
## Export Spans

\`\`\`bash
ax spans export PROJECT --trace-id TRACE_ID
\`\`\`

If the export returns exactly 500 spans (the REST page limit), re-run with `--all`:

\`\`\`bash
ax spans export PROJECT --all
\`\`\`
```

Bad: Listing REST and Flight as equivalent options with a comparison table before showing any command.

### Be concrete about data shapes

Vague descriptions cause downstream parsing errors. Show exact JSON.

Bad: "The output is a JSON array of example objects with user-defined fields."

Good:
```json
{
  "id": "ex_001",
  "additional_properties": {
    "question": "What is 2+2?",
    "answer": "4"
  }
}
```

### Convert warnings into directives

Instead of explaining why something is bad, tell the agent what to do (or not do).

As inline directives:
- "Use `-o json` to extract IDs — table output truncates them"
- "Always pass `--output-dir .arize-tmp-traces` to keep exports gitignored"

As one-line anti-patterns at the end of a skill:
- Parsing IDs from table output (truncated with `...`)
- Assuming `--stdout` JSON from `--all` is parseable without redirecting stderr
- Including `id`, `created_at` in create/append payloads

Anti-patterns should be one line each. If it takes a paragraph, convert it to a directive.

---

## Skill Structure

```yaml
---
name: skill-name
description: >
  What this skill does. Use when [triggers]. Do NOT use when
  [exclusions — reference sibling skills by name].
---
```

```
# Skill Title

One-line summary.

## Overview
[When to use, high-level procedure]

## Prerequisites
[Link to shared prereqs or inline if unique]

## Core Commands
[The actual CLI commands, organized by operation]

## Workflows
[Multi-step recipes chaining commands together]

## Anti-Patterns
[One-line list of domain-specific mistakes]
```

Not every skill needs every section. Required: YAML frontmatter with `name` and `description`, an Overview, and core instructions.

### Description frontmatter

The `description` field controls when the agent activates the skill. Write it as natural language with:

1. **What it does** — one sentence
2. **Use when** — trigger conditions
3. **Do NOT use when** — exclusions with cross-references to sibling skills

Good:
```yaml
description: >
  Export traces and spans from Arize. Use when the user needs trace
  data for debugging or analysis. Do NOT use for creating datasets
  (use arize-dataset) or setting up tracing (use arize-instrumentation).
```

Bad:
```yaml
description: "INVOKE THIS SKILL when downloading Arize traces."
```

Why: "INVOKE THIS SKILL" is noise, no exclusions means overlapping activation, no sibling cross-references.

### Keep files under 500 lines

Split reference material into separate files one level deep:

```
skills/my-skill/
  SKILL.md              # Core directives (<500 lines)
  column-reference.md   # Reference tables
```

Do not nest references (`SKILL.md` -> `ref.md` -> `detail.md`).

### Extract shared content

Content duplicated across 3+ skills belongs in a shared directory:

```
skills/_shared/
  prerequisites.md
  credentials.md
  troubleshooting.md
```

---

## Designing CLIs for Agents

When building or improving CLI tools that agents will use:

### Machine-readable output is not optional

- Default to human-readable (tables), but always support `-o json`
- JSON output must be parseable without cleaning — no progress bars, no status messages mixed into stdout
- Wrap JSON in a top-level dict with the resource name as key (`{"datasets": [...]}`) — be consistent

### Don't truncate IDs

Table output that truncates base64 IDs (`RGF0YXNldDoz...`) forces agents into `-o json` for every chained command. Either show full IDs in tables or add `--no-truncate`.

### Non-interactive alternatives

Interactive wizards (`profiles create`) block CI/CD and agent use. Every interactive command should have either:
- Flag-based equivalents (`--api-key`, `--format`)
- A documented file-based alternative (write TOML/YAML directly)
- Environment variable support (`--from-env`)

### Stderr discipline

When `--stdout` or `-o json` is active, ALL non-data output (progress bars, status messages, warnings) must go to stderr. Test this specifically for all output backends (REST, Arrow Flight, etc.).

### Helpful empty results

When a query returns nothing, hint at why:
- "No spans found in the last 30 days. Use `--days N` to widen the window."
- Not just `[]` with no context.

### Consistent shapes

If the same resource can be exported via different backends (REST vs Flight, file vs stdout), the JSON shape should be identical or the difference should be flagged with a `--shape` option.

---

## Onboarding & READMEs

### Lead with a single copy-paste prompt

The most effective onboarding is one prompt the user pastes into their agent. It should combine installation + a first task:

Good (from evals-skills):
> Install the eval skills plugin from https://github.com/hamelsmu/evals-skills, then run /evals-skills:eval-audit on my eval pipeline.

Good (instrumentation flow):
> Follow the instructions from https://arize.com/docs/PROMPT.md and ask me questions as needed.

The prompt should be a blockquote so it's visually distinct and easy to copy.

### Separate paths for separate audiences

Don't make one onboarding flow for everyone. Split by experience level:

```markdown
## New to X? Start Here

**Setting up for the first time** — give your agent this prompt:
> [install + first task prompt]

**Already set up?** Give your agent this prompt:
> [install skills + diagnostic/debug prompt]
```

### README structure for agent-consumed repos

```
# Project Name

[1-2 sentence hook — what this does for you, not what it is]
[1 sentence credibility/context]

## New to X? Start Here
[Copy-paste prompts for 2-3 audience segments]

## Installation
[Multiple methods: npx, git clone, plugin]

## Prerequisites
[CLI install, auth options with CI/CD note, verify step]

## Available Skills
[Table with links to SKILL.md files]

## Reference
[Flags, updating, links]
```

### Auth should show three options

Always document authentication as:
1. **Environment variables** — for CI/CD and quick start
2. **Interactive setup** — for persistent local use
3. **Config file** — for scripted/non-interactive setup

Note which options are interactive-only and provide workarounds.

### Always include a verify step

```bash
tool --version && tool auth-check 2>&1
```

Users (and agents) need a single command to confirm everything works.

---

## Common Gotchas to Document

These are real issues discovered through E2E testing. Any skill or CLI that touches these areas should address them:

| Gotcha | Impact |
|--------|--------|
| Table output truncates IDs | Agents can't chain commands without `-o json` |
| Nested data (`additional_properties`) | Downstream parsing breaks if you assume flat structure |
| Different backends return different JSON shapes | Silent incompatibility between REST and Flight |
| Progress bars leak to stdout | JSON parsing fails when `--stdout` + `--all` |
| Silent time-window defaults (`--days 30`) | Empty results with no explanation |
| Interactive-only commands | Blocks CI/CD and agent automation |
| `-o json` wraps in a dict, not a flat list | `data[:5]` fails, need `data["resources"][:5]` |

---

## Testing

After writing or revising a skill:

1. Start a fresh agent session (no prior context)
2. Ask the agent to perform a realistic task covered by the skill
3. Verify it runs the right commands with correct flags
4. Check that it handles empty results, errors, and edge cases
5. Confirm anti-patterns are avoided (e.g., agent doesn't parse IDs from table output)
6. Test the onboarding prompt end-to-end — does it actually work when pasted cold?
