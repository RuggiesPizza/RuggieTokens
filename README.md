<p align="center">
<img src="https://github.com/RuggiesPizza/RuggieTokens/blob/dev/images/ruggEtext.png" width="750">
</p>

[![Smart Contract Lint & Tests](https://github.com/RuggiesPizza/RuggieTokens/actions/workflows/test-lint.yml/badge.svg)](https://github.com/RuggiesPizza/RuggieTokens/actions/workflows/test-lint.yml)

Ruggie's Pizza token contracts include; $RUGGIE and $RTARD. The ERC-20 token $RUGGIE came first, with it's easter egg rugpull function.
To raise liquidity for $RUGGIE, the ERC-721 $RTARD was created. $RTARD comes with it's own easter egg rugpull function. All 420 $RTARD NFT's
can be rugged of their traits, affecting their rarity rank and more.

<img align="left" width="100" height="100" src="https://github.com/RuggiesPizza/RuggieTokens/blob/dev/images/newRuggieLogo.png">
<br><br>
Contract Address:
```
0xB2a909b8bCce9B30BbC9d4c748fD897d6AD9c285
```

<br><br>

<img align="left" width="100" height="100" src="https://github.com/RuggiesPizza/RuggieTokens/blob/dev/images/RTARD.png">

Contract Address:
```
Coming Soon!
```

## Snapshots
- [$RTARD Sonic Migration (16-01-2025)](https://github.com/RuggiesPizza/RuggieTokens/blob/dev/snapshots/2025_RTARD_SonicMigration.txt)

## Developer Notes
### Install Requirements
The first steps are to clone the repository and install dependencies
```sh
git clone https://github.com/RuggiesPizza/RuggieTokens.git
cd RuggieTokens
npm i --force
```

### Tests
In repository's root folder run this to test the contract(s):
```sh
npx hardhat test
```

### Solhint
Run Solhint "Security and Style Guide validations" scanner on the contract(s):
```sh
solhint 'npx contracts/**/*.sol'
```
