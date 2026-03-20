# Format Guides

Format-specific rules for each content type. Each format defines its phase map (which loop phases apply), critique agent weights, length constraints, and opening/closing techniques.

---

## Substack Post

**Length:** 1,500-3,000 words
**Phase map:** ideate > outline > draft > critique > polish > compound (full loop)

### Opening Techniques
**The gap thesis:** Acknowledge what the audience already knows, then identify the specific gap nobody is addressing.
> "By now, the secret is out: building great AI products relies on great evals. Yet while we're getting better at understanding what evals are and why they matter, there's surprisingly little guidance on how Product Managers and AI Engineers should collaborate on them."

**The two-sentence thesis:** Short declarative + "But" pivot.
> "Prompts and models get all the attention. But the thing that actually determines whether your AI product works in production is evals."

**The table of contents:** For how-to posts, just list what's coming. No preamble.
> "In this post, I'm going to share some practical advice on: Why PMs should be prototyping with AI. What are your options for tools. How to tactically get started."

**The personal hook:** Start with a specific anecdote that leads to the thesis.
> "When Peter Yang and I built a customer support agent for an e-commerce company, we tested it thoroughly..."

### Closing Techniques
- **Action plan:** Week-by-week steps the reader can take immediately
- **Dialogue invitation:** "If you set this up successfully (or got stuck), drop a message below."
- **Callback:** Reference the opening to close the loop
- **Resource list:** Links, tools, next reads (for how-to posts)

### Structure
- Clear section headers (conversational, not academic)
- Mix of prose paragraphs and bulleted lists
- Bold for key phrases within paragraphs
- Emojis sparingly in headers if appropriate
- End with a clear CTA

### Critique Weights
| Dimension | Weight |
|-----------|--------|
| Voice consistency | 30% |
| Engagement & craft | 25% |
| Structure & flow | 25% |
| Factual accuracy | 15% |
| Anti-slop | 5% |

---

## LinkedIn Post

**Length:** 100-300 words
**Phase map:** ideate > draft > critique > polish > compound (skip outline)

### Opening Techniques
**Lead with concrete fact:** A specific, surprising data point or observation.
> "Goldman just hired 200 AI engineers. They're building trading systems that process 10x more data than traditional models. First bank to do this at scale."

**Personal observation:** A specific thing you noticed or learned.
> "I've been teaching AI PM courses for 18 months. The single most common question I get isn't about prompts or models."

### Closing Techniques
- **One-sentence callback:** Connect back to the opening fact
- **Question to audience:** Genuine, not rhetorical ("What patterns are you seeing?")
- **Single bold takeaway:** One sentence in bold that summarizes the point

### Structure
- Short paragraphs (1-2 sentences each)
- No headers or section breaks
- Single line breaks between paragraphs
- No emoji chains or hashtag lists
- Maximum one bold phrase

### Critique Weights
| Dimension | Weight |
|-----------|--------|
| Voice consistency | 25% |
| Engagement & craft | 20% |
| Structure & flow | 10% |
| Factual accuracy | 15% |
| Anti-slop | 30% |

**Note:** Anti-slop is weighted highest because LinkedIn is where AI slop is most concentrated and most visible.

---

## Email

**Length:** 50-200 words
**Phase map:** ideate > draft > critique > polish > compound (skip outline)

### Opening Techniques
**Direct + personal:** Reference something specific about the recipient.
> "Hey Sarah - Saw your post about [specific topic] and thought you'd be interested in [direct value prop]."

**Quick context + ask:** Establish who you are and what you want in one sentence.

### Closing Techniques
- **Single CTA:** One clear ask with a specific time frame ("Free for 20 min this week?")
- **Easy out:** Give them an easy way to say no ("No worries if timing doesn't work")

### Structure
- Casual greeting (first name, no "Dear")
- 2-3 short paragraphs maximum
- One clear ask, not three
- Sign off with just your name

### Special Requirements
- **Ideate phase must gather:** recipient name, relationship context, specific ask, and any shared touchpoints
- **Never be generic:** Every email must reference something specific to the recipient

### Critique Weights
| Dimension | Weight |
|-----------|--------|
| Voice consistency | 20% |
| Engagement & craft | 30% |
| Structure & flow | 10% |
| Factual accuracy | 15% |
| Anti-slop | 25% |

---

## O'Reilly Chapter

**Length:** 2,500-3,000 words
**Phase map:** ideate > outline > draft > critique > polish > compound (full loop)

### Opening Techniques
**Data-driven hook:** Start with a concrete, verifiable data point, then expand significance.
> "When ChatGPT reached 100 million users in two months, faster than any consumer application in history, it signaled more than the arrival of a new technology."

**Provocative question:** Direct challenge to the reader that sets up a real tension.
> "If you could build a working AI application prototype in under an hour, would you still wait three sprints for your engineering team to prototype your idea?"

**Declarative contrast:** Two mirrored sentences where the changed variable is the punch.
> "In traditional software development, the distance between an idea and a working product is measured in weeks or months. In the era of AI engineering, it is measured in minutes."

### Closing Techniques
- **Forward momentum:** Connect to the next chapter
- **Zoomed-out implication:** What does this mean for the reader's career/practice?
- **Action-oriented:** Specific thing the reader should do next

### Structure
- Section headers with clear hierarchy
- Numbered steps for processes
- **Note** and **Tip** callout boxes
- Figure references with descriptive captions
- Exercise stubs at section or chapter end
- Target: 30-40% cut from first draft (from learnings.md)

### Special Requirements
- **Ideate phase:** Check `oreilly/Table of contents.md` for chapter fit and arc
- **Draft phase:** Reference `oreilly/learnings.md` for editing lessons
- **Technical explanations:** Use the 4-layer pattern (Why > Intuitive > Mechanism > Practical)

### Critique Weights
| Dimension | Weight |
|-----------|--------|
| Voice consistency | 25% |
| Engagement & craft | 20% |
| Structure & flow | 30% |
| Factual accuracy | 20% |
| Anti-slop | 5% |

---

## Newsletter

**Length:** 500-1,500 words
**Phase map:** ideate > outline > draft > critique > polish > compound

### Opening Techniques
- **Personal update + pivot:** Brief personal note that leads into the main content
- **Curated observation:** "Three things caught my attention this week..."

### Closing Techniques
- **Resource links:** Curated list of what's worth reading
- **Personal sign-off:** Brief, warm, direct

### Structure
- Conversational tone throughout
- Mix of original commentary and curated links
- Section headers for topic changes
- Shorter paragraphs than Substack

### Critique Weights
| Dimension | Weight |
|-----------|--------|
| Voice consistency | 30% |
| Engagement & craft | 25% |
| Structure & flow | 20% |
| Factual accuracy | 15% |
| Anti-slop | 10% |

---

## Social Post (Twitter/X)

**Length:** 50-150 words
**Phase map:** ideate > draft > critique > compound (skip outline + polish)

### Opening Techniques
- **Lead with concrete fact:** Let the data speak
- **Observation + implication:** "X just happened. Here's what it means."

### Closing Techniques
- **One-sentence callback:** Short and sharp
- **Open question:** Genuine, invites responses

### Structure
- Single paragraph or 2-3 very short paragraphs
- No hashtags unless platform-required
- No emoji chains
- Numbers and specifics over adjectives

### Critique Weights
| Dimension | Weight |
|-----------|--------|
| Voice consistency | 20% |
| Engagement & craft | 20% |
| Structure & flow | 5% |
| Factual accuracy | 20% |
| Anti-slop | 35% |

**Note:** Anti-slop is highest weight. Social posts are the most visible, shortest, and where every word counts. One AI-ism can tank the whole post.
