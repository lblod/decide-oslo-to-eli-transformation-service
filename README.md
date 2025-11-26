# Decide - OSLO to ELI transformation service

## About
This service transforms OSLO besluiten to ELI. It can get its input data from two graphs, one where the typed OSLO resources reside, and one holding the actual OSLO data. In case there is not distinction between the two, the corresponding environment variables can be set to the same graph. All ELI data is written to an output graph.

## Usage
Trigger the transformation job by POSTing to `/transform` on the service.

```bash
curl -X POST http://localhost:80/transform
```

The endpoint replies immediately with `202 Accepted`. The heavy SPARQL querying and insertion work continues asynchronously.

### Configuration

| Env var                          | Description                                            | Default                                    |
| -------------------------------- | ------------------------------------------------------ | ------------------------------------------ |
| `BATCH_SIZE`                     | Batch size (`LIMIT`) for SPARQL queries.               | 100                                        |
| `SLEEP_BETWEEN_BATCHES`          | Delay between SPARQL queries/inserts, in milliseconds. | 1000                                       |
| `INPUT_DECISION_RESOURCES_GRAPH` | Source graph containing typed OSLO decision resources. | `http://mu.semte.ch/graphs/oslo-decisions` |
| `INPUT_DATA_GRAPH`               | Source graph containing OSLO decision data.            | `http://mu.semte.ch/graphs/oslo-decisions` |
| `OUTPUT_GRAPH`                   | Target graph for ELI decision data.                    | `http://mu.semte.ch/graphs/eli-decisions`  |