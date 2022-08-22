// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm {
    mapping(address => mapping(address => uint256)) public tokenStakedByUser;
    mapping(address => uint256) public uniqueTokensStaked;
    mapping(address => address) public tokenToPriceFeed;
    address[] public allowedTokens;
    address[] public stakers;
    address owner;
    IERC20 public jattToken;

    constructor(address _JattTokenAddress) public {
        jattToken = IERC20(_JattTokenAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not authorized to do this/");
        _;
    }

    function setPriceFeed(address _token, address _priceFeed) public onlyOwner {
        tokenToPriceFeed[_token] = _priceFeed;
    }

    function stakeTokens(uint256 _amount, address _token) public {
        require(_amount > 0, "Please, enter amount greater than 0.");
        require(tokenAllowed(_token), "This token is not allowed yet.");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, _token);
        tokenStakedByUser[_token][msg.sender] =
            tokenStakedByUser[_token][msg.sender] +
            _amount;
        if (uniqueTokensStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function unStakeTokens(address _token) public {
        uint256 balance = tokenStakedByUser[_token][msg.sender];
        require(balance > 0, "There are no tokens to get unstaked.");
        IERC20(_token).transfer(msg.sender, balance);
        tokenStakedByUser[_token][msg.sender] = 0;
        uniqueTokensStaked[msg.sender] -= 1;
    }

    function issueToken() public onlyOwner {
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipent = stakers[i];
            uint256 userTotalValue = getUserTotalValue(recipent);
            jattToken.transfer(recipent, userTotalValue);
        }
    }

    function getUserTotalValue(address _user) public view returns (uint256) {
        uint256 totalValue = 0;
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            totalValue = totalValue + getAssetValue(_user, allowedTokens[i]);
        }
        return totalValue;
    }

    function getAssetValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        if (uniqueTokensStaked[_user] <= 0) {
            return 0;
        }
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        return ((tokenStakedByUser[_token][_user] * price) / 10**decimals);
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        // PriceFeed
        address priceFeedAddress = tokenToPriceFeed[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
    }

    function updateUniqueTokensStaked(address _user, address _token) public {
        if (tokenStakedByUser[_token][_user] <= 0) {
            uniqueTokensStaked[_user] = uniqueTokensStaked[_user] + 1;
        }
    }

    function addTokenAllowed(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function tokenAllowed(address _token) public returns (bool) {
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            if (allowedTokens[i] == _token) {
                return true;
            }
            return false;
        }
    }
}
