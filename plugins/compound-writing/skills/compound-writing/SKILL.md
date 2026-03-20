---
name: compound-writing
description: "Multi-phase writing workflow with voice analysis, parallel critique, and compounding learnings. Auto-triggers on writing tasks, content generation, drafting, editing, or style questions. Use /write for the full loop, /write:critique for standalone review, /write:polish for refinement. Triggers on: write, draft, substack, linkedin, email, newsletter, social post, voice, style, anti-slop, de-slop, content creation, blog post, article, chapter."
---

# Compound Writing

A rigorous writing loop that produces content in Aman Khan's voice across all formats.

## Commands

| Command | What it does |
|---------|-------------|
| `/write [format] [topic]` | Full loop: ideate, outline, draft, critique, polish, compound |
| `/write:critique [file]` | Standalone: run 4 review agents on an existing draft |
| `/write:polish [file]` | Standalone: voice alignment + de-slop + structural tightening |

## Supported Formats
Substack, LinkedIn, Email, O'Reilly chapter, Newsletter, Social post (Twitter/X)

## How It Works

The `/write` command flows continuously through 6 phases, asking you questions at every decision point rather than making assumptions:

1. **Setup** — pick format, load voice profile (general or sample-specific)
2. **Ideate** — research context, align on angle
3. **Outline** — structure the piece (skipped for short formats)
4. **Draft** — write using voice DNA + anti-slop rules
5. **Critique** — 4 parallel agents score the draft (voice fidelity, anti-slop, structure/flow, fact-check)
6. **Polish** — apply accepted fixes, final cleanup
7. **Compound** — add to samples, update voice profile with new patterns

## Reference Files

For detailed voice rules and patterns:
- `references/voice-dna.md` — Canonical voice profile (identity, 10 rules, mechanics, calibration)
- `references/anti-slop-rules.md` — Banned phrases and patterns
- `references/format-guides.md` — Per-format rules, phase maps, critique weights
- `references/quality-rubric.md` — Scoring dimensions and thresholds
- `references/calibration.md` — Annotated real sentences for voice matching

## Review Agents

Four specialized agents run in parallel during critique:
- **voice-fidelity** — Does it sound like Aman?
- **slop-detector** — Any AI-isms or banned patterns?
- **structure-flow** — Does the architecture serve the argument?
- **fact-checker** — Are all claims true and verifiable?

## Voice DNA Summary

Aman's voice is **authority through vulnerability**. Lead with concrete examples, credentials in subordinate clauses, hyper-specific anecdotes, casual complexity deflation, parenthetical asides, "Here's" transitions, open acknowledgment of imperfection, shared struggle before advice, teaching through sharing, bold for emphasis. Never: false dichotomies, em dashes, LinkedIn breathlessness, choppy staccato, corporate buzzwords, made-up examples.
