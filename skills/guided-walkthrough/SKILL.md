---
name: guided-walkthrough
description: "Add a guided walkthrough to a web UI: a step-by-step spotlight tour that dims the page, highlights one element at a time, and explains it in a small popover with Back, Next and Skip. Use whenever the user asks for a tour, walkthrough, onboarding, product tour, 'show me around', first-run guide or feature showcase for a dashboard, viewer, tool or app, and offer it when you finish building any interface with more than a few panels, since a new user will not know where to look. Works for React, Vue, Svelte and plain HTML."
---

# Guided walkthrough

A walkthrough answers "what am I looking at, and where do I start?" for someone who has never seen the interface. It spotlights one real element at a time and says what it is in a sentence or two. Done well it replaces a README. Done badly it is a wall of popovers people close on step two, so most of this skill is about what goes in the steps, not the mechanics.

The mechanics are bundled:

- `assets/tour.js` is the runner, as an ES module for projects with a bundler. It is framework-free and takes driver.js as an argument.
- `assets/tour.global.js` is the same runner as a classic script, for a plain HTML page.
- `assets/tour.css` themes the popover from colour and radius tokens.
- `assets/steps.example.js` shows the shape of a step list.

Copy them into the project, then write the steps. Do not rewrite the runner unless the project cannot use driver.js; it already handles the awkward parts described under "What the runner does".

## 1. Give the tour a place to happen

A tour falls apart when a step lands on an empty state: a chart with no data, a table with no rows, a tab that only appears after some action. Before writing any step, decide what state the tour runs in.

- If the interface always has content, tour the real thing.
- If it can be empty or its content varies, ship a small sample record that exercises every feature the tour mentions, and run the tour on that. Say so on every step with the `footnote` option ("This tour uses sample data."). People should never mistake a demonstration for their own numbers.
- Keep the tour on as few screens as possible. Each hop between routes is a moment where the reader loses their place.
- Do not tour a control that does nothing yet. Prototypes often have a filter or an export button with no behaviour behind it; a step describing it teaches something false. Leave it out and tell the user which controls you skipped and why.

## 2. Mark the targets

Add a `data-tour="name"` attribute to each element a step will point at, and select on that: `[data-tour="filters"]`. Class names and generated ids change when someone restyles or refactors; a `data-tour` attribute says "a tour depends on this" to whoever edits the markup next.

Mark the smallest container that is the thing being described. Highlighting a whole page section to talk about one button leaves the reader hunting. If a step needs to open a tab or menu first, give that control its own attribute too (`data-tour="tab-table"`).

## 3. Write the steps

Steps are plain data: see `assets/steps.example.js`. Write them as a list first, read the list top to bottom as if you had never seen the product, then wire it up.

**Order by what a newcomer needs, not by layout.** Start with what the page is for, then the main thing to look at, then how to change what is shown, then where detail lives. Aim for roughly one step per main area: four is fine for a small page, and most interfaces need fewer than twelve. Do not pad. Past about fifteen, split it: a short main tour, with deeper tours started from the feature they explain.

**Each step is one idea.**

- The title names the thing, as the interface labels it: "Filters", "Step timeline". Not "Powerful filtering".
- The body says what it is and what the reader can do with it, in one to three sentences. Use the words on the screen. Bold the one control you want them to find.
- If the step performs an action for them, say so: "We just opened the **Table** tab, at the top of this panel." They see the result and learn where the control is. Silent changes are disorienting.
- Leave out anything they do not need on day one. A tour that explains every control teaches none of them.

**A step that changes the page owns that change.** If step four opens the Table tab, step three needs its own `action` that opens the Chart tab, or pressing Back from four shows the wrong view. Give every step whose view could have been altered an action that puts its view in place.

**Put the popover where it does not cover what it describes.** Set `side` per step. For a wide element near the top use `bottom`; for a left-hand list use `right`. A target taller than about half the window leaves no room above or below once it is scrolled to the middle, and the popover lands on top of it. Point the step at a smaller element inside it, such as the panel's heading or tab row.

Step text is inserted as HTML, so it can use `<b>` and `<code>`. For that reason it must be text you wrote. Never interpolate user data, names or anything fetched into a step; if a step must mention a live value, escape it first.

## 4. Wire it in

Install driver.js 1.x and load its stylesheet, then the bundled theme:

```js
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import './tour.css'
import { startTour, startTourOnce } from './tour.js'
import { steps } from './tourSteps.js'

const run = () => startTour({ driver, steps, navigate, footnote: 'This tour uses sample data.' })
```

- `navigate` is the router's function for changing route (`useNavigate()` in React Router, `router.push` in Vue or Next). Leave it out for a single-screen interface and omit `path` from the steps.
- `onFinish` runs once however the tour ends: Done, Skip, the close button, Escape or a click on the dimmed page. Use it to put things back. A tour that opened tabs or selected a row should restore what was showing before it started, so record that state before calling `startTour` and restore it here. With routes, return the reader to the page they started from.
- Starting a tour while one is running does nothing, so the entry button needs no guard of its own.

**Plain HTML, no bundler.** A page opened straight from disk cannot import modules, so use the classic build. Copy `driver.js.iife.js` and `driver.css` from driver.js's `dist/` folder, plus `tour.global.js` and `tour.css`, next to the page:

```html
<link rel="stylesheet" href="tour/driver.css">
<link rel="stylesheet" href="tour/tour.css">
...
<button id="take-tour" type="button">Take the tour</button>
...
<script src="tour/driver.js.iife.js"></script>
<script src="tour/tour.global.js"></script>
<script>
  const click = (sel) => document.querySelector(sel)?.click()
  const steps = [
    { sel: '[data-tour="summary"]', title: 'The week in three figures', body: '…' },
    { sel: '[data-tour="tabs"]', title: 'Table', body: 'We just opened the <b>Table</b> tab.', action: () => click('[data-tour="tab-table"]') },
  ]
  const run = () => GuidedTour.startTour({ driver: window.driver.js.driver, steps })
  document.getElementById('take-tour').addEventListener('click', run)
  window.tourSteps = steps // lets you run GuidedTour.checkTour({ steps: tourSteps }) from the console
</script>
```

Those files must travel with the page. If the page has to be a single file, paste the four files' contents into its own `<style>` and `<script>` blocks.

**Give it a visible, permanent entry point**: a "Take the tour" button in the header, help menu or empty state. That button is the real feature. Auto-starting is optional: if you do, use `startTourOnce('myapp-tour-seen', run)` so it happens on the first visit only, and never auto-start over a task the user has already begun. The "seen" marker lives in that browser's storage, so a page shared as a file will auto-start once for each person who opens it.

## 5. Make it look like part of the product

`assets/tour.css` draws every colour from `--tour-*` tokens. Map them to the project's own design tokens once, as the comment at the top of the file shows, so the popover matches the product in every theme it has. Unmapped, the tokens fall back to the browser's page and text colours, which is right for an unstyled page and wrong for a product with its own dark theme, so do the mapping whenever the product has tokens.

Use the product's actual accent colour for the Next button. If the product has none, keep the neutral default. Do not reach for purple, indigo or violet, alone or in a gradient. That family is the untouched default of generated interfaces and makes the whole product read as unconsidered. The same goes for glows and sparkle icons on the tour button.

Set `--tour-radius` and `--tour-button-radius` to the product's own corner radii; the popover inherits the page's font. It should look like a tooltip the product already had.

## 6. Check every step resolves

A tour breaks silently: someone renames a panel and step seven starts skipping. After writing the steps, and after any later change to the interface, run the bundled check with the app open:

```js
import { checkTour } from './tour.js'
await checkTour({ steps, navigate })   // logs a table of steps whose target never appeared
// plain HTML page, from the browser console:
await GuidedTour.checkTour({ steps: tourSteps })
```

Then go through the tour once by hand, forwards and backwards, at a narrow window width as well as a wide one. If you test it in a headless browser, use real time. A virtual-time budget lets the tour's timers run ahead of network requests, so targets on a freshly loaded route look missing when they are not. Look for a popover covering its own target, a step that fires before its tab has opened, and the page not scrolling the target into view. Say which of these you checked when you report the work.

## What the runner does

Knowing this stops you from working against it.

- Only one tour runs at a time; a second start is ignored.
- Before each step it changes route if the step's `path` differs from the current one, runs the step's `action`, then waits up to three seconds for the target to exist. Content that loads late is fine.
- A target that never appears is skipped with a console warning. The tour never hangs on a missing element.
- It scrolls the target to the middle of the view, then highlights it.
- If the app re-renders and replaces the highlighted element, for example when data arrives after a route change, it highlights the replacement. Without this the spotlight stays on a node that is no longer on the page.
- Back and Next re-render on the next tick. Calling driver.js's highlight from inside its own button handler makes Back stop working.
- It adds a "Skip tour" button to every step and wires the corner close button, which driver.js leaves dead once custom button handlers are set.
- Every exit runs `onFinish` exactly once. driver.js's own end-of-tour hook does not fire reliably for a tour driven step by step, so the runner does not depend on it.
- It finds targets by polling on a timer. Animation frames stop in background tabs and headless test browsers, which would leave a tour waiting forever.
- It turns off animation and smooth scrolling for people who have asked their system for reduced motion.
- Each popover shows its position, such as "3 of 9".

## When not to add one

Skip the tour for a single-purpose page whose controls are all visible and labelled; fix the labels instead. A tour is also the wrong fix for an interface that is confusing because of its layout. Say so, and offer to simplify the layout first.
