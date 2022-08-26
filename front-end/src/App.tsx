import React from 'react';
import './App.css';
import {DAppProvider,ChainId} from "@usedapp/core"
import {Header} from "./components/Header"
import {Container} from "@material-ui/core"

function App() {
  return (
    <DAppProvider config={{supportedChains: [ChainId.Kovan, ChainId.Rinkeby] }}>
      <Header></Header>
      <Container maxWidth="md">
        <div id="App-logo-spin">
          Jatt
        </div>
      </Container>
    </DAppProvider> 
  )
}

export default App;
