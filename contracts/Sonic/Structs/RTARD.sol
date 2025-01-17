// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

struct RTARD {
    // Status of NFT
    bool isRugged;
    // How many times this NFT has been rugged
    uint256 totalRugged;
    // Last rugged by
    address lastRugger;
}