import { Token } from "../Main";
import { Box } from "@material-ui/core";

interface YourWalletProps {
  supportedTokens: Array<Token>;
}

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
  return (
    <Box>
      <h1>Your Wallet</h1>
      <Box>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>
      </Box>
    </Box>
  );
};
