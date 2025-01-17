import { expect } from "chai";
import { ethers } from "hardhat";

describe("Sonic Mint Test", function () {
  let RugTARDS: any;
  let Ruggie: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;

  let ownerAddress: any;
  let addr1Address: any;
  let ruggieAddress: any;

  beforeEach(async function() {
    RugTARDS = await ethers.getContractFactory("RugTARDS2");
    Ruggie = await ethers.getContractFactory("Ruggie2");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    addr1Address = await addr1.getAddress();
    //Deploy Ruggie.sol
    Ruggie = await Ruggie.deploy();
    await Ruggie.waitForDeployment();
    ruggieAddress = await Ruggie.getAddress();

    //Deploy RugTARDS.sol
    RugTARDS = await RugTARDS.deploy(ownerAddress);
    await RugTARDS.waitForDeployment();

    await RugTARDS.updateURI('https://ruggiespizza.com/rugtards/','https://ruggiespizza.com/rugtards/rugged/rugged.json');
  });

  it("Verify Airdrop", async function () {
    await RugTARDS.airdrop([ownerAddress, 
                         ownerAddress,
                         ownerAddress,
                         addr1Address,
                         addr1Address,
                         addr1Address]);

    //Verify
    // Ensure index starts at 1
    expect(await RugTARDS.ownerOf(1)).to.equal(ownerAddress);
    expect(await RugTARDS.ownerOf(2)).to.equal(ownerAddress);
    expect(await RugTARDS.ownerOf(3)).to.equal(ownerAddress);
    expect(await RugTARDS.ownerOf(4)).to.equal(addr1Address);
    expect(await RugTARDS.ownerOf(5)).to.equal(addr1Address);
    expect(await RugTARDS.ownerOf(6)).to.equal(addr1Address);    
  });
});