from asyncio import exceptions
from scripts.helpfulScripts import (
    getAccount,
    getContract,
    LOCAL_DEVELOPMENT_ENVIRONMENTS,
)
from scripts.deploy import deployTokenFarmAndToken
from brownie import exceptions, network
import pytest


def test_stake_token():
    if network.show_active() not in LOCAL_DEVELOPMENT_ENVIRONMENTS:
        pytest.skip("Only for local networks")
    account = getAccount()
    tokenFarm, jattToken = deployTokenFarmAndToken()
    jattToken.approve(tokenFarm.address, 100, {"from": account})
    balanceBefore = jattToken.balanceOf(account)
    print(f"The balance of tokens in account before staking is {balanceBefore}")
    tokenFarm.addTokenAllowed(jattToken.address, {"from": account})
    tokenFarm.stakeTokens(100, jattToken, {"from": account})
    balanceAfter = jattToken.balanceOf(account)
    print(f"The balance of tokens in account after staking is {balanceAfter}")
    assert balanceBefore - balanceAfter == 100
    assert tokenFarm.uniqueTokensStaked(account) > 0
    assert tokenFarm.tokenStakedByUser(jattToken.address, account.address) == 100
    return tokenFarm, jattToken


def test_issueToken():
    if network.show_active() not in LOCAL_DEVELOPMENT_ENVIRONMENTS:
        pytest.skip("Only for local networks")
    account = getAccount()
    tokenFarm, jattTooken = test_stake_token()
    value = 1640000000000000000000
    initialBalance = jattTooken.balanceOf(account.address)
    tokenFarm.issueToken({"from": account})
    finalBalance = jattTooken.balanceOf(account.address)
    assert finalBalance == initialBalance + value


def test_set_token_price_feed():
    if network.show_active() not in LOCAL_DEVELOPMENT_ENVIRONMENTS:
        pytest.skip("Only for local networks")
    account = getAccount()
    newOwner = getAccount(index=1)
    tokenFarm, jattToken = deployTokenFarmAndToken()
    priceFeed = getContract("eth_usd_pricefeed")
    tokenFarm.setPriceFeed(jattToken.address, priceFeed.address, {"from": account})
    assert tokenFarm.tokenToPriceFeed(jattToken.address) == priceFeed.address
    with pytest.raises(exceptions.VirtualMachineError):
        tokenFarm.setPriceFeed(jattToken, priceFeed, {"from": newOwner})
