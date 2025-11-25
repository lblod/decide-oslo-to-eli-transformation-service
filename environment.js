export const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 100;
export const SLEEP_BETWEEN_BATCHES =
  parseInt(process.env.SLEEP_BETWEEN_BATCHES) || 1000;

export const INPUT_RESOURCES_GRAPH =
  process.env.INPUT_RESOURCES_GRAPH ||
  "http://mu.semte.ch/graphs/oslo-decisions/ghent/besluit";
export const INPUT_DATA_GRAPH =
  process.env.INPUT_DATA_GRAPH ||
  "http://mu.semte.ch/graphs/oslo-decisions/landing";
export const OUTPUT_GRAPH =
  process.env.OUTPUT_GRAPH || "http://mu.semte.ch/graphs/eli-decisions/ghent";
