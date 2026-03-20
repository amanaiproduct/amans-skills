# Quality Rubric

Scoring framework for evaluating written content across five dimensions. Each critique agent scores its dimension 1-10. Composite score uses format-specific weights from format-guides.md.

---

## Scoring Dimensions

### Voice Consistency (default weight: 30%)

Does this sound like Aman wrote it?

| Score | Description |
|-------|-------------|
| 1-3 | Doesn't sound like Aman. Generic AI voice, academic tone, or corporate speak. |
| 4-5 | Some elements present (uses "I", has an anecdote) but tone is off. Missing the casual authority. |
| 6-7 | Mostly sounds right. Minor deviations: a hedge here, a missed opportunity for a parenthetical there. |
| 8-9 | Sounds like Aman. Calibration sentences would blend in. Natural use of all voice DNA patterns. |
| 10 | Indistinguishable from Aman's best published work. A reader would not question authorship. |

**What the voice-fidelity agent checks:**
- Calibration sentence compatibility (could this sentence appear alongside the calibration set?)
- Voice DNA pattern usage (all 10 rules applied where appropriate)
- Emphasis mechanics (bold, parentheticals, colons, not em dashes)
- Pronoun density ("I", "you", "we" in expected ratios)
- Transition devices ("Here's" frequency, "Let's" usage)

### Engagement & Craft (default weight: 25%)

Would a reader finish this? Would they share it?

| Score | Description |
|-------|-------------|
| 1-3 | Flat. No hook. Reader would stop after first paragraph. |
| 4-5 | Readable but not compelling. Gets the information across without excitement. |
| 6-7 | Good hook, solid pacing. Reader stays engaged but isn't surprised. |
| 8-9 | Compelling. Every paragraph earns the next. Specific details create vivid imagery. |
| 10 | Can't stop reading. Opening hooks immediately. Pacing is perfect. Ending lands. |

**What to evaluate:**
- Does the first sentence earn the second?
- Is there sentence length variation (punch-then-explain rhythm)?
- Are there flat spots where a reader would skim?
- Do anecdotes include hyper-specific details?
- Does the ending create action or invitation, not just summary?

### Structure & Flow (default weight: 20%)

Does the architecture serve the argument?

| Score | Description |
|-------|-------------|
| 1-3 | Disorganized. No clear arc. Sections feel random. |
| 4-5 | Logical order but predictable. Header-paragraph-header-paragraph without flow. |
| 6-7 | Well-structured. Sections build on each other. Transitions work. |
| 8-9 | Architecture is invisible: reader feels guided without noticing the structure. |
| 10 | Structure itself is an argument. The way the piece unfolds reinforces the thesis. |

**What to evaluate:**
- Correct opening technique for format? (per format-guides.md)
- Correct closing technique for format?
- One idea per paragraph?
- Transitions feel natural, not forced?
- Length appropriate for format?
- Paragraph density (3-5 sentences, not walls of text)?
- Section headers are conversational, not academic?

### Factual Accuracy (default weight: 15%)

Is every claim true and verifiable?

| Score | Description |
|-------|-------------|
| 1-3 | Contains factual errors or invented claims. |
| 4-5 | Mostly accurate. Some claims unverified but plausible. |
| 6-7 | All checkable facts verified. Unverifiable claims marked as opinion. |
| 8-9 | Every name, company, date, and number verified. Sources available. |
| 10 | Every fact sourced. Every claim attributed. Every number precise. |

**Claim classification:**
- **Verified:** Confirmed via web search or local reference
- **Unverifiable:** Cannot confirm or deny (e.g., personal anecdotes). Flag but don't penalize.
- **Contradicted:** Evidence contradicts the claim. Flag as CRITICAL.

### Anti-Slop Score (default weight: 10%)

Is this free of AI-generated patterns?

| Score | Description |
|-------|-------------|
| 1-3 | Riddled with AI-isms. Multiple banned phrases per paragraph. |
| 4-5 | Some slop detected. A few hedges, one buzzword, a structural pattern. |
| 6-7 | Mostly clean. One or two minor traces. |
| 8-9 | Clean. Zero banned phrases. Natural human rhythm. |
| 10 | Zero slop. A slop detection tool would classify this as 100% human-written. |

**Scoring notes:** This dimension uses the inverted scale from anti-slop-rules.md. A slop score of 0 (from the anti-slop rules) maps to a quality score of 10 here.

---

## Composite Score

```
Composite = (Voice * W_voice) + (Engagement * W_engagement) + (Structure * W_structure)
          + (Accuracy * W_accuracy) + (AntiSlop * W_slop)
```

Weights (W_*) come from format-guides.md and vary by format.

### Thresholds

| Composite | Verdict | Action |
|-----------|---------|--------|
| 8.0+ | Ready to publish | Proceed to compound step |
| 6.0-7.9 | Needs revision | Identify weakest dimension, apply targeted fixes |
| Below 6.0 | Major rewrite needed | Return to draft phase with specific guidance |

**Default threshold for all formats: 7.0.** User can override.

---

## Presenting Critique Results

When the orchestrator synthesizes findings from all 4 agents, present them as:

```
## Critique Report

**Composite Score: X.X / 10** [Ready to publish / Needs revision / Major rewrite]

### Scores by Dimension
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Voice     | X/10  | 30%    | X.X      |
| Engagement| X/10  | 25%    | X.X      |
| Structure | X/10  | 20%    | X.X      |
| Accuracy  | X/10  | 15%    | X.X      |
| Anti-Slop | X/10  | 10%    | X.X      |

### Critical Issues (must fix)
[Issues with confidence >= 90]

### Important Issues (should fix)
[Issues with confidence >= 75]

### Suggestions (nice to have)
[Issues with confidence >= 50]
```

Group issues by agent. Include line references and specific suggested fixes.
