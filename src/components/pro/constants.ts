/** Shared (client + server) option lists for the Pro portal forms. */
export const RESPONSE_TIMES = ["~15 mins", "~30 mins", "~1 hour", "~2 hours", "Same day"] as const;

export const PRICE_TYPES = [
  { value: "FIXED", label: "Fixed price" },
  { value: "STARTING_FROM", label: "Starting from" },
  { value: "PER_UNIT", label: "Per unit" },
  { value: "MILESTONE", label: "Milestone" },
] as const;
