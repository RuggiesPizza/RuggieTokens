import { ethers, hardhatArguments, artifacts } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

let PIZZABOX: any;
let PIZZABOXAddress: any;
let TICKET: any;
let TICKETAddress: any;
let URI = "https://www.ruggiespizza.com/anniversary/json/pizzabox.json";

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

  //TICKET Contract
  TICKET = await ethers.getContractFactory("TICKET");
  TICKET = await TICKET.deploy(ethers.parseEther("1"));
  await TICKET.waitForDeployment();
  TICKETAddress = await TICKET.getAddress();

  //PIZZABOX Contract
  PIZZABOX = await ethers.getContractFactory("PIZZABOX");
  PIZZABOX = await PIZZABOX.deploy(1);
  await PIZZABOX.waitForDeployment();
  PIZZABOXAddress = await PIZZABOX.getAddress();
  //Set Base URI
  await PIZZABOX.updateURI(URI);

  saveFrontendFiles();
  getVerification();
}

function saveFrontendFiles() {
    const fs = require("fs");
    const contractsDir = __dirname + "";
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    let TICKETArtifact = artifacts.readArtifactSync("TICKET");
  
    fs.writeFileSync(
      contractsDir + "/abi/TICKET.json",
      JSON.stringify(TICKETArtifact, null, 2)
    );

    let PIZZABOXArtifact = artifacts.readArtifactSync("PIZZABOX");
  
    fs.writeFileSync(
      contractsDir + "/abi/PIZZABOX.json",
      JSON.stringify(PIZZABOXArtifact, null, 2)
    );
}

function getVerification() {
    // TICKET
    let data = `npx hardhat verify --network ${hardhatArguments.network} ${ethers.parseEther("1")} ${TICKETAddress}`;
    console.log(data);

    // PIZZABOX
    data = `npx hardhat verify --network ${hardhatArguments.network} 1 ${PIZZABOXAddress}`;
    console.log(data);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});