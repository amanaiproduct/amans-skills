# Explanatory Output Style Plugin

Adds educational insights to every Claude Code session via a SessionStart hook.

## What it does

When enabled, Claude automatically provides brief educational explanations before and after writing code, formatted as:

```
`★ Insight ─────────────────────────────────────`
[2-3 key educational points]
`─────────────────────────────────────────────────`
```

Insights focus on codebase-specific patterns and implementation choices rather than general programming concepts.

## How it works

A SessionStart hook injects instructions into every session. No slash commands, no manual invocation. It just runs.

This replaces the deprecated `"outputStyle": "Explanatory"` setting.

## Token cost

This plugin adds ~200 tokens of instructions to every session. The insights Claude generates in response add to output token usage. Don't install this if you're optimizing for minimal token spend.
