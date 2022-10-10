import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import GlobalContext from './GlobalContext';
// import './samples/electron-store'
// import './samples/preload-module'

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <GlobalContext />
  </StrictMode>
)