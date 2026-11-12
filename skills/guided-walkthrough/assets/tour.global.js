// Guided walkthrough runner, classic-script build. Same code as tour.js, for pages that are
// opened straight from disk or have no bundler: browsers refuse to import modules from
// file:// addresses. Keep the two files in step when changing either.
//
//   <link rel="stylesheet" href="driver.css">
//   <link rel="stylesheet" href="tour.css">
//   <script src="driver.js.iife.js"></script>
//   <script src="tour.global.js"></script>
//   <script>
//     GuidedTour.startTour({ driver: window.driver.js.driver, steps })
//   </script>
//
// Steps have the same shape as in tour.js.
(function () {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  // Poll on a timer, not requestAnimationFrame: animation frames stop in a background tab
  // and in headless test browsers, which would leave the tour waiting forever.
  function waitFor(sel, timeout = 3000) {
    return new Promise((resolve) => {
      const started = Date.now()
      const look = () => {
        const el = document.querySelector(sel)
        if (el) return resolve(el)
        if (Date.now() - started > timeout) return resolve(null)
        setTimeout(look, 50)
      }
      look()
    })
  }

  let running = null // one tour at a time: a second start returns the tour already on screen

  const here = () => `${window.location.pathname}${window.location.search}`
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  /**
   * Run the walkthrough.
   * @param {object}   o
   * @param {Function} o.driver      the `driver` export of driver.js
   * @param {Array}    o.steps       step objects (see the top of this file)
   * @param {Function} [o.navigate]  (path) => void, e.g. the router's navigate. Needed only if steps set `path`.
   * @param {Function} [o.onFinish]  called once when the tour ends or is skipped
   * @param {string}   [o.footnote]  shown on every step, e.g. "This tour uses sample data."
   * @param {object}   [o.labels]    { next, back, done, skip } button text
   * @returns {{ stop: Function }}
   */
  function startTour({ driver, steps, navigate, onFinish, footnote, labels = {} }) {
    if (!steps?.length) return { stop() {} }
    if (running) return running
    const text = { next: 'Next', back: 'Back', done: 'Done', skip: 'Skip tour', ...labels }
    let index = 0
    let finished = false
    let d

    // Every way out goes through here: Skip, Done, the corner ✕, Escape, a click on the dimmed
    // page. driver.js does not reliably report the end of a tour that is driven step by step,
    // so the callback is fired here and not left to its onDestroyed hook.
    const end = () => {
      if (finished) return
      finished = true
      running = null
      d.destroy()
      onFinish?.()
    }

    d = driver({
      allowClose: true,
      animate: !reducedMotion(),
      overlayOpacity: 0.6,
      stagePadding: 6,
      stageRadius: 8,
      popoverClass: 'tour-pop',
      onDestroyStarted: end, // Escape and clicks on the dimmed page
      // A labelled way out on every step. People miss the corner ✕.
      onPopoverRender: (popover) => {
        const skip = document.createElement('button')
        skip.type = 'button'
        skip.textContent = text.skip
        skip.className = 'tour-skip'
        skip.addEventListener('click', end)
        popover.footer.insertBefore(skip, popover.footer.firstChild)
      },
    })

    const show = async () => {
      if (finished) return
      const step = steps[index]
      if (step.path && navigate && here() !== step.path) {
        navigate(step.path)
        await sleep(240) // let the route render
      }
      if (step.action) {
        step.action()
        await sleep(220) // let the tab or menu open
      }
      const el = await waitFor(step.sel)
      if (!el) {
        // Never stall on a missing target: move on, or end on the last step.
        console.warn(`[tour] step ${index + 1} target not found: ${step.sel}`)
        if (index < steps.length - 1) { index += 1; return show() }
        return end()
      }
      el.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' })
      await sleep(140)
      const small = (html) => `<div class="tour-small">${html}</div>`
      d.highlight({
        element: step.sel,
        popover: {
          title: step.title,
          description:
            (step.body ?? '') +
            (step.note ? small(step.note) : '') +
            (footnote ? small(footnote) : '') +
            `<div class="tour-count">${index + 1} of ${steps.length}</div>`,
          side: step.side ?? 'bottom',
          align: 'start',
          showButtons: ['previous', 'next', 'close'],
          nextBtnText: index === steps.length - 1 ? text.done : text.next,
          prevBtnText: text.back,
          // driver.js calls these inside its own click handler. Re-highlighting from there
          // races its bookkeeping and Back stops working, so defer to the next tick.
          onNextClick: () => {
            if (index < steps.length - 1) { index += 1; setTimeout(show, 0) } else end()
          },
          onPrevClick: () => {
            if (index > 0) { index -= 1; setTimeout(show, 0) }
          },
          // Once any on*Click is set, the corner ✕ does nothing without this.
          onCloseClick: end,
        },
      })
    }

    running = { stop: end }
    show()
    return running
  }

  /**
   * Walk every step without showing anything and report targets that never appear.
   * Run it from the console or a test after changing the UI: `await checkTour({ steps, navigate })`.
   * @returns {Promise<Array<{ step: number, title: string, sel: string }>>} the missing steps
   */
  async function checkTour({ steps, navigate, timeout = 2000 }) {
    const missing = []
    for (const [i, step] of steps.entries()) {
      if (step.path && navigate && here() !== step.path) { navigate(step.path); await sleep(240) }
      if (step.action) { step.action(); await sleep(220) }
      if (!(await waitFor(step.sel, timeout))) missing.push({ step: i + 1, title: step.title, sel: step.sel })
    }
    if (missing.length) console.table(missing)
    else console.info(`[tour] all ${steps.length} steps resolve`)
    return missing
  }

  /** Start the tour the first time a visitor arrives, and never again on that browser. */
  function startTourOnce(key, start, delay = 700) {
    try {
      if (localStorage.getItem(key)) return
      localStorage.setItem(key, '1')
    } catch {
      return // storage unavailable: do not auto-start at all
    }
    setTimeout(start, delay)
  }

  window.GuidedTour = { startTour, checkTour, startTourOnce }
})()
