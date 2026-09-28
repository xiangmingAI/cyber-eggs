# AGENTS.md

## Mission

Build the static showcase for `cyber-eggs`. The site explains that developers can collect legitimate free AI quotas, but this phase does not collect or publish real offers.

## Read first

1. `docs/IMPLEMENTATION_PLAYBOOK.md`
2. `docs/showcase-design.md`
3. The concept image linked by the task you are implementing

## Hard rules

- Keep the site static and deployable to GitHub Pages.
- Use Astro, TypeScript, native CSS, and native browser JavaScript.
- Do not add React, Vue, Tailwind, a database, a server, authentication, or state-management libraries.
- Do not add a dependency unless the assigned task cannot be completed with the platform or existing dependencies. Run `npm audit` after any dependency change.
- Keep one offer per JSON file under `src/data/eggs/`.
- Demo offers must use fictional providers, `.example` URLs, and `"demo": true`.
- Do not publish real claims without an official source and an explicit user request to start the collection phase.
- Preserve keyboard focus, semantic HTML, readable contrast, and `prefers-reduced-motion` support.
- Run `npm run validate` before marking a task complete.
- Update the matching task and evidence row in `docs/IMPLEMENTATION_PLAYBOOK.md`.

## AI commit policy

Every AI-created commit subject must start with `[AI]`.

Example:

```text
[AI] feat: implement mobile egg cards
```

Never create an AI commit without the `[AI]` prefix.

Git author identity for this repo is set to `向明 <332400562+xiangmingAI@users.noreply.github.com>` (repo-local config). Do not add `Co-Authored-By` trailers or any bot co-author lines to commits.

## Scope discipline

Implement one playbook task ID at a time. Do not silently expand a UI task into data collection, subscriptions, analytics, an admin panel, or a new framework.
