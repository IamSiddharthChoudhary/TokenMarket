import React, { useState } from "react";
import { Token } from "./Main";
import { Button, Input } from "@material-ui/core";
import { formatUnits } from "@ethersproject/units";
import { useTokenBalance, useEthers } from "@usedapp/core";
import { useStakeTokens } from "../hooks/useStakeTokens";
import { utils } from "ethers";

interface StakeTokenInterface {
  token: Token;
}

export const StakeToken = ({ token }: StakeTokenInterface) => {
  const { address: tokenAddress, name } = token;
  const { account } = useEthers();
  const tokenBalance = useTokenBalance(tokenAddress, account);
  const formattedTokenBalance: number = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0;

  const [amount, setAmount] = useState<
    number | string | Array<number | string>
  >(0);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount =
      event.target.value === "" ? "" : Number(event.target.value);
    setAmount(newAmount);
  };

  const { approveToStake, approveERC20State } = useStakeTokens(tokenAddress);
  const handleSubmit = () => {
    const amountToWei = utils.parseEther(amount.toString());
    return approveToStake(amountToWei.toString());
  };

  return (
    <div>
      <Input onChange={handleInput} />
      <Button onClick={handleSubmit}>Stake</Button>
    </div>
  );
};
