import { expect } from "chai";
import { ethers } from "hardhat";

describe("Sonic Deployment Test", function () {
  let RugTARDS: any;
  let Ruggie: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;

  let ownerAddress: any;
  let ruggieAddress: any;

  beforeEach(async function() {
    RugTARDS = await ethers.getContractFactory("RugTARDS2");
    Ruggie = await ethers.getContractFactory("Ruggie2");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    ownerAddress= await owner.getAddress();

    //Deploy Ruggie.sol
    Ruggie = await Ruggie.deploy();
    await Ruggie.waitForDeployment();
    ruggieAddress = await Ruggie.getAddress();

    //Deploy RugTARDS.sol
    RugTARDS = await RugTARDS.deploy(ownerAddress);
    await RugTARDS.waitForDeployment();

    await RugTARDS.updateURI('https://ruggiespizza.com/rugtards/','https://ruggiespizza.com/rugtards/rugged/rugged.json');
  });

  it("Verify Deployment", async function () {
    // Verify Ruggie Deployment
    // Total Supply
    expect(await Ruggie.totalSupply()).to.equal(ethers.parseEther("2222222222"));
    // Null Address owns contract
    expect(await Ruggie.owner()).to.equal(ownerAddress);
    // Deployer owns full supply
    expect(await Ruggie.balanceOf(owner.getAddress())).to.equal(ethers.parseEther("2222222222"));

    // Verify RugTARD Deployment
    // Total Supply
    expect(await RugTARDS.name()).to.equal('RugTARDS');
    expect(await RugTARDS.symbol()).to.equal('RTARD');
    expect(await RugTARDS.owner()).to.equal(await owner.getAddress());
    expect(await RugTARDS.maxSupply()).to.equal(420);
    expect(await RugTARDS.ruggedURI()).to.equal("https://ruggiespizza.com/rugtards/rugged/rugged.json");
    let rtard1 = await RugTARDS.rugged(1);
    expect(rtard1[0]).to.be.false;
    expect(rtard1[1]).to.equal(0);
    expect(rtard1[2]).to.equal('0x0000000000000000000000000000000000000000');
  });
});