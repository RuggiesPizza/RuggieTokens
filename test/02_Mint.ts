import { expect } from "chai";
import { ethers } from "hardhat";

describe("Mint Test", function () {
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

  it("Verify Public Mint", async function () {
    let override = {value: ethers.parseEther("30")};
    await RugTARDS.connect(addr1).mint(1, override);

    //Verify
    expect(await RugTARDS.ownerOf(9)).to.equal(await addr1.getAddress());
  });

  it("Verify Public Batch Mint", async function () {
    let override = {value: ethers.parseEther("150")};
    await RugTARDS.connect(addr1).mint(5, override);

    //Verify
    let addr1_address = await addr1.getAddress();
    for (let i = 9; i < 13; i++) {
        expect(await RugTARDS.ownerOf(i)).to.equal(addr1_address);
    }
  });

  it("Verify RUGGIE Holder Mint", async function () {
    let override = {value: ethers.parseEther("20")};
    await RugTARDS.mint(1, override);

    //Verify
    expect(await RugTARDS.ownerOf(1)).to.equal(await owner.getAddress());
  });

  it("Verify RUGGIE Holder Batch Mint", async function () {
    let override = {value: ethers.parseEther("100")};
    await RugTARDS.mint(5, override);

    //Verify
    for (let i = 1; i < 6; i++) {
        expect(await RugTARDS.ownerOf(i)).to.equal(await owner.getAddress());
    }
  });

  it("Validate Public can't mint RUGGIE Holder price", async function () {
    expect(await Ruggie.balanceOf(await addr2.getAddress())).to.equal(0);

    let override = {value: ethers.parseEther("20")};
    await expect(RugTARDS.connect(addr2).mint(1, override)).to.be.revertedWithCustomError(RugTARDS, "InvalidPayment()");
  });

  it("Validate minting cant pass max", async function () {
    let override = {value: ethers.parseEther("4000")};
    await RugTARDS.mint(200, override);

    override = {value: ethers.parseEther("4000")};
    await RugTARDS.mint(200, override);

    override = {value: ethers.parseEther("360")};
    await RugTARDS.connect(addr1).mint(12, override);

    override = {value: ethers.parseEther("25")};
    await expect(RugTARDS.connect(addr1).mint(1, override)).to.be.revertedWithCustomError(RugTARDS, "MintedOut()");
  });

  it("Validate Mint Closed", async function () {
    await RugTARDS.updateMintStatus();
    let override = {value: ethers.parseEther("30")};
    await expect(RugTARDS.connect(addr2).mint(1, override)).to.be.revertedWithCustomError(RugTARDS, "MintingClosed()");
  });

  it("Validate Can't mint 0", async function () {
    let override = {value: ethers.parseEther("30")};
    await expect(RugTARDS.connect(addr2).mint(0, override)).to.be.revertedWithCustomError(RugTARDS, "InvalidQuantity()");
  });

  it("Validate invalid RUGGIE payment", async function () {
    let override = {value: ethers.parseEther("5")};
    await expect(RugTARDS.mint(1, override)).to.be.revertedWithCustomError(RugTARDS, "InvalidPayment()");
  });
});