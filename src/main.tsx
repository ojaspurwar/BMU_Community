import React from 'react';
import ReactDOM from 'react-dom/client';
import HomePage from './app/page';
import { CampusPulseProvider } from './lib/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CampusPulseProvider>
      <HomePage />
    </CampusPulseProvider>
  </React.StrictMode>
);
