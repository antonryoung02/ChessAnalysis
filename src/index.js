import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GameStateProvider } from './contexts/GameStateContext';
import { EvaluationProvider } from './contexts/EvaluationContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GameStateProvider>
      <EvaluationProvider>
        <App />
      </EvaluationProvider>
    </GameStateProvider>
  </React.StrictMode>
);


