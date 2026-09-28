# cyber-eggs Project Memory

## Project metadata

- Project: cyber-eggs / 赛博鸡蛋
- Stage: static showcase skeleton
- Stack: Astro 7.3.5, TypeScript 6.0.3, native CSS and browser JavaScript
- Source of truth: `docs/IMPLEMENTATION_PLAYBOOK.md`

## Decision Record: static-first showcase

**Date**: 2026-09-28  
**Problem**: The project needs a GitHub-native showcase skeleton that smaller models can complete without operating a backend.

### Options

| Option | Advantages | Disadvantages | Complexity |
| --- | --- | --- | --- |
| Static Astro site with JSON content and GitHub Pages | One data source, cheap hosting, build-time validation | No per-user state or server queries | Low |
| Dynamic application with database and server API | Supports accounts and runtime writes | More infrastructure and maintenance before demand exists | High |

### Decision

Use a static Astro site. Keep one egg per JSON file, validate at build time, and generate pages, JSON endpoints, and RSS from one collection.

**Reason**: It satisfies the current display and GitHub publishing goals with the fewest moving parts.  
**Trade-offs**: Filtering is client-side and data updates require a new build.

### Impact

- No database, authentication, admin panel, React, Vue, or Tailwind.
- Git history and future GitHub workflows provide auditability.
- Real data collection remains a separate phase.

### Reversal condition

Introduce a server only when a confirmed feature cannot be delivered with static generation and GitHub-native workflows.

## Project conventions

- All showcase offers are fictional, use `.example` URLs, and set `demo: true`.
- Unknown requirements use `null`, never `false`.
- AI commit subjects start with `[AI]`.
- Run `npm run validate` before completing any coding task.
