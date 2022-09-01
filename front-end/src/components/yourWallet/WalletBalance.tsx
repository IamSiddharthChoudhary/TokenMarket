import { Token } from "../Main";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import { BalanceMsg } from "../BalanceMsg";

export interface WalletbalanceProps {
  token: Token;
}

export const WalletBalance = ({ token }: WalletbalanceProps) => {
  const { image, address, name } = token;
  const { account } = useEthers();
  const tokenBalance = useTokenBalance(address, account);
  const formatedToken: number = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0;
  return (
    <BalanceMsg
      label={`Your un-staked ${name} balance`}
      tokenImg={image}
      amount={formatedToken}
    ></BalanceMsg>
  );
};
