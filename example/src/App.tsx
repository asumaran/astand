import './App.css';
import { useState } from '../../src/index';

function App() {
  console.log('App render');
  const [count, setCount] = useState(1);

  function handleClick() {
    setCount((prev) => {
      return prev + 1;
    });
  }
  return (
    <div>
      <button onClick={handleClick}>Set State</button>
      <div>Count: {count}</div>
    </div>
  );
}

export default App;
