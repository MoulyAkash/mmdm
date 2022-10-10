import React, { useContext, useState } from 'react'

import App from './App';

export const LibraryContext = React.createContext();

function GlobalContext() {

  const [library, setUserLibrary] = useState([]);

  const setLibrary = (library) => {
    setUserLibrary(library);
  }

  return (
    <LibraryContext.Provider value={{ library, setLibrary }}>
      <App />
    </LibraryContext.Provider>
  )
}

export default GlobalContext
