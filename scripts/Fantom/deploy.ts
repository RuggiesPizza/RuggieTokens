import { ethers, hardhatArguments, artifacts } from "hardhat";

let RTARD: any

async function main() {
  if (hardhatArguments.network === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const provider = ethers.provider;
  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await provider.getBalance(deployer.getAddress())).toString());
  let deployer_address = await deployer.getAddress()
  //Test Dwarf Contract
  RTARD = await ethers.getContractFactory("RugTARDS");

  RTARD = await RTARD.deploy('0xB2a909b8bCce9B30BbC9d4c748fD897d6AD9c285');
  await RTARD.waitForDeployment();
  console.log("RTARD Deployed");

  let RTARDAddress = await RTARD.getAddress();

  saveFrontendFiles(RTARDAddress);
  genDeploymentFiles(deployer_address);
  getVerification(RTARDAddress);
}

function saveFrontendFiles(RTARDAddress: string) {
  const fs = require("fs");
  const contractsDir = __dirname + "";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/abi/RugTARDS-addresses.json",
    JSON.stringify({ RugTARDS: RTARDAddress}, undefined, 2)
  );

  let RugTARDSArtifact = artifacts.readArtifactSync("RugTARDS");

  fs.writeFileSync(
    contractsDir + "/abi/RTARDS.json",
    JSON.stringify(RugTARDSArtifact, null, 2)
  );
}

function genDeploymentFiles(deployer: string) {
  const fs = require("fs");
  const contractsDir = __dirname + "";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // RugTARDS
  let data = "module.exports = ['0xB2a909b8bCce9B30BbC9d4c748fD897d6AD9c285'];";
  fs.writeFileSync(
    contractsDir + "/args/RugTARDS.ts", 
    data
  );
}

function getVerification(RugTARDSAddress: string) {
  let data = "npx hardhat verify --network " + hardhatArguments.network + " --constructor-args ./scripts/args/RugTARDS.ts " + RugTARDSAddress;
  console.log(data);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });