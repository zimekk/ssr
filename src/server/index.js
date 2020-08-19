import render from "./render";
console.log("server");

export default ({ assetsByChunkName }) => (req, res) =>
  res.send(render(Object.values(assetsByChunkName)));
