import { expect } from "chai";
import { ethers } from "hardhat";

describe("Fantom Payment Test", function () {
  let RugTARDS: any;
  let Ruggie: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;
  
  const provider = ethers.provider;

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

  it("Verify Updating Beneficiary", async function () {
    let address1 = await addr1.getAddress();
    expect(await RugTARDS.updateBeneficiary(address1));
  });

  it("Verify Withdraw", async function () {
    let override = {value: ethers.parseEther("150")};
    await RugTARDS.connect(addr1).mint(5, override);

    expect(await provider.getBalance(await owner.getAddress())).to.be.equal(ethers.parseEther("1878.980164477053059704"));
    expect(await provider.getBalance(await RugTARDS.getAddress())).to.be.equal(ethers.parseEther("150"));
    await RugTARDS.withdraw();
    expect(await provider.getBalance(await RugTARDS.getAddress())).to.be.equal(ethers.parseEther("0"));
    expect(await provider.getBalance(await owner.getAddress())).to.be.equal(ethers.parseEther("2028.980164463753229148"));
  });

});