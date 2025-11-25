import { app } from "mu";
import bodyParser from "body-parser";
import { updateSudo } from "@lblod/mu-auth-sudo";
import { transformationQueries } from "./queries";
import { BATCH_SIZE, SLEEP_BETWEEN_BATCHES } from "./environment";

app.use(
  bodyParser.json({
    type: function (req) {
      return /^application\/json/.test(req.get("content-type"));
    },
  })
);

app.post("/extract-subjects", async (req, res, next) => {
  try {
    transformAndInsertTriples().catch((error) =>
      console.error("Transformation flow failed unexpectedly.", error)
    );

    return res.status(202).json({
      data: {
        type: "transformation-job",
        attributes: {
          status: "queued",
        },
      },
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        errors: [{ title: error.message }],
      });
    }

    return next(error);
  }
});

async function transformAndInsertTriples() {
  // Loop over queries in transformationQueries
  // For each, call transformAndInsertTriplesForQuery()
}

async function transformAndInsertTriplesForQuery(insertQuery) {
  // Run insert query multiple times using updateSudo and BATCH_SIZE
  // Increase offset
  // Call sleep() after each run
}

async function sleep() {
  if (SLEEP_BETWEEN_BATCHES > 0) {
    console.info(`Sleeping for ${SLEEP_BETWEEN_BATCHES} ms.`);
    return new Promise((resolve) => setTimeout(resolve, SLEEP_BETWEEN_BATCHES));
  }
}
