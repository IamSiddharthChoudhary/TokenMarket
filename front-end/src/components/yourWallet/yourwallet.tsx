import { Token } from "../Main";
import React, { useState } from "react";
import { Box } from "@material-ui/core";
import { Tabs, Tab } from "@material-ui/core";

interface YourWalletProps {
  supportedTokens: Array<Token>;
}

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
  const [selectedTokenIndex, setSelectedTokenIndex] = useState < number > [0];
  return (
    <Box>
      <h1>Your Wallet</h1>
      <Box>
        <Tabs value={selectedTokenIndex.toString()} onChange={} centered>
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>
      </Box>
    </Box>
  );
};
