import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // CHAMA O USEEFFECT 2 VscAzureDevops, MONTA E REMONTAR OS COMPONENTES PARA SIMULAR COMPORTAMENTOS COMO ATUALIZAÇÕES INESPERADAS
  <React.StrictMode> 
    <App />
  </React.StrictMode>
);