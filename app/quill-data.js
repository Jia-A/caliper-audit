// Every number on the landing page, from the Quill report in public/report/quill.html
// (caliper-ai 0.6.0, Nov 14, 2026: --runs 2 --server-runs 1 --stop). Change them only from a new report.

// Run 2, the one warm run: the hero bar.
export const WARM = {
  total: 1514,
  segs: [
    { name: "click → request sent", ms: 3, limit: 200 },
    { name: "browser: response headers received", ms: 926, limit: 600 },
    { name: "headers → first paint", ms: 585, limit: 100 },
  ],
};

// Both runs, segment by segment (Details → Timeline per run).
export const RUNS = [
  {
    label: "run 1",
    cold: true,
    total: 1646,
    segs: [
      { k: "click", name: "click → fetch() called", ms: 5 },
      { k: "preflight", name: "CORS preflight", ms: 183 },
      { k: "ttfb", name: "browser: response headers received", ms: 1182 },
      { k: "paint", name: "headers → first paint", ms: 276 },
    ],
  },
  {
    label: "run 2",
    cold: false,
    total: 1514,
    segs: [
      { k: "click", name: "click → request sent", ms: 3 },
      { k: "ttfb", name: "browser: response headers received", ms: 926 },
      { k: "paint", name: "headers → first paint", ms: 585 },
    ],
  },
];

// The Request Map (marked visit 1). Sizes only: the text is never recorded.
export const PROMPT = {
  total: 5827,
  messages: [
    {
      role: "1 system",
      bytes: 2499,
      share: 43,
      parts: [
        { name: "instructions", bytes: 2499, source: "app" },
        { name: "rest of message 1", bytes: 0, source: "unknown" },
      ],
    },
    {
      role: "2 user",
      bytes: 3328,
      share: 57,
      parts: [
        { name: "author", bytes: 25, source: "user" },
        { name: "title", bytes: 33, source: "user" },
        { name: "code_snippet", bytes: 57, source: "app" },
        { name: "article", bytes: 3207, source: "user" },
        { name: "rest of message 2", bytes: 6, source: "unknown" },
      ],
    },
  ],
  bySource: [
    { source: "app", bytes: 2556, share: 44 },
    { source: "user", bytes: 3265, share: 56 },
    { source: "outside", bytes: 0, share: 0 },
    { source: "unknown", bytes: 6, share: 0 },
  ],
};

// The verdict and Advice, word for word.
export const VERDICT = "People waited 1514 ms for the first word in the one warm run.";
export const VERDICT_SIDES = [
  "In the browser: headers → first paint — 5.8× its limit, in 1 of 1 warm runs.",
  "Inside the server: postgres — 5.1× its limit, in 1 of 1 marked visits.",
];
// The server's top "Where to look" item (marked visit 1, on the server's clock).
export const SERVER_TOP = { name: "postgres", ms: 506, limit: 100, ratio: "5.1×", share: 48 };
export const ADVICE = [
  {
    line: "The first run (a fresh browser) waited 132 ms longer for the first word than the one warm run (1646 vs 1514 ms).",
    why: "CORS preflight: 183 ms on the first run, not in the warm runs (+183 ms, more than its 100 ms limit). Caliper can't tell why from timings alone.",
  },
  {
    line: "article is 55% of the prompt (3207 of 5827 bytes, labelled user).",
    why: "Caliper's own threshold: one named part is 50% or more of the prompt's measured bytes, more than all the rest together. These are bytes your app reported, not tokens; Caliper didn't measure what trimming it would change.",
  },
];

// The Stop check.
export const STOP = [
  { k: "pixels", text: "output stopped changing", ms: 0, after: "ms after Stop" },
  { k: "network", text: "aborted by the browser (net::ERR_ABORTED)", ms: 15, after: "ms after Stop; 0 bytes after the abort" },
  { k: "end", text: "no normal end (no requestfinished)" },
];
