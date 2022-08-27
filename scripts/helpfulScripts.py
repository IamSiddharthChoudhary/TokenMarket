from distutils.command.config import config
from brownie import (
    Contract,
    accounts,
    network,
    config,
    interface,
    LinkToken,
    MockV3Aggregator,
    MockDAI,
    MockWeth,
)

LOCAL_DEVELOPMENT_ENVIRONMENTS = [
    "development",
    "mainnet-fork",
    "ganache",
    "ganache-cli",
]

contractToMock = {
    "link": LinkToken,
    "eth_usd_pricefeed": MockV3Aggregator,
    "dai_usd_pricefeed": MockV3Aggregator,
    "DAI_Token": MockDAI,
    "WETH_Token": MockWeth,
}


def getAccount(index=None):
    if index:
        return accounts[index]
    if network.show_active() not in LOCAL_DEVELOPMENT_ENVIRONMENTS:
        return accounts.add(config["keys"]["privateKey"])
    else:
        return accounts[0]


def deployMocks():
    print(f"Deploying mocks...")
    account = getAccount()
    link = LinkToken.deploy({"from": account})
    print(f"Linktoken deployed to {link.address}")
    pricefeed = MockV3Aggregator.deploy(18, 1640000000000000000000, {"from": account})
    print(f"MockV3Aggregator deployed to {pricefeed.address}")
    dai = MockDAI.deploy({"from": account})
    print(f"DAI token mock deployed to {dai.address}")
    weth = MockWeth.deploy({"from": account})
    print(f"WETH token mock deployedd to {weth.address}")
    print("Deployed Mocks!!")


def getContract(contractName):
    contractType = contractToMock[contractName]
    if network.show_active() in LOCAL_DEVELOPMENT_ENVIRONMENTS:
        if len(contractType) <= 0:
            deployMocks()
        contract = contractType[-1]
    else:
        contractAddress = config["networks"][network.show_active()][contractName]
        contract = Contract.from_abi(
            contractType._name, contractAddress, contractType.abi
        )
    return contract
