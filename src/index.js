import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './components/ThemeContext';
import Background from './components/Background';
import 'tailwindcss/tailwind.css';
// import { MantineProvider } from '@mantine/core';

const noop = () => { };

if (process.env.NODE_ENV === 'production') {
  // Disable the message in production mode
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    ...window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
    inject: noop,
    onCommitFiberRoot: noop,
  };
} else {
  // Disable the message in development mode
  // console.log("Disabling React DevTools in development mode");
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    ...window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
    renderers: [],
    supportsFiber: true,
    inject: noop,
    onCommitFiberRoot: noop,
  };
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <MantineProvider withGlobalStyles withNormalizeCSS> */}
        <ThemeProvider>
          <Background>
            <App />
          </Background>
        </ThemeProvider>
    {/* </MantineProvider> */}
  </React.StrictMode>
);