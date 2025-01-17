// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Ruggie2 is ERC20, ERC20Burnable, ERC20Permit, Ownable {

    /// @notice Token Information
    uint256 public constant _totalSupply = 2222222222 ether;
    // Token Symbol
    string public constant _symbol = "RUGGIE";
    // Token Name
    string public constant _name = "Ruggie's Pizza";

    event RugPulled(address indexed from);

    constructor()
        ERC20(_name, _symbol)
        ERC20Permit(_name)
        Ownable(_msgSender())
    {
        // Mint the total supply, no minting will be allowed after this
        _mint(_msgSender(), _totalSupply);
    }

    /// @notice Rug Pull the entire project
    /// @dev Easter Egg
    function  rugpull() external {
        emit RugPulled(_msgSender());
    }
}