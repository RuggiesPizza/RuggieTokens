// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC721Enumerable, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract PIZZABOX is ERC721Enumerable, Ownable {
    /// @dev Whole Token URI
    string public URI;
    // Token Symbol
    string public constant SYMBOL = "PIZZABOX";
    // Token Name
    string public constant TOKEN_NAME = "Ruggie's Anniversary Party Pizza Box";

    /// Custom Errors
    error InvalidTokenID();
    error InvalidOnwer();

    constructor(uint256 initial_mint)
        ERC721(TOKEN_NAME, SYMBOL)
        Ownable(_msgSender())
    {
        // Mint the total supply, no minting will be allowed after this
        cook(initial_mint);
    }

    /// @dev Create more boxes to giveaway
    /// @param amount Amount to mint
    function cook(uint256 amount) public onlyOwner {
        for (uint256 i; i < amount; i++) {
            _mint(msg.sender, (totalSupply() + 1));
        }
    }

    /// @dev Returns TokenURI for Marketplaces
    /// @param tokenId The ID of the Token you want Metadata for
    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        return string(abi.encodePacked(URI));
    }

    /// @dev Toggles the mint status (used for moving to IPFS full mint)
    /// @param newURI the new URI
    function updateURI(string calldata newURI) external onlyOwner {  
        URI = newURI;
    }

    /// @dev Register my contract on Sonic FeeM
    function registerMe() external {
        (bool _success,) = address(0xDC2B0D2Dd2b7759D97D50db4eabDC36973110830).call(
            abi.encodeWithSignature("selfRegister(uint256)", 111)
        );
        require(_success, "FeeM registration failed");
    }
}