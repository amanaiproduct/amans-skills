# Anti-Slop Rules

The canonical list of patterns to detect and eliminate from writing. Organized by category with examples of violations and fixes.

---

## Banned Phrases (Hard No)

These phrases are NEVER acceptable. Replace or restructure the sentence entirely.

### Corporate/AI Buzzwords
- "delve" / "delve into"
- "landscape" (as in "the AI landscape")
- "paradigm shift"
- "unlock" (as noun: "unlock value," "unlock potential")
- "leverage" (as verb: "leverage AI")
- "journey" (as learning metaphor: "your AI journey")
- "game-changing" / "game-changer"
- "revolutionary" / "revolutionize"
- "transformative" / "transform the way we"
- "seamlessly" / "seamless integration"
- "robust" (as generic modifier)
- "cutting-edge"
- "best-in-class"
- "next-level"
- "empower" / "empowering"

### Filler Transitions
- "At its core"
- "At the end of the day"
- "Let me be clear"
- "It's important to note that"
- "This comprehensive approach"
- "In today's rapidly evolving"
- "Moving forward"

### Setup/Reveal Patterns
- "The key insight..." / "The key takeaway..."
- "Remember, the goal is..."
- "This is where X gets interesting/powerful/scary good"
- "Here's where X shines"
- "The uncomfortable truth" / "The [adjective] truth"
- "The difference? [Answer]" (rhetorical device)

### Excessive Hedging
- "might potentially"
- "could potentially"
- "it's possible that"
- "one could argue"
- "it could be said that"

---

## Structural Slop Patterns

These are structural patterns that signal AI-generated or LinkedIn-style writing.

### False Dichotomies / Corrective Reframing (THE WORST OFFENDER)
The pattern: negate the obvious, then provide a "clever" reframe.

**Banned forms:**
- "It's not X, it's Y"
- "This isn't about X. It's about Y."
- "You think this is X. It's actually Y."
- "Everyone sees X. The reality is Y."
- "That's not X. That's Y."
- "X isn't just Y" formations
- "This isn't just X, it fundamentally Y"
- "They didn't X. They Y" false contrast

**Fix:** Just state your actual point directly. If the contrast is real, use an evolution frame: "Traditional approach does X. The new approach does Y because [reason]."

### LinkedIn Breathlessness
The pattern: short punchy fragments designed to create false urgency.

**Banned forms:**
- "No X. No Y. Just Z."
- "More X, less Y." (as standalone line)
- "Speed matters. Context matters. Evals matter more."
- Any chain of 2-3 word sentences for dramatic effect

**Fix:** Combine into a real sentence: "Prompts and models get all the attention. But the thing that actually determines whether your AI product works in production is evals."

### Rhetorical Questions as Setup
The pattern: asking a question you immediately answer, used as a transition device.

**Banned forms:**
- "The problem? [Answer]"
- "Those [thing]? They're [explanation]"
- "So what does this mean? It means..."
- "But what if you could...?"
- Any question followed immediately by its answer (except genuine "now what?" moments)

**Fix:** Just make the statement. "Here's the thing" or "Here's what I found" works better.

### The AI List Reveal
The pattern: asking an AI to do something, then marveling at the output.

**Banned forms:**
- "When I asked X to do Y, it didn't just Z. It [list of things]"
- "I gave it [input] and it [breathless list of capabilities]"

**Fix:** Describe what the tool actually did, with specific results and honest assessment of what worked vs. didn't.

### Em Dashes
Never use em dashes (—) for dramatic pauses. Use colons, commas, or parentheses instead.

**Bad:** "The answer was simple — evals."
**Good:** "The answer was simple: evals."
**Good:** "The answer was simple (evals)."

---

## Content Slop Patterns

### Made-Up Content
- Fake statistics ("Studies show that 73% of...")
- Invented company examples ("Last month, a Fortune 500 company...")
- Generic scenarios with no specific details
- Vague superlatives without specifics ("the best tool on the market")

**Rule:** Every claim must be grounded in a real, named, verifiable example within 2 sentences.

### Generic Advice
- Advice so vague it could apply to anything ("focus on what matters most")
- Lists of obvious truths presented as insights
- Truisms wrapped in fancy language

**Rule:** Every piece of advice must include a specific example of someone doing the thing.

### Performative Helpfulness
- "Great question!"
- "I'd be happy to help!"
- "That's a really insightful observation."
- Complimenting the reader before delivering content

**Rule:** Just deliver the content. The work speaks for itself.

---

## Scoring System

Rate content on a 0-10 scale:

| Score | Description | Example |
|-------|-------------|---------|
| 0 | Zero slop. Reads fully human. | Real Aman Substack post |
| 1-2 | Trace amounts. One minor phrase. | A good draft with one "landscape" |
| 3-4 | Noticeable. Several patterns detected. | A few hedges + one false dichotomy |
| 5-6 | Significant. Structure is AI-shaped. | Multiple buzzwords, one breathless section |
| 7-8 | Heavy. Reads like typical AI output. | Full of corrective reframing and hedges |
| 9-10 | Maximum slop. Every paragraph violated. | Unedited ChatGPT with LinkedIn prompt |

**Threshold:** Anything scoring 3+ needs a de-slop pass before publishing.

---

## Quick Self-Check

Before finalizing any piece:
- [ ] Zero em dashes?
- [ ] Zero false dichotomies or corrective reframing?
- [ ] Zero choppy staccato chains?
- [ ] Zero banned buzzwords?
- [ ] Every claim grounded in a specific example?
- [ ] No made-up statistics or scenarios?
- [ ] No performative helpfulness?
- [ ] Reads like a person wrote it, not a model?
