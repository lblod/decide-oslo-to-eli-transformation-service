import { app } from "mu";
import bodyParser from "body-parser";

app.use(
  bodyParser.json({
    type: function (req) {
      return /^application\/json/.test(req.get("content-type"));
    },
  })
);

app.get("/hello", function (req, res) {
  res.send("Hello mu-javascript-template");
});
