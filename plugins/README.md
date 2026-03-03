# Plugins

Plugins that ship with this repo. Each subdirectory is a standalone Claude Code plugin.

| Plugin | What it does |
|--------|-------------|
| [plugin-dashboard](plugin-dashboard) | Per-turn tool usage visualizer — badge, box, or full system map |
| [explanatory-output-style](explanatory-output-style) | Educational insights on every turn via SessionStart hook |

## Adding a new plugin

Create a directory under `plugins/` with a `.claude-plugin/plugin.json` manifest. The parent repo's `marketplace.json` registers it under the `amans-plugins` marketplace name.

See the [plugin-dev docs](https://github.com/anthropics/claude-plugins-official) or run `/create-plugin` for scaffolding.
