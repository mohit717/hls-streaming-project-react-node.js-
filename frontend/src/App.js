import { useState } from 'react';
import SingleResolution from './components/single-resolution/SingleResolution';
import MultiResolution from './components/multi-resolution/MultiResolution';

function App() {
  const [resType, setResType] = useState("")
  return (
    <div>
      <h1>Adaptive Bitrate Video Streaming</h1>
      <input type="radio" name="type" onChange={() => setResType('single')}/>  Single Resolution
      <input type="radio" name="type" onChange={() => setResType('multi')}/>  Multiple Resolution

      {resType === 'single' && <SingleResolution />}
      {resType === 'multi' && <MultiResolution />}
    </div>
  );
}

export default App;
