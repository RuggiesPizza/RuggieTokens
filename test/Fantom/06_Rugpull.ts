import { expect } from "chai";
import { ethers } from "hardhat";

describe("Fantom Metadata Test", function () {
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


  it("Validate Rugpull price can't be under", async function () {
    let override = {value: ethers.parseEther("30")};
    await RugTARDS.connect(addr1).mint(1, override);

    await RugTARDS.updateHiddenTraits();

    override = {value: ethers.parseEther("0.25")};
    await expect(RugTARDS.rugpull(1, override)).to.be.revertedWithCustomError(RugTARDS, 'InvalidPayment()');
  });
});