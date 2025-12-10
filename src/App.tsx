import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './pages/Routes';

import 'styles/globals.css';

export function App() {
  return (
    <>
      <GlobalStyles />
      <GlobalPortal.Provider>
        <Routes />
      </GlobalPortal.Provider>
    </>
  );
}
