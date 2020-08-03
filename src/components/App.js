import React, { useState } from 'react';
export default () => {
  const [counter, setCounter] = useState(1);
  return (
    <button onClick={e => setCounter(counter + 1)}>{counter}</button>
  )
}