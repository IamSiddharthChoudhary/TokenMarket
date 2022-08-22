// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract JattToken is ERC20 {
    constructor() public ERC20("Jatt", "Jatt") {
        _mint(msg.sender, 1 * 10**21);
    }
}
