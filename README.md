# Aman's Skills

My Claude Code setup — plugins, skills, and the config that ties them together.

**Plugins** extend Claude Code with new tools, hooks, and agents that run automatically.
**Skills** are prompt templates you invoke on demand (like `/ccusage` or `/excalidraw`).

## Quick Start

Paste this into a Claude Code session:

> Go to [aman.md](https://aman.md) and set me up.

## What's Included
<img width="964" height="552" alt="Screenshot 2026-02-15 at 4 20 26 PM" src="https://github.com/user-attachments/assets/9507ecd0-9980-4093-a975-a6fb0fd434f0" />

### Plugins

| Plugin | Source | What it does |
|--------|--------|-------------|
| [plugin-dashboard](plugins/plugin-dashboard) | this repo | Shows which tools and plugins were used on every turn |
| [compound-engineering](https://github.com/EveryInc/compound-engineering-plugin) | every-marketplace | 29 agents, 22 commands, 19 skills for code review, research, and workflow automation |
| [frontend-design](https://github.com/anthropics/claude-plugins-official) | claude-plugins-official | UI/UX implementation skill for production-grade interfaces |
| [ralph-loop](https://github.com/anthropics/claude-plugins-official) | claude-plugins-official | Run Claude in a loop until task completion |
| [explanatory-output-style](https://github.com/anthropics/claude-plugins-official) | claude-plugins-official | Educational insights about implementation choices |
| [plugin-dev](https://github.com/anthropics/claude-plugins-official) | claude-plugins-official | Tools for building Claude Code plugins |

### Skills

| Skill | What it does |
|-------|-------------|
| [ccusage](skills/ccusage) | Check Claude Code token usage stats |
| [excalidraw](skills/excalidraw) | Draw and refine Excalidraw diagrams via MCP |

## Manual Install

If you'd rather install manually instead of using the setup guide:

```bash
# Marketplaces
claude plugin add github:anthropics/claude-plugins-official
claude plugin add git:https://github.com/EveryInc/compound-engineering-plugin.git

# Plugins
claude plugin enable compound-engineering@every-marketplace
claude plugin enable frontend-design@claude-plugins-official
claude plugin enable ralph-loop@claude-plugins-official
claude plugin enable explanatory-output-style@claude-plugins-official
claude plugin enable plugin-dev@claude-plugins-official

# This repo (clone first)
git clone https://github.com/amanaiproduct/amans-skills ~/Projects/amans-skills
claude plugin add dir:~/Projects/amans-skills
claude plugin enable plugin-dashboard@amans-plugins

# Skills
cp -r ~/Projects/amans-skills/skills/* ~/.claude/skills/
```
