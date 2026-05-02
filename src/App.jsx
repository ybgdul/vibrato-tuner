import { usePitchDetector } from './hooks/usePitchDetector';
import { TunerDisplay } from './components/TunerDisplay';
import './App.css';

function App() {
  const {pitch, clarity, isActive, start, stop } = usePitchDetector();

  return(
    <div className="app">
      <h1>tuner 1</h1>

      <div className="controls">
        {!isActive ? (
          <button onClick={start}>Start the shit</button>
        ) : (
          <button onClick={stop}>Stop the shit</button>
        )}
      </div>

      <TunerDisplay pitch={pitch} clarity={clarity} isActive={isActive} />

      <div className="status">
        {isActive && `Clarity: ${(clarity * 100).toFixed(0)}%`}
      </div>
    </div>
  );
}

export default App;