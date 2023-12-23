import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './components/ThemeContext';
import Background from './components/Background';
import 'tailwindcss/tailwind.css';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
// import { MantineProvider } from '@mantine/core';
import store from './store/store';
import { Provider } from 'react-redux';

if (process.env.NODE_ENV === 'production') {
  console.log("Disabling React DevTools in production mode");
  disableReactDevTools();
}
const noop = () => { };


if (process.env.NODE_ENV === 'production') {
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
  <Provider store={store}>
    <React.StrictMode>
      {/* <MantineProvider withGlobalStyles withNormalizeCSS> */}
      <ThemeProvider>
        <Background>
          <App />
        </Background>
      </ThemeProvider>
      {/* </MantineProvider> */}
    </React.StrictMode>
  </Provider>
);