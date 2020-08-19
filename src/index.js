const express = require("express");
const path = require("path");
const app = express();
const { PORT = 8080 } = process.env;

const contentBase = path.resolve(__dirname, "../build");

app
  .get(
    "/index.html",
    require("../lib/server").default(require("../build/stats"))
  )
  .use(express.static(contentBase));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
