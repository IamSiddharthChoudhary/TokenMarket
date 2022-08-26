import json
from pickle import TRUE
from brownie import JattToken, TokenFarm, config, network
from scripts.helpfulScripts import getAccount, getContract
from web3 import Web3
import yaml

KEPT_BALANCE = Web3.toWei(100, "ether")


def deployTokenFarmAndToken(updateFront=False):
    account = getAccount()
    jattToken = JattToken.deploy({"from": account})
    tokenFarm = TokenFarm.deploy(
        jattToken,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    tx = jattToken.transfer(
        tokenFarm.address, jattToken.totalSupply() - KEPT_BALANCE, {"from": account}
    )
    tx.wait(1)

    wethToken = getContract("WETH_Token")
    fauToken = getContract("DAI_Token")
    dicOfAllowedToken = {
        jattToken: getContract("dai_usd_pricefeed"),
        fauToken: getContract("dai_usd_pricefeed"),
        wethToken: getContract("WETH_Token"),
    }
    if updateFront == True:
        updateFrontEnd()
    addAllowedTokens(tokenFarm, dicOfAllowedToken, account)
    return tokenFarm, jattToken


def addAllowedTokens(tokenFarm, dictOfAllowedToken, account):
    for token in dictOfAllowedToken:
        addTx = tokenFarm.addTokenAllowed(token.address, {"from": account})
        addTx.wait(1)
        setTx = tokenFarm.setPriceFeed(
            token.address, dictOfAllowedToken[token], {"from": account}
        )
        setTx.wait(1)
    return tokenFarm


def updateFrontEnd():
    with open("brownie-config.yaml", "r") as brownieConfig:
        configDict = yaml.load(brownieConfig, Loader=yaml.FullLoader)
        with open("./front-end/src/brownie-config.json", "w") as brownieConfigJson:
            json.dump(configDict, brownieConfig)
        print("Front end updated!f")


def main():
    deployTokenFarmAndToken(updateFront=True)
