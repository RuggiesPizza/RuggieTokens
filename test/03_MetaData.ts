import { expect } from "chai";
import { ethers } from "hardhat";

describe("Metadata Test", function () {
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

  it("Verify hidden traits", async function () {
    let override = {value: ethers.parseEther("30")};
    await RugTARDS.connect(addr1).mint(1, override);

    expect(await RugTARDS.tokenURI(1)).to.equal("https://ruggiespizza.com/rugtards/hidden/hidden.json");
  });

  it("Verify revealed traits", async function () {
    let override = {value: ethers.parseEther("30")};
    await RugTARDS.connect(addr1).mint(1, override);

    await RugTARDS.updateURI('https://ruggiespizza.com/rugtards/', 'https://ruggiespizza.com/rugtards/rugged/rugged2.json');
    await RugTARDS.updateHiddenTraits();

    expect(await RugTARDS.tokenURI(9)).to.equal("https://ruggiespizza.com/rugtards/9.json");
  });

  it("Verify rugged traits", async function () {
    let override = {value: ethers.parseEther("30")};
    await RugTARDS.connect(addr1).mint(1, override);

    await RugTARDS.updateHiddenTraits();

    override = {value: ethers.parseEther("1")};
    await RugTARDS.rugpull(1, override);

    expect(await RugTARDS.tokenURI(1)).to.equal("https://ruggiespizza.com/rugtards/rugged/rugged.json");
  });
});