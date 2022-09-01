import { useContractFunction, useEthers } from "@usedapp/core";
import { constants, utils } from "ethers";
import TokenFarm from "../chain-info/contracts/TokenFarm.json";
import networkMapping from "../chain-info/deployments/map.json";
import { Contract } from "@ethersproject/contracts";
import ERC20 from "../chain-info/contracts/MockERC20.json";
import { useEffect, useState } from "react";

export const useStakeTokens = (tokenAddress: string) => {
  //address
  //abi
  //chainId
  const { chainId } = useEthers();
  const { abi } = TokenFarm;
  const tokenFarmAddress = chainId
    ? networkMapping[String(chainId)]["tokenFarm"]
    : constants.AddressZero;
  const tokenFarmInterface = new utils.Interface(abi);
  const tokenFarmContract = new Contract(tokenAddress, tokenFarmInterface);

  const erc20Interafce = new utils.Interface(ERC20.abi);
  const erc20Contract = new Contract(tokenAddress, erc20Interafce);

  const [amountToStake, setAmountToStake] = useState("0");
  //aprove
  const { send: approveERC20Send, state: approveAndStakeERC20State } =
    useContractFunction(erc20Contract, "approve", {
      transactionName: "Approve ERC20 Transfer",
    });

  const approveToStake = (amount: string) => {
    setAmountToStake(amount);
    return approveERC20Send(tokenFarmAddress, amount);
  };

  const { send: stakeSend, state: stakeState } = useContractFunction(
    tokenFarmAddress,
    "stakeTokens",
    { transactionName: "Stake token" }
  );

  useEffect(() => {
    if (approveAndStakeERC20State.status == "Success") {
      stakeSend(amountToStake, tokenAddress);
    }
  }, [approveAndStakeERC20State, amountToStake, tokenAddress]);

  return { approveToStake, approveAndStakeERC20State };
};
