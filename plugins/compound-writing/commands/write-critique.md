---
description: "Run 4 parallel review agents on an existing draft. Produces scored critique with specific fix suggestions."
argument-hint: "[file-path]"
allowed-tools: ["Read", "Glob", "Grep", "WebSearch", "WebFetch", "Task", "AskUserQuestion"]
---

# Standalone Critique

Run the full critique battery on an existing draft without going through the ideate/outline/draft phases. Use this for content you've already written (or received from someone else) that needs quality review.

## STEP 0: SETUP

### Load the Draft
If `$ARGUMENTS` contains a file path, read it. Otherwise:
```
AskUserQuestion: "Which file should I critique? Provide a file path or paste the content."
```

### Authorship Check
```
AskUserQuestion: "Is this your own writing or someone else's?"
Options:
- My own writing (full review including voice fidelity)
- Someone else's (skip voice fidelity, focus on structure, facts, and slop)
```

If someone else's writing: run only 3 agents (slop-detector, structure-flow, fact-checker). Adjust weight distribution to compensate for missing voice dimension.

### Format Detection
Try to detect the format from the content length and structure:
- < 200 words with no headers: likely Social or LinkedIn
- < 300 words with greeting: likely Email
- 500-3,000 words with headers: likely Substack or Newsletter
- 2,500+ words with chapter-style structure: likely O'Reilly

If unsure:
```
AskUserQuestion: "What format is this?"
Options: [Substack, LinkedIn, Email, O'Reilly, Newsletter, Social Post]
```

### Voice Calibration
```
AskUserQuestion: "How should I calibrate the voice review?"
Options:
- Use general voice profile
- Select specific writing samples to compare against
```

Load the chosen voice reference.

---

## STEP 1: CRITIQUE

### Launch Review Agents
Same as Step 4 in /write. Launch agents based on authorship:

**Own writing (4 agents):**
```
Task voice-fidelity(draft + voice profile + calibration)
Task slop-detector(draft + anti-slop rules)
Task structure-flow(draft + format guide)
Task fact-checker(draft)
```

**Someone else's writing (3 agents):**
```
Task slop-detector(draft + anti-slop rules)
Task structure-flow(draft + format guide)
Task fact-checker(draft)
```

### Synthesize Results
1. Collect scores from each agent
2. Calculate composite score using format-specific weights
   - If voice-fidelity was skipped, redistribute its weight proportionally across remaining dimensions
3. Deduplicate overlapping findings
4. Group by severity: Critical / Important / Suggestions

### Present Critique
Display the full critique report (see quality-rubric.md for format).

---

## STEP 2: NEXT STEPS

```
AskUserQuestion: "Critique complete. What would you like to do?"
Options:
- Apply fixes (I'll polish the draft based on the accepted findings)
- I'll fix manually (just needed the feedback)
- Run another pass (re-critique after I make changes)
```

**If "Apply fixes":**
- Ask which findings to accept/reject if there are many
- Apply accepted changes following voice DNA and anti-slop rules
- Save the updated draft
- Offer to run another critique pass on the updated version

**If "Run another pass":**
- Wait for user to confirm they've made changes
- Re-read the file and return to Step 1
