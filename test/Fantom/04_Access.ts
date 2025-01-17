import { expect } from "chai";
import { ethers } from "hardhat";

describe("Fantom Access Test", function () {
  let RugTARDS: any;
  let Ruggie: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;

  beforeEach(async function() {
    RugTARDS = await ethers.getContractFactory("RugTARDS");
    Ruggie = await ethers.getContractFactory("Ruggie");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    //Deploy Ruggie.sol
    Ruggie = await Ruggie.deploy();
    await Ruggie.waitForDeployment();
    
    //Deploy RugTARDS.sol
    RugTARDS = await RugTARDS.deploy(Ruggie.getAddress());
    await RugTARDS.waitForDeployment();
  });

  it("Verify Update Access", async function () {
    await expect(RugTARDS.connect(addr1).updateBeneficiary(await owner.getAddress())).to.be.reverted;
    await expect(RugTARDS.connect(addr1).updateHiddenTraits()).to.be.reverted;
    await expect(RugTARDS.connect(addr1).updateMintStatus()).to.be.reverted;
    await expect(RugTARDS.connect(addr1).updatePrice(5, 1)).to.be.reverted;
    await expect(RugTARDS.connect(addr1).updateURI('', '')).to.be.reverted;
    await expect(RugTARDS.connect(addr1).withdraw()).to.be.reverted;
  });

});