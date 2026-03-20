---
description: "Multi-phase writing loop: ideate, outline, draft, critique, polish, compound. Produces content in Aman's voice across all formats."
argument-hint: "[format] [topic]"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "WebSearch", "WebFetch", "Task", "AskUserQuestion"]
---

# Compound Writing Loop

You are running a multi-phase writing workflow that produces content in Aman Khan's voice. The loop flows continuously with inline questions whenever assumptions arise. Default to asking rather than assuming.

## STEP 0: SETUP

### Parse Arguments
Parse `$ARGUMENTS` for format and topic. Format may be: substack, linkedin, email, oreilly, newsletter, social.

If format is not clear from arguments, ask:

```
AskUserQuestion: "What format are we writing?"
Options:
- Substack post (1,500-3,000 words, full loop)
- LinkedIn post (100-300 words, quick loop)
- Email (50-200 words, quick loop)
- O'Reilly chapter (2,500-3,000 words, full loop)
- Newsletter (500-1,500 words, full loop)
- Social post (50-150 words, minimal loop)
```

### Load Format Guide
Read `${CLAUDE_PLUGIN_ROOT}/skills/compound-writing/references/format-guides.md` and find the section for the chosen format. Note the phase map (which phases apply) and critique weights.

### Voice Calibration
```
AskUserQuestion: "How should I calibrate the voice for this piece?"
Options:
- Use general voice profile (faster, uses the consolidated voice DNA)
- Select specific writing samples (I'll show you files to pick from)
```

If "general profile": Read `${CLAUDE_PLUGIN_ROOT}/skills/compound-writing/references/voice-dna.md`

If "select specific samples":
1. List files in `Resources/Substack/`, `Resources/drafts/`, and `oreilly/` using Glob
2. Present the list to the user via AskUserQuestion
3. Read the selected files to extract voice patterns for this session

---

## STEP 1: IDEATE

If topic was not provided in arguments:
```
AskUserQuestion: "What do you want to write about? Give me a topic, angle, or rough idea."
```

### Research Context
- Search `Resources/` for files related to the topic
- Search `Knowledge/Transcripts/` for recent meeting notes that might be relevant
- For **O'Reilly**: Read `oreilly/Table of contents.md` to understand chapter fit
- For **Email**: Ask for recipient name and relationship context
- Use WebSearch if the topic involves recent events or external facts

### Present Context and Align
If relevant context was found, present it:
```
AskUserQuestion: "Here's what I found for context: [summary]. What angle do you want to take?"
Options:
- [Suggested angle based on context]
- [Alternative angle]
- Let me describe my angle (free text)
```

If no context found, ask directly about the angle and key points to cover.

---

## STEP 2: OUTLINE (if phase map includes it)

Skip this step for formats with phase maps that don't include outline (LinkedIn, Email, Social Post).

### Generate Outline
Based on the ideation output and format rules:
- Create section headers
- Note key points for each section
- Identify where anecdotes and examples will go
- For O'Reilly: include exercise stubs and figure placeholders

### Review with User
```
AskUserQuestion: "Here's the outline. How does this look?"
Options:
- Looks good, proceed to draft
- I want to adjust it (let me tell you what to change)
- Start over with a different structure
```

Iterate until the user approves.

---

## STEP 3: DRAFT

### Load Voice Constraints
Read these reference files:
- `${CLAUDE_PLUGIN_ROOT}/skills/compound-writing/references/voice-dna.md` (if not already loaded)
- `${CLAUDE_PLUGIN_ROOT}/skills/compound-writing/references/anti-slop-rules.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/compound-writing/references/calibration.md`

### Write the Draft
- Follow the approved outline (or ideation notes for short formats)
- Apply all 10 Voice DNA rules throughout
- Use the correct opening technique for the format
- Use the correct closing technique for the format
- Ground every claim in a specific example within 2 sentences
- Use the technical explanation pattern (Why > Intuitive > Mechanism > Practical) for complex concepts

### Save the Draft
Write the draft to `Resources/drafts/{YYYY-MM-DD}-{slug}.md` where slug is a kebab-case version of the topic.

### Mid-Draft Check (for long pieces > 1,500 words)
If the draft will exceed 1,500 words, pause at a natural midpoint:
```
AskUserQuestion: "Here's the first half. Any direction changes before I continue?"
Options:
- Keep going, this is great
- Adjust the direction (tell me what to change)
- The tone is off (be more specific about what feels wrong)
```

---

## STEP 4: CRITIQUE

### Launch Review Agents
Launch all 4 agents. Include the draft content and relevant context in each prompt.

```
Task voice-fidelity("Review this draft for voice consistency. Format: [format]. Draft: [content or file path]. Voice profile: [loaded voice DNA]. Calibration: [loaded calibration sentences].")

Task slop-detector("Scan this draft for AI slop patterns. Draft: [content or file path].")

Task structure-flow("Evaluate the structure and flow of this draft. Format: [format]. Draft: [content or file path].")

Task fact-checker("Verify all factual claims in this draft. Draft: [content or file path].")
```

### Synthesize Results
After all agents return:
1. Collect scores from each agent
2. Calculate composite score using format-specific weights from the format guide
3. Deduplicate overlapping findings (e.g., if voice-fidelity and slop-detector both flag the same sentence)
4. Group findings by severity:
   - **Critical** (confidence >= 90): Must fix
   - **Important** (confidence 75-89): Should fix
   - **Suggestions** (confidence 50-74): Nice to have

### Present to User
Display the critique report following the format in `quality-rubric.md`:
- Composite score and verdict
- Per-dimension scores with weights
- Grouped findings

```
AskUserQuestion: "Here's the critique. What would you like to do?"
Options:
- Accept all findings and polish
- Accept with exceptions (I'll tell you which findings to skip)
- Reject all, keep the draft as-is
- This score seems wrong (tell me what you disagree with)
```

---

## STEP 5: POLISH

### Apply Accepted Changes
For each accepted finding:
- Apply the suggested fix
- If the fix itself contains slop, rewrite it

### Final Passes
1. **De-slop pass:** One more scan for any remaining banned patterns
2. **Voice alignment pass:** Ensure fixes didn't break the voice
3. **Structural tightening:** Remove unnecessary words, tighten paragraphs

### Save Polished Version
Overwrite the draft file with the polished version.

### Final Review
```
AskUserQuestion: "Here's the polished version. Ready to publish, or want another critique pass?"
Options:
- Ready to publish (proceed to compound step)
- Run another critique pass (return to Step 4)
- I want to make manual edits first (pause and let me edit)
```

---

## STEP 6: COMPOUND

### Add to Writing Samples
Based on format, copy the finished piece to the appropriate samples directory:
- Substack: `Resources/Substack/`
- O'Reilly: `oreilly/`
- Other formats: `Resources/drafts/` (keep as reference)

### Analyze for New Patterns
Read the finished piece and compare against `voice-dna.md`:
- Are there any new voice patterns not currently documented?
- Any new effective phrases or transitions?
- Any new structural techniques that worked well?

### Update Voice Profile (if new patterns found)
If new patterns were discovered:
```
AskUserQuestion: "I noticed some new voice patterns in this piece. Want to update the voice profile?"
Options:
- Yes, show me the proposed changes
- No, keep the profile as-is
- Save the patterns but don't update the main profile yet
```

If yes: present a diff of proposed changes to `voice-dna.md` and apply if approved.

### Report
Display a summary:
```
Compound Writing complete!

Format: [format]
Composite Score: X.X / 10
File: Resources/drafts/[filename]

Voice profile: [Updated / No changes]
Samples directory: [Updated with new piece]
```

---

## Important Guidelines

- **Default to asking.** When in doubt about angle, tone, audience, or any creative decision, use AskUserQuestion.
- **Never make up examples.** If you need an example to ground a claim, ask the user for one or use WebSearch.
- **Stay in voice.** Every sentence you write in the draft must follow the Voice DNA.
- **Anti-slop throughout.** Don't just check for slop at the end. Write clean from the start.
- **Respect the format.** Short formats (LinkedIn, Social, Email) should flow quickly. Don't over-process a 100-word post.
