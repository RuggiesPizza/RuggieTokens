import { expect } from "chai";
import { ethers } from "hardhat";

describe("Fantom Deployment Test", function () {
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

  it("Verify Deployment", async function () {
    // Verify Ruggie Deployment
    // Total Supply
    expect(await Ruggie.totalSupply()).to.equal(ethers.parseEther("2222222222"));
    // Null Address owns contract
    expect(await Ruggie.owner()).to.equal('0x0000000000000000000000000000000000000000');
    // Deployer owns full supply
    expect(await Ruggie.balanceOf(owner.getAddress())).to.equal(ethers.parseEther("2222222222"));

    // Verify RugTARD Deployment
    // Total Supply
    expect(await RugTARDS.name()).to.equal('RugTARDS');
    expect(await RugTARDS.symbol()).to.equal('RTARD');
    expect(await RugTARDS.owner()).to.equal(await owner.getAddress());
    expect(await RugTARDS.maxSupply()).to.equal(420);
    expect(await RugTARDS.hiddenURI()).to.equal("https://ruggiespizza.com/rugtards/hidden/hidden.json");
    expect(await RugTARDS.ruggedURI()).to.equal("https://ruggiespizza.com/rugtards/rugged/rugged.json");
    expect(await RugTARDS.ruggieContract()).to.equal(await Ruggie.getAddress());
    expect(await RugTARDS.rugged(1)).to.equal(false);
  });

  it("Verify Mint Status", async function () {
    expect(await RugTARDS.mintOpen()).to.equal(true);
    await RugTARDS.updateMintStatus();
    expect(await RugTARDS.mintOpen()).to.equal(false);
  });

  it("Verify Price Switch", async function () {
    expect(await RugTARDS.mintPrice()).to.equal(ethers.parseEther("30"));
    expect(await RugTARDS.ruggiePrice()).to.equal(ethers.parseEther("20"));
    await RugTARDS.updatePrice(ethers.parseEther("20"), ethers.parseEther("10"));
    expect(await RugTARDS.mintPrice()).to.equal(ethers.parseEther("20"));
    expect(await RugTARDS.ruggiePrice()).to.equal(ethers.parseEther("10"));
  });
});