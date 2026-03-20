# Compound Writing Plugin

This plugin is the canonical source of truth for Aman Khan's writing voice, style rules, and content generation workflow.

## Voice Source of Truth

The canonical voice profile is at `skills/compound-writing/references/voice-dna.md`. All other voice files in the repo (`aman_voice_analysis.md`, `writing_style.md`, `.claude/skills/aman-voice/SKILL.md`) are historical references. When they conflict with voice-dna.md, voice-dna.md wins.

## For All Content Creation

Use `/write` for the full writing loop. Use `/write:critique` to review existing drafts. Use `/write:polish` for quick cleanup.

The old `marketing-email` and `oreilly-book` agents are deprecated. Their functionality is covered by `/write` with the appropriate format selection.

## Anti-Slop

The canonical anti-slop rules are at `skills/compound-writing/references/anti-slop-rules.md`. Apply these rules to ALL written content, not just content produced through the `/write` command.

## Key Principle

**Default to asking, not assuming.** When writing content, always use AskUserQuestion at decision points (angle, tone, audience, examples) rather than making creative assumptions.
