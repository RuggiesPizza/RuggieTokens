// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721Enumerable, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Local Imports
import {RTARD} from "./Structs/RTARD.sol";

contract RugTARDS2 is ERC721, ERC721Enumerable, Ownable {
    /// @dev Base Token URI
    string public baseURI;
    /// @dev Contract Beneficiary
    address public beneficiary;
    /// @dev Max Supply
    uint256 public maxSupply = 420;
    /// @dev List of Rugged RugTARDS
    mapping(uint256 => RTARD) public rugged;
    /// @dev URI if rugged
    string public ruggedURI;
    /// @dev track totalSupply
    uint256 internal totalSupply;

    // Custom Errors
    error invalidAmount();
    error InvalidPayment();
    error InvalidQuantity();
    error InvalidToken();
    error MintedOut();
    error MintingClosed();

    // Custom Events
    event Rugged(uint256 tokenId, address rugger);
    event StatusChange(bool newStatus);

    constructor(address benef) ERC721("RugTARDS", "RTARD") Ownable(_msgSender())
    {
        beneficiary = benef;
        totalSupply = 0;
    }


    /// @dev Airdrop $RTARD to holders from Fantom
    /// @param holders list of holder addresses (must be in exact order from Fantom)
    function airdrop(address[] calldata holders) external onlyOwner {
        uint256 length = holders.length;
        if(maxSupply < totalSupply + length) { revert MintedOut(); }
        for (uint256 i; i < length; i++) {
            totalSupply = totalSupply + 1;
            _safeMint(holders[i], totalSupply);
        }
    }

    /// @dev Receives an ERC-20 token payment, distributes 2% to ERC-721 holders, and 98% to the specific address.
    /// @param token The ERC-20 token to receive and distribute.
    /// @param amount The amount of the ERC-20 token to distribute.
    function distributePayment(address token, uint256 amount) external {
        if(amount < 0) { revert invalidAmount(); }
        if(IERC20(token).balanceOf(address(this)) < amount) { revert invalidAmount(); }

        // Distribute to RTARD holders
        uint256 perTokenShare = amount / totalSupply;
        for (uint256 i = 1; i < totalSupply; i++) {
            address holder = ownerOf(i);
            if (holder != address(0) && perTokenShare > 0) {
                IERC20(token).transfer(holder, perTokenShare);
            }
        }
    }

    /// @dev Easter Egg
    /// @param tokenId The NFT you want to rug
    function rugpull(uint256 tokenId) external payable {
        if(tokenId > totalSupply) { revert InvalidToken(); }
        // 1 FTM to rug an NFT
        if(1 ether > msg.value) { revert InvalidPayment(); }
        rugged[tokenId].totalRugged++;
        rugged[tokenId].lastRugger = _msgSender();
        rugged[tokenId].isRugged = true;
        emit Rugged(tokenId, _msgSender());
    }

    /// @dev Update the beneficiary
    /// @param newBeneficiary The new address
    function updateBeneficiary(address newBeneficiary) external onlyOwner {
        beneficiary = newBeneficiary;
    }

    /// @dev Toggles the mint status (used for moving to IPFS full mint)
    /// @param newURI the new URI
    /// @param newRugged the new Rugged URI
    function updateURI(string calldata newURI, string calldata newRugged) external onlyOwner {  
        baseURI = newURI;
        ruggedURI = newRugged;
    }

    /// @dev Withdraw balance of Gas Token
    function withdraw() external onlyOwner {
        payable(beneficiary).transfer(address(this).balance);
    }

    /// @dev Withdraw balance of ERC-20 token
    /// @param token Token address to withdraw
    function withdrawToken(address token) external onlyOwner {
        IERC20(token).transfer(beneficiary, IERC20(token).balanceOf(address(this)));
    }    

    /// @dev Returns TokenURI for Marketplaces
    /// @param tokenId The ID of the Token you want Metadata for
    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        return string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json"));
    }
}