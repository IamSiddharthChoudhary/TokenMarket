import React from "react";
import "./App.css";
import { DAppProvider, ChainId } from "@usedapp/core";
import { Header } from "./components/Header";
import { Container } from "@material-ui/core";
import { Main } from "./components/Main";

function App() {
  return (
    <DAppProvider
      config={{
        supportedChains: [ChainId.Kovan, ChainId.Rinkeby],
        notifications: {
          expirationPeriod: 1000,
          checkInterval: 1000,
        },
      }}
    >
      <Header></Header>
      <Container maxWidth="md">
        <div id="App-logo-spin">Jatt</div>
        <Main />
      </Container>
    </DAppProvider>
  );
}

export default App;
