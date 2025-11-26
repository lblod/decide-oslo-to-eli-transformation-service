import { app } from "mu";
import bodyParser from "body-parser";
import { querySudo, updateSudo } from "@lblod/mu-auth-sudo";
import { transformationQueries } from "./queries";
import { BATCH_SIZE, SLEEP_BETWEEN_BATCHES } from "./environment";

app.use(
  bodyParser.json({
    type: function (req) {
      return /^application\/json/.test(req.get("content-type"));
    },
  })
);

app.post("/transform", async (_, res, next) => {
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
  for (const queryKey of Object.keys(transformationQueries)) {
    const total = await fetchCountForKey(queryKey);
    if (!total) {
      console.info(`[${queryKey}] Skipping transformation, nothing to insert.`);
      continue;
    }

    await transformAndInsertTriplesForKey(queryKey, total);
  }
}

async function fetchCountForKey(queryKey) {
  const { count: countQuery } = transformationQueries[queryKey];

  console.info(`[${queryKey}] Counting properties to transform.`);
  const response = await querySudo(countQuery);
  await sleep();

  const bindings = response?.results?.bindings ?? [];
  if (!bindings.length) return 0;

  const countValue = bindings[0]?.count?.value;
  const parsed = parseInt(countValue, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function transformAndInsertTriplesForKey(queryKey, total) {
  const { insert: buildInsertQuery } = transformationQueries[queryKey];

  for (let offset = 0; offset < total; offset += BATCH_SIZE) {
    const insertQuery = buildInsertQuery(BATCH_SIZE, offset);

    console.info(
      `[${queryKey}] Executing transformation (limit=${BATCH_SIZE}, offset=${offset}).`
    );
    await updateSudo(insertQuery);
    await sleep();
  }
}

async function sleep() {
  if (SLEEP_BETWEEN_BATCHES > 0) {
    console.info(`Sleeping for ${SLEEP_BETWEEN_BATCHES} ms.`);
    return new Promise((resolve) => setTimeout(resolve, SLEEP_BETWEEN_BATCHES));
  }
}
