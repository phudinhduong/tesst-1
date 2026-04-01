import { useEffect, useMemo, useState } from 'react';
import { fetchStacks, fetchSteps } from './api';

function App() {
  const [stacks, setStacks] = useState([]);
  const [steps, setSteps] = useState([]);
  const [selectedStackId, setSelectedStackId] = useState('');
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    async function loadStacks() {
      try {
        setLoading(true);
        const data = await fetchStacks();
        setStacks(data);
        if (data.length > 0) {
          setSelectedStackId(data[0].id);
        }
      } catch (err) {
        setError(err.message || 'Failed to load stacks');
      } finally {
        setLoading(false);
      }
    }

    loadStacks();
  }, []);

  useEffect(() => {
    async function loadSteps() {
      if (!selectedStackId) {
        setSteps([]);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await fetchSteps(selectedStackId);
        setSteps(data);
        setSelectedStepIndex(0);
      } catch (err) {
        setError(err.message || 'Failed to load steps');
      } finally {
        setLoading(false);
      }
    }

    loadSteps();
  }, [selectedStackId]);

  const selectedStep = useMemo(() => steps[selectedStepIndex], [steps, selectedStepIndex]);

  const selectedStack = useMemo(
    () => stacks.find((stack) => stack.id === selectedStackId),
    [stacks, selectedStackId]
  );

  function onCopy(command) {
    navigator.clipboard.writeText(command)
      .then(() => {
        setCopyMessage('Copied command');
        setTimeout(() => setCopyMessage(''), 1000);
      })
      .catch(() => {
        setCopyMessage('Copy failed');
        setTimeout(() => setCopyMessage(''), 1000);
      });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Deployment Guide</h1>
          <p>Learn end-to-end deployment with React, Spring Boot, and MongoDB Atlas.</p>
        </div>
        <div className="stack-selector">
          <label htmlFor="stack-select">Stack</label>
          <select
            id="stack-select"
            value={selectedStackId}
            onChange={(event) => setSelectedStackId(event.target.value)}
          >
            {stacks.map((stack) => (
              <option key={stack.id} value={stack.id}>
                {stack.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="content-grid">
        <aside className="step-list-panel">
          <h2>Steps</h2>
          <ul>
            {steps.map((step, index) => (
              <li key={step.id}>
                <button
                  className={index === selectedStepIndex ? 'step-button active' : 'step-button'}
                  onClick={() => setSelectedStepIndex(index)}
                >
                  {step.order}. {step.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="step-detail-panel">
          {loading && <p>Loading data...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && !selectedStep && <p>No steps available.</p>}

          {!loading && !error && selectedStep && (
            <>
              <div className="step-header">
                <h2>{selectedStep.title}</h2>
                <p>{selectedStack?.name}</p>
              </div>

              {selectedStack?.description && (
                <p className="stack-description">{selectedStack.description}</p>
              )}

              <p className="step-progress">
                Step {selectedStepIndex + 1} / {steps.length}
              </p>

              <p className="step-description">{selectedStep.description}</p>

              <div className="commands-block">
                <h3>Commands</h3>
                {selectedStep.commands?.map((command) => (
                  <div key={command} className="command-row">
                    <pre>{command}</pre>
                    <button onClick={() => onCopy(command)}>Copy</button>
                  </div>
                ))}
                {copyMessage && <p className="copy-message">{copyMessage}</p>}
              </div>

              {selectedStep.imagePath && (
                <div className="image-wrap">
                  <img src={selectedStep.imagePath} alt={selectedStep.title} />
                </div>
              )}

              <div className="navigation-row">
                <button
                  onClick={() => setSelectedStepIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={selectedStepIndex === 0}
                >
                  Previous
                </button>
                <button
                  onClick={() => setSelectedStepIndex((prev) => Math.min(prev + 1, steps.length - 1))}
                  disabled={selectedStepIndex >= steps.length - 1}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
