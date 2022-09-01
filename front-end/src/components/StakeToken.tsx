import React, { useEffect, useState } from "react";
import { Token } from "./Main";
import { Button, Input, CircularProgress } from "@material-ui/core";
import { formatUnits } from "@ethersproject/units";
import { useTokenBalance, useEthers, useNotifications } from "@usedapp/core";
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

  const { notifications } = useNotifications();
  const [amount, setAmount] = useState<
    number | string | Array<number | string>
  >(0);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount =
      event.target.value === "" ? "" : Number(event.target.value);
    setAmount(newAmount);
  };

  useEffect(() => {
    if (
      notifications.filter(
        (notifications) =>
          notifications.type === "transactionSucceed" &&
          notifications.transactionName === "Approve ERC20 Transfer"
      ).length > 0
    ) {
      console.log("Approved");
    }
    if (
      notifications.filter(
        (notifications) =>
          notifications.type === "transactionSucceed" &&
          notifications.transactionName === "Stake token"
      ).length > 0
    ) {
      console.log("Token Staked");
    }
  }, [notifications]);

  const { approveToStake, approveAndStakeERC20State } =
    useStakeTokens(tokenAddress);
  const handleSubmit = () => {
    const amountToWei = utils.parseEther(amount.toString());
    return approveToStake(amountToWei.toString());
  };

  const Mining = approveAndStakeERC20State.status === "Mining";

  return (
    <div>
      <Input onChange={handleInput} />
      <Button
        onClick={handleSubmit}
        color="primary"
        size="large"
        disabled={Mining}
      >
        {Mining? <CircularProgress size={26} /> : "Staked!!"}
      </Button>
    </div>
  );
};
