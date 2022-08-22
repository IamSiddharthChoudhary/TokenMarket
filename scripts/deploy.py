from brownie import JattToken, TokenFarm, config, network
from scripts.helpfulScripts import getAccount, getContract
from web3 import Web3

KEPT_BALANCE = Web3.toWei(100, "ether")


def deployTokenFarmAndToken():
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


def main():
    deployTokenFarmAndToken()
