// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20, ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TICKET is ERC20, ERC20Burnable, ERC20Permit, Ownable {

    // Token Symbol
    string public constant SYMBOL = "TICKET";
    // Token Name
    string public constant TOKEN_NAME = "Ruggie's Anniversary Party Ticket";

    /// Custom Errors
    error NotEnoughTICKETs();

    constructor(uint256 initial_mint)
        ERC20(TOKEN_NAME, SYMBOL)
        ERC20Permit(TOKEN_NAME)
        Ownable(_msgSender())
    {
        // Mint the total supply, no minting will be allowed after this
        _mint(_msgSender(), initial_mint);
    }

    /// @dev Airdrop tickets to an array of addresses
    /// @param _addresses Airdrop addresses
    /// @param amount Amount to airdrop
    function airdrop(address[] calldata _addresses, uint256 amount) external onlyOwner {
        for (uint256 i = 0; i < _addresses.length; i++) {
            _mint(_addresses[i], amount);
        }
    }

    /// @dev Register my contract on Sonic FeeM
    function registerMe() external {
        (bool _success,) = address(0xDC2B0D2Dd2b7759D97D50db4eabDC36973110830).call(
            abi.encodeWithSignature("selfRegister(uint256)", 111)
        );
        require(_success, "FeeM registration failed");
    }    
}
