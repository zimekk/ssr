import React, { useState } from "react";

export const App = () => {
  const [counter, setCounter] = useState(1);
  return <button onClick={(e) => setCounter(counter + 1)}>{counter}</button>;
};
