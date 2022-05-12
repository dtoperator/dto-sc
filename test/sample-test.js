const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentralLink", function () {
  let decentralLink;
  let DecentralLink;
  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();

    DecentralLink = await ethers.getContractFactory("DecentralLink");
    decentralLink = await DecentralLink.deploy("Test Phone Number", "TPN");

    await decentralLink.connect(owner).setBaseURI("test/");
    await decentralLink.connect(owner).setPause(true);
  });
  
  it("Sale Our Prefix, Sale NFT phonenumber", async function () {

    await decentralLink.addPrefixOwner("MTC", await ethers.utils.parseEther("0.1"));
    console.log((await owner.getBalance()));
    await decentralLink.connect(alice).mintNumber(await ethers.utils.parseEther("0.100000000123456789"), 31536000, {value: await ethers.utils.parseEther("0.1")});
    console.log((await decentralLink.connect(alice).tokenOfOwnerByIndex(alice.address, 0)).toString());
    console.log((await owner.getBalance()));

  });

  it("Sale Other Prefix, Sale NFT phonenumber", async function () {

    await decentralLink.connect(bob).addPrefix("MTC", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("100")});
    console.log((await bob.getBalance()));
    await decentralLink.connect(alice).mintNumber(await ethers.utils.parseEther("0.100000000123456789"), 31536000, {value: await ethers.utils.parseEther("0.1")});
    console.log((await decentralLink.connect(alice).tokenOfOwnerByIndex(alice.address, 0)).toString());
    console.log((await decentralLink.tokenURI(await ethers.utils.parseEther("0.100000000123456789"))));

  });
});
