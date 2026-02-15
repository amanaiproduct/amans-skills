# Aman's Claude Code Setup

Everything I use with Claude Code. Paste this into a session to get started:

> Read https://github.com/amanaiproduct/amans-claude-plugins
> and walk me through installing each plugin and skill one
> by one. Describe what each one does and let me pick.

## Plugins

| Plugin | Source | What it does |
|--------|--------|-------------|
| [plugin-dashboard](plugins/plugin-dashboard) | this repo | Shows which tools and plugins were used on every turn |
| [compound-engineering](https://github.com/EveryInc/compound-engineering-plugin) | every-marketplace | 29 agents, 22 commands, 19 skills for code review, research, and workflow automation |
| [frontend-design](https://github.com/anthropics/claude-plugins-official) | claude-plugins-official | UI/UX implementation skill for production-grade interfaces |
| [ralph-loop](https://github.com/anthropics/claude-plugins-official) | claude-plugins-official | Run Claude in a loop until task completion |
| [explanatory-output-style](https://github.com/anthropics/claude-plugins-official) | claude-plugins-official | Educational insights about implementation choices |
| [plugin-dev](https://github.com/anthropics/claude-plugins-official) | claude-plugins-official | Tools for building Claude Code plugins |

## Skills

| Skill | What it does |
|-------|-------------|
| [ccusage](skills/ccusage) | Check Claude Code token usage stats |
| [excalidraw](skills/excalidraw) | Draw and refine Excalidraw diagrams via MCP |

## Install

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
git clone https://github.com/amanaiproduct/amans-claude-plugins ~/Projects/amans-claude-plugins
claude plugin add dir:~/Projects/amans-claude-plugins
claude plugin enable plugin-dashboard@amans-plugins

# Skills
cp -r ~/Projects/amans-claude-plugins/skills/* ~/.claude/skills/
```
