// @ts-nocheck
import React, { useContext, useState } from 'react'

import App from './App';

export const TitleContext = React.createContext();
export const TitleContextUpdate = React.createContext();
export const FilesContext = React.createContext();
export const FilesContextUpdate = React.createContext();
export const PageContext = React.createContext();
export const PageContextUpdate = React.createContext();

export function useTitle() {
  return useContext(TitleContext);
}

export function setTitle() {
  return useContext(TitleContextUpdate);
}

export function useFiles() {
  return useContext(FilesContext);
}

export function setFiles() {
  return useContext(FilesContextUpdate);
}

export function usePage() {
  return useContext(PageContext);
}

export function setPage() {
  return useContext(PageContextUpdate);
}

function GlobalContext() {

  const [title, setTitle] = useState('MMDM');
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState('home');

  function updateTitle(t) {
    setTitle(t);
  }

  function updateFiles(f) {
    setFiles(f);
  }

  function updatePage(p) {
    setPage(p);
  }

  return (
    <FilesContext.Provider value={files}>
      <FilesContextUpdate.Provider value={updateFiles}>
        <TitleContext.Provider value={title}>
          <TitleContextUpdate.Provider value={updateTitle}>
            <PageContext.Provider value={page}>
              <PageContextUpdate.Provider value={updatePage}>
                <App />
              </PageContextUpdate.Provider>
            </PageContext.Provider>
          </TitleContextUpdate.Provider>
        </TitleContext.Provider>
      </FilesContextUpdate.Provider>
    </FilesContext.Provider>
  )
}

export default GlobalContext
