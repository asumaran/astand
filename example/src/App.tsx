import './App.css';
import { useState } from '@astand/index.tsx';

function App() {
  const [count, setCount] = useState(1);
  const [text, setText] = useState('Hola');

  function handleCountClick() {
    setCount((prev) => {
      return prev + 1;
    });
  }

  function handleTextClick() {
    setText((prev) => {
      return prev + ' mundo';
    });
  }

  return (
    <div>
      <button onClick={handleCountClick}>Set State</button>
      <div>Count: {count}</div>
      <button onClick={handleTextClick}>Set Text</button>
      <div>Texto: {text}</div>
    </div>
  );
}

export default App;
