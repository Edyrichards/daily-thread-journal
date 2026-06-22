
import React from 'react'; // Added for StrictMode
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './fonts';
import './index.css';
import { ThemeProvider } from "next-themes"; // Added
import { initNative } from './lib/native';

initNative();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
    >
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
