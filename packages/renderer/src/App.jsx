// @ts-nocheck
import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import './App.less';

import AppWindow from './components/AppWindow';

function App() {

  return (
    <HashRouter>
      <AppWindow />
    </HashRouter>
  );
}

export default App;