// Example steps for a reports app with two routes. Copy the shape, not the content.
// Targets are data-tour attributes added to the markup, never CSS classes or generated ids.

const click = (sel) => document.querySelector(sel)?.click()

export const steps = [
  {
    path: '/reports',
    sel: '[data-tour="summary"]',
    title: 'This week at a glance',
    body: 'Three figures summarise the week. Each compares with the week before, so a green arrow means better, whatever the direction.',
    side: 'bottom',
  },
  {
    path: '/reports',
    sel: '[data-tour="filters"]',
    title: 'Filters',
    body: 'Narrow every chart on the page by team or date. The address bar updates, so a filtered view can be shared as a link.',
    side: 'bottom',
  },
  {
    path: '/reports',
    sel: '[data-tour="panel"]',
    title: 'Switch to the table',
    // The step opens the tab itself, then says so: the reader sees the result and learns where the control is.
    action: () => click('[data-tour="tab-table"]'),
    body: 'We just opened the <b>Table</b> tab, at the top of this panel. It holds the same rows the chart draws, ready to sort or export.',
    side: 'top',
  },
  {
    path: '/reports/r-104',
    sel: '[data-tour="timeline"]',
    title: 'One report, step by step',
    body: 'Opening a row shows its full history. Select any entry to see what changed and who changed it.',
    side: 'right',
    note: 'Report r-104 is sample data that ships with the tour.',
  },
]
