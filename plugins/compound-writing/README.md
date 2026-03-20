# Compound Writing

A Claude Code plugin that runs a multi-phase writing loop with voice analysis, parallel critique agents, and anti-slop detection. Built to produce content in a consistent voice across formats.

## Commands

| Command | What it does |
|---------|-------------|
| `/write [format] [topic]` | Full loop: ideate, outline, draft, critique, polish, compound |
| `/write:critique [file]` | Run 4 review agents on an existing draft |
| `/write:polish [file]` | Voice alignment + de-slop + structural tightening |

## How It Works

The `/write` command flows through 6 phases, asking questions at every decision point:

1. **Setup** — pick format, load voice profile (general or from specific writing samples)
2. **Ideate** — search local resources for context, align on angle with user
3. **Outline** — structure the piece (skipped for short formats)
4. **Draft** — write using voice DNA + anti-slop rules
5. **Critique** — 4 parallel agents score the draft on voice fidelity, anti-slop, structure, and factual accuracy
6. **Polish** — apply accepted fixes, final de-slop pass
7. **Compound** — add finished piece to samples, update voice profile with new patterns

## Supported Formats

| Format | Length | Anti-Slop Weight |
|--------|--------|-----------------|
| Substack | 1,500-3,000 words | 5% |
| LinkedIn | 100-300 words | 30% |
| Email | 50-200 words | 25% |
| O'Reilly chapter | 2,500-3,000 words | 5% |
| Newsletter | 500-1,500 words | 10% |
| Social post (X) | 50-150 words | 35% |

Anti-slop weight is highest for short social formats because every word counts and AI-isms are most visible there.

## Review Agents

Four agents run in parallel during critique:

| Agent | What it checks |
|-------|---------------|
| `voice-fidelity` | Does it match the voice profile? Calibration sentence compatibility. |
| `slop-detector` | Banned phrases, false dichotomies, LinkedIn breathlessness, em dashes. |
| `structure-flow` | Opening/closing techniques, paragraph density, format-specific rules. |
| `fact-checker` | Verifies all named companies, numbers, dates, and claims via web search. |

Each agent scores 1-10. Composite score uses format-specific weights. Threshold for publishing: 7.0+.

## Customizing the Voice

The voice profile lives in `skills/compound-writing/references/voice-dna.md`. It defines 10 core voice rules, sentence mechanics, paragraph construction patterns, and a list of things the voice never does.

To calibrate for a specific piece, the `/write` command can load individual writing samples instead of the general profile. This pulls voice patterns from a real published piece rather than the consolidated rules.

Anti-slop rules are at `skills/compound-writing/references/anti-slop-rules.md`. These are hard constraints: banned phrases, structural patterns to avoid, and a scoring system (0 = fully human, 10 = maximum slop).

## Plugin Structure

```
compound-writing/
├── agents/
│   ├── voice-fidelity.md
│   ├── slop-detector.md
│   ├── structure-flow.md
│   └── fact-checker.md
├── commands/
│   ├── write.md
│   ├── write-critique.md
│   └── write-polish.md
├── skills/
│   └── compound-writing/
│       ├── SKILL.md
│       └── references/
│           ├── voice-dna.md
│           ├── anti-slop-rules.md
│           ├── format-guides.md
│           ├── quality-rubric.md
│           └── calibration.md
└── CLAUDE.md
```

## Install

Add to your `.claude/settings.json`:

```json
{
  "plugins": [
    "path/to/compound-writing"
  ]
}
```

Or install from the amans-skills repo:

> Go to [aman.md](https://aman.md) and set me up.
