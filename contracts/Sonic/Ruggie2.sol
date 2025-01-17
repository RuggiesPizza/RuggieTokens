// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20, ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Ruggie2 is ERC20, ERC20Burnable, ERC20Permit, Ownable {

    /// @notice Token Information
    uint256 public constant TOTAL_SUPPLY = 2222222222 ether;
    // Token Symbol
    string public constant SYMBOL = "RUGGIE";
    // Token Name
    string public constant TOKEN_NAME = "Ruggie's Pizza";

    event RugPulled(address indexed from);

    constructor()
        ERC20(TOKEN_NAME, SYMBOL)
        ERC20Permit(TOKEN_NAME)
        Ownable(_msgSender())
    {
        // Mint the total supply, no minting will be allowed after this
        _mint(_msgSender(), TOTAL_SUPPLY);
    }

    /// @notice Rug Pull the entire project
    /// @dev Easter Egg
    function  rugpull() external {
        emit RugPulled(_msgSender());
    }
}