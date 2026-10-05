// Copied from the landing's src/styles/global.css @theme; keep in step with it.
export const C = {
  ink: "#1f2421",
  inkSoft: "#49524c",
  green: "#2f7d5b",
  greenDeep: "#256549",
  amber: "#b9762a",
  amberDeep: "#8f5716",
  paper: "#fdfefd",
  offwhite: "#f4f6f4",
  cream: "#faf5ea",
  ticketRule: "#e4d3b4",
  hairline: "#d3ddd6",
} as const;

// 1080p sizes. Captions must stay readable when the film plays 390 px wide.
export const TYPE = {
  caption: 56,
  chapter: 72,
  title: 96,
  endPrice: 64,
  small: 48,
} as const;

// The house curve: fast out, long settle.
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
