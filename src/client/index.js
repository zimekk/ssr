import React from "react";
import { hydrate } from "react-dom";
import { App } from "../containers/App";

console.log(["client"]);

hydrate(<App />, document.getElementById(process.env.ROOT_ELEMENT));
