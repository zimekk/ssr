import React from "react";
import { renderToString } from "react-dom/server";
import { App } from "../containers/App";

console.log(["render"]);

export default (chunks) => `<!DOCTYPE html>
${renderToString(
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <link rel="icon" href={require("../assets/favicon.ico")} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content="Web site created using ssr" />
      <title>{require("../../package").name}</title>
    </head>
    <body>
      <div id={process.env.ROOT_ELEMENT}>
        <App />
      </div>
      {chunks.map((src, key) => (
        <script key={key} src={src} />
      ))}
    </body>
  </html>
)}`;
