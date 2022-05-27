// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers, run } = require("hardhat");


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const DTO = await hre.ethers.getContractFactory("DTO");
  const PublicStorage = await hre.ethers.getContractFactory("PublicStorage");
  const dto = await DTO.deploy("Decentralized Telecommunication Operator", "DTO", true, true);
  const publicStorage = await PublicStorage.deploy(dto.address);

  // const dto = await DTO.attach("");
  // const publicStorage = await PublicStorage.attach("");

  await dto.deployed();
  await publicStorage.deployed();

  console.log("DTO deployed to:", dto.address);
  console.log("PublicStorage deployed to:", publicStorage.address);
  // var tx = await dto.setBaseURI("test/", {gasLimit: 1e5});
  // await tx.wait();
  // tx = await dto.addPrefixOwner("DTO", await ethers.utils.parseEther("0.1"), {gasPrice: 5000000000, gasLimit: 1e6});
  // await tx.wait();

  try {
    await run('verify:verify', {
      address: dto.address,
      constructorArguments: [
        "Decentralized Telecommunication Operator",
        "DTO",
        "true",
        "true"
      ],
    })
  } catch {
    console.log("Error: verify DTO")
  }

  try {
    await hre.run('verify:verify', {
      address: publicStorage.address,
      constructorArguments: [
        dto.address
      ],
    })
  } catch {
    console.log("Error: verify PublicStorage")
  }

  console.log("DTO deployed to:", dto.address);
  console.log("PublicStorage deployed to:", publicStorage.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
