import { ethers, hardhatArguments, artifacts } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

let RTARD: any;

let RTARDAddress: any;
let ruggiesTreasury: any;

let baseURI = "https://www.ruggiespizza.com/rugtards/json/";
let ruggedURI = "https://ruggiespizza.com/rugtards/rugged/rugged.json";

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
  ruggiesTreasury = process.env.RUGGIE_TREASURY;
  console.log(ruggiesTreasury);

  //RTARD Contract
  RTARD = await ethers.getContractFactory("RugTARDS2");
  RTARD = await RTARD.deploy(ruggiesTreasury);
  await RTARD.waitForDeployment();
  RTARDAddress = await RTARD.getAddress();

  await RTARD.updateURI(baseURI, ruggedURI);

  saveFrontendFiles();
  genDeploymentFiles();
  getVerification();
}

function saveFrontendFiles() {
    const fs = require("fs");
    const contractsDir = __dirname + "";
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    let RugTARDFactoryArtifact = artifacts.readArtifactSync("RugTARDS2");
  
    fs.writeFileSync(
      contractsDir + "/abi/RugTARDS2.json",
      JSON.stringify(RugTARDFactoryArtifact, null, 2)
    );
}

function genDeploymentFiles() {
    const fs = require("fs");
    const contractsDir = __dirname + "";
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    // RugletteFactory
    let data = `module.exports = ['${ruggiesTreasury}'];`;
    fs.writeFileSync(
      contractsDir + "/args/RugTARDS2.ts", 
      data
    );
}

function getVerification() {
    // RugTARDS2
    let data = "npx hardhat verify --network " + hardhatArguments.network + " --constructor-args ./scripts/Sonic/args/RugTARDS2.ts " + RTARDAddress;
    console.log(data);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});