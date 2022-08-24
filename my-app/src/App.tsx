import React from 'react';
import logo from './logo.svg';
import './App.css';
import {DAppProvider, ChainId} from "@usedapp/core"
import {Header} from "./components/Header"

function App() {
  return (
    <DAppProvider config={
      {
        supportedChains: [ChainId.Kovan, ChainId.Rinkeby]
      }
    }>
    <Header/>
    <h1>Sat Shri Akaal Ji</h1>
  </DAppProvider>
  );
}

export default App;
