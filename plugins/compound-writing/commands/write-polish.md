---
description: "Polish and refine an existing draft. Applies voice alignment, de-slop, and structural tightening."
argument-hint: "[file-path]"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "AskUserQuestion"]
---

# Standalone Polish

Refine an existing draft with voice alignment, de-slop, and structural tightening. Use this when you have a draft that's close but needs a cleanup pass.

## STEP 0: SETUP

### Load the Draft
If `$ARGUMENTS` contains a file path, read it. Otherwise:
```
AskUserQuestion: "Which file should I polish? Provide a file path."
```

### Format Detection
Detect or ask for the format (same logic as write-critique.md).

### Voice Calibration
```
AskUserQuestion: "How should I calibrate the voice for polishing?"
Options:
- Use general voice profile
- Select specific writing samples to match
```

Load the chosen voice reference.

---

## STEP 1: LOAD REFERENCES

Read these files:
- `${CLAUDE_PLUGIN_ROOT}/skills/compound-writing/references/voice-dna.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/compound-writing/references/anti-slop-rules.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/compound-writing/references/format-guides.md` (relevant format section)
- `${CLAUDE_PLUGIN_ROOT}/skills/compound-writing/references/calibration.md`

---

## STEP 2: POLISH

Apply three passes in order:

### Pass 1: Voice Alignment
Go paragraph by paragraph:
- Does each paragraph sound like Aman? (Compare against calibration sentences)
- Are Voice DNA rules applied where appropriate?
- Fix any sentences that read generic, academic, or corporate
- Ensure emphasis mechanics are correct (bold for key phrases, parenthetical asides, colons not em dashes)

### Pass 2: De-Slop
Scan every sentence against anti-slop-rules.md:
- Remove all banned phrases
- Fix structural slop patterns
- Replace em dashes with colons/commas/parentheses
- Eliminate hedging language
- Ground any ungrounded claims (or flag for user to provide specifics)

### Pass 3: Structural Tightening
- Remove unnecessary words and filler
- Ensure one idea per paragraph
- Check paragraph density (3-5 sentences each)
- Verify opening matches format guide technique
- Verify closing matches format guide technique
- Tighten transitions between sections

---

## STEP 3: PRESENT CHANGES

Show the user the polished version. For shorter pieces (< 500 words), show the full revised text. For longer pieces, show a summary of changes made.

```
AskUserQuestion: "Here's the polished version. What do you think?"
Options:
- Looks great, save it
- Needs more work (tell me what still feels off)
- Show me a diff of what changed
- Revert, I preferred the original
```

**If "save it":** Overwrite the original file (or write to a new file if user prefers).

**If "needs more work":** Ask for specific feedback, apply additional changes, and present again.

**If "show me a diff":** Present the key changes as a before/after comparison.

**If "revert":** Do not save. Keep the original intact.
