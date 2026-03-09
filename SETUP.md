You are setting up Aman's Claude Code skills and plugins on this machine. Walk me through it step by step — describe what each one does and let me pick which ones I want.

## Step 1: Clone the Repo

Check if the repo is already cloned. If not, clone it:

```bash
git clone https://github.com/amanaiproduct/amans-skills ~/Projects/amans-skills
```

## Step 2: Add Plugin Marketplaces

These are registries that host Claude Code plugins. Add them both:

```bash
claude plugin add github:anthropics/claude-plugins-official
claude plugin add git:https://github.com/EveryInc/compound-engineering-plugin.git
```

## Step 3: Install Plugins (Let Me Choose)

Present each plugin one at a time. Explain what it does and ask if I want it.

**Plugins available:**

| Plugin | Command | What it does |
|--------|---------|-------------|
| plugin-dashboard | `claude plugin add dir:~/Projects/amans-skills && claude plugin enable plugin-dashboard@amans-plugins` | Shows which tools and plugins were used on every turn — a compact badge at the end of each response |
| compound-engineering | `claude plugin enable compound-engineering@every-marketplace` | 29 agents, 22 commands, 19 skills for code review, research, and workflow automation |
| frontend-design | `claude plugin enable frontend-design@claude-plugins-official` | UI/UX implementation skill that generates production-grade interfaces with high design quality |
| ralph-loop | `claude plugin enable ralph-loop@claude-plugins-official` | Runs Claude in a loop until a task is fully complete — useful for long multi-step work |
| explanatory-output-style | `claude plugin enable explanatory-output-style@claude-plugins-official` | Adds educational insights explaining why Claude made specific implementation choices |
| plugin-dev | `claude plugin enable plugin-dev@claude-plugins-official` | Tools for building your own Claude Code plugins — agents, skills, hooks, and commands |

## Step 4: Install Skills (Let Me Choose)

Skills are prompt templates you invoke with slash commands. Present each one and ask if I want it.

To install a skill, copy its folder into `~/.claude/skills/`:

| Skill | Command | What it does |
|-------|---------|-------------|
| ccusage | `cp -r ~/Projects/amans-skills/skills/ccusage ~/.claude/skills/` | Check Claude Code token usage stats by running `bunx ccusage` |
| excalidraw | `cp -r ~/Projects/amans-skills/skills/excalidraw ~/.claude/skills/` | Draw and refine Excalidraw diagrams programmatically via MCP server |
| design-for-agents | `cp -r ~/Projects/amans-skills/skills/design-for-agents ~/.claude/skills/` | Design skills, CLIs, docs, and onboarding flows optimized for AI coding agents |

## Step 5: Verify

After installation, run `claude plugin list` to confirm everything is enabled. Then try one of the skills (like `/ccusage`) to make sure it works.

Done! You're all set with Aman's Claude Code setup.
