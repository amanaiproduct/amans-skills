# Agents

When a task fits one of these agents, use it via the Task tool with the matching `subagent_type`. Launch multiple in parallel when their work is independent.

## Research
- `compound-engineering:research:repo-research-analyst` — onboard to a codebase, understand structure and conventions
- `compound-engineering:research:framework-docs-researcher` — fetch official docs and version-specific patterns for a framework
- `compound-engineering:research:best-practices-researcher` — research industry standards and community conventions
- `compound-engineering:research:git-history-analyzer` — trace code evolution, blame, contributors, and why patterns exist

## Design
- `compound-engineering:design:figma-design-sync` — detect and fix visual diffs between implementation and Figma
- `compound-engineering:design:design-implementation-reviewer` — compare live UI against Figma, generate actionable feedback
- `compound-engineering:design:design-iterator` — iteratively refine UI through screenshot-analyze-improve cycles

## Code Review
- `compound-engineering:review:pattern-recognition-specialist` — detect design patterns, anti-patterns, naming issues, duplication
- `compound-engineering:review:kieran-python-reviewer` — high-bar Python review: Pythonic patterns, type safety, maintainability
- `compound-engineering:review:kieran-typescript-reviewer` — high-bar TypeScript review: type safety, modern patterns, no `any`
- `compound-engineering:review:performance-oracle` — find performance bottlenecks, N+1 queries, memory leaks, scalability issues
- `compound-engineering:review:security-sentinel` — security audit: OWASP, input validation, auth, hardcoded secrets
- `compound-engineering:review:code-simplicity-reviewer` — final pass for YAGNI violations and simplification opportunities
- `compound-engineering:review:architecture-strategist` — architectural review: SOLID, boundaries, dependencies, anti-patterns
- `compound-engineering:review:data-integrity-guardian` — review migrations, constraints, transactions, privacy compliance
- `compound-engineering:review:data-migration-expert` — validate data migrations, backfills, production transformations
- `compound-engineering:review:agent-native-reviewer` — ensure every UI action has an agent equivalent

## Deployment
- `compound-engineering:review:deployment-verification-agent` — go/no-go checklists with SQL verification, rollback plans, monitoring

## Workflow
- `compound-engineering:workflow:pr-comment-resolver` — implement requested changes from PR review comments
- `compound-engineering:workflow:bug-reproduction-validator` — reproduce and validate bug reports systematically
- `compound-engineering:workflow:spec-flow-analyzer` — analyze specs for flow completeness, edge cases, and gaps
