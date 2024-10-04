// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RugTARDS is ERC721A, Ownable {
    /// @dev Base Token URI
    string public baseURI;
    /// @dev Contract Beneficiary
    address public beneficiary;
    /// @dev Hidden Trait flag
    bool public hiddenTraits;
    /// @dev URI before reveal
    string public hiddenURI = "https://ruggiespizza.com/rugtards/hidden/hidden.json";
    /// @dev Max Supply
    uint256 public maxSupply = 420;
    /// @dev Is Mint Open?
    bool public mintOpen;
    /// @dev Mint Price
    uint256 public mintPrice;
    /// @dev List of Rugged RugTARDS
    mapping(uint256 => bool) public rugged;
    /// @dev URI if rugged
    string public ruggedURI = "https://ruggiespizza.com/rugtards/rugged/rugged.json";
    /// @dev $RUGGIE token address
    address public ruggieContract;
    /// @dev Amount of $RUGGIE to get a discount
    uint256 public ruggieLimit;
    /// @dev Price for $RUGGIE holders
    uint256 public ruggiePrice;

    // Custom Errors
    error InvalidPayment();
    error InvalidQuantity();
    error InvalidToken();
    error MintedOut();
    error MintingClosed();

    // Custom Events
    event Rugged(uint256 tokenId, address rugger);
    event StatusChange(bool newStatus);

    constructor(address tokenContract)
        ERC721A("RugTARDS", "RTARD")
        Ownable(_msgSender())
    {
        beneficiary = _msgSender();
        // Allow minting at launch
        mintOpen = true;
        // Public mint = 30 FTM
        mintPrice = 30 ether;
        // RUGGIENOMICS
        ruggieContract = tokenContract;
        // Ruggie Holders pay 20 FTM
        ruggiePrice = 20 ether;
        ruggieLimit = 12500000000000000000000000;
        hiddenTraits = true;
        // CABRON, SHRIMP, TRUMP, SNEL, THC, SPEED, DERV1, DERV2
        _mint(_msgSender(), 8);
    }

    /// @dev Mint NFTs
    /// @param quantity Number of NFTs to mint
    function mint(uint256 quantity) external payable {
        if(!mintOpen) { revert MintingClosed(); }
        if(quantity < 1) { revert InvalidQuantity(); }
        if(_totalMinted() + quantity > maxSupply) { revert MintedOut(); }
        // Check if Minter is holding enough $RUGGIE for discount
        if(IERC20(ruggieContract).balanceOf(_msgSender()) >= ruggieLimit) {
            if((quantity * ruggiePrice) > msg.value) { revert InvalidPayment(); }
            _mint(_msgSender(), quantity);
        } else {
            // Check payment is sufficient to mint
            if((quantity * mintPrice) > msg.value) { revert InvalidPayment(); }
             _mint(_msgSender(), quantity);
        }
    }

    /// @dev Easter Egg
    /// @param tokenId The NFT you want to rug
    function rugpull(uint256 tokenId) external payable {
        if(tokenId > _totalMinted()) { revert InvalidToken(); }
        // 1 FTM to rug an NFT
        if(1 ether > msg.value) { revert InvalidPayment(); }
        rugged[tokenId] = !rugged[tokenId];
        emit Rugged(tokenId, _msgSender());
    }

    /// @dev Returns TokenURI for Marketplaces
    /// @param tokenId The ID of the Token you want Metadata for
    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        if(hiddenTraits)
            return hiddenURI;
        if(rugged[tokenId])
            return ruggedURI;
        return string(abi.encodePacked(baseURI, _toString(tokenId), ".json"));
    }

    /// @dev Update the beneficiary
    /// @param newBeneficiary The new address
    function updateBeneficiary(address newBeneficiary) external onlyOwner {
        beneficiary = newBeneficiary;
    }

    /// @dev Hide or Unhide traits
    function updateHiddenTraits() external onlyOwner {
        hiddenTraits = !hiddenTraits;
    }

    /// @dev Toggles the mint status
    function updateMintStatus() external onlyOwner {  
        mintOpen = !mintOpen;
        emit StatusChange(mintOpen);
    }

    /// @dev Update the mint price
    /// @param newPrice The new price per mint
    /// @param newRuggie The new mint price for ruggie holders
    function updatePrice(uint256 newPrice, uint256 newRuggie) external onlyOwner {
        mintPrice = newPrice;
        ruggiePrice = newRuggie;
    }

    /// @dev Update the $RUGGIE bag required to get discount
    /// @param newLimit the new amount of $RUGGIE required for discount
    function updateRuggieLimit(uint256 newLimit) external onlyOwner {
        ruggieLimit = newLimit;
    }

    /// @dev Toggles the mint status (used for moving to IPFS full mint)
    /// @param newURI the new URI
    /// @param newRugged the new Rugged URI
    function updateURI(string calldata newURI, string calldata newRugged) external onlyOwner {  
        baseURI = newURI;
        ruggedURI = newRugged;
    }

    function withdraw() external onlyOwner {
        payable(beneficiary).transfer(address(this).balance);
    }

    // overrides
    /// @dev First Mint will be Token 1
    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }
}