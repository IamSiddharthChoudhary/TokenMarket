/* eslist-disable spaced-comment */
/// <reference types="react-scripts"/>
import { useEthers } from "@usedapp/core";
import helperConfig from "../helper-config.json";
import networkMapping from "../chain-info/deployments/map.json";
import Config from "../brownie-config.json";
import jattImg from "../images/jattToken.png";
import wethImg from "../images/wethToken.jpg";
import { YourWallet } from "./yourWallet/yourwallet";
import { constants } from "ethers";
import daiImg from "../images/dai.png";

export type Token = {
  image: string;
  address: string;
  name: string;
};

export const Main = () => {
  const { chainId } = useEthers();
  const networkName = chainId ? helperConfig[chainId] : "dev";
  const jattTokenAddress = chainId
    ? networkMapping[String(chainId)]["JattToken"][0]
    : constants.AddressZero;
  const wethTokenAddress = chainId
    ? Config["networks"][networkName]["WETH_Token"]
    : constants.AddressZero;
  const fauTokenAddress = chainId
    ? Config["networks"][networkName]["DAI_Token"]
    : constants.AddressZero;

  const supportedTokens: Array<Token> = [
    {
      image: jattImg,
      address: jattTokenAddress,
      name: "JATT",
    },
    {
      image: wethImg,
      address: wethTokenAddress,
      name: "WETH",
    },
    {
      image: daiImg,
      address: fauTokenAddress,
      name: "DAI",
    },
  ];
  return <YourWallet supportedTokens={supportedTokens} />;
};
