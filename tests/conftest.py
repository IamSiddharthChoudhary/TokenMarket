from web3 import Web3
import pytest


@pytest.fixture
def accountStaked():
    return Web3.toWei(1, "ether")
