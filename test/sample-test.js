const { expect, util } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("DecentralLink", function () {
  let decentralLink;
  let DecentralLink;
  beforeEach(async function () {
    [owner, alice, bob, eva] = await ethers.getSigners();

    DecentralLink = await ethers.getContractFactory("DecentralLink");
    decentralLink = await DecentralLink.deploy("Test Phone Number", "TPN");

    await decentralLink.connect(owner).setBaseURI("test/");
    await decentralLink.connect(owner).setPause(true);
  });


  describe("Positive Test", function () {

    it("Owner Sale Prefix and sale Number", async function () {

      await decentralLink.addPrefixOwner("MTC", await ethers.utils.parseEther("0.1"));
      var temp = BigNumber.from(await owner.getBalance());
      await decentralLink.connect(alice).mintNumber(await ethers.utils.parseEther("0.100000000123456789"), 31536000, {value: await ethers.utils.parseEther("0.1")});
      expect((await decentralLink.connect(alice).tokenOfOwnerByIndex(alice.address, 0)).toString()).to.equal("100000000123456789");
      expect(temp.add(await ethers.utils.parseEther("0.1")).eq(await owner.getBalance())).is.true;

    });

    it("Sale prefix, Mint NFT, reRent", async function () {
      
      var temp = BigNumber.from(await owner.getBalance());
      await decentralLink.connect(bob).addPrefix("MTC", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("100")});
      expect(temp.add(await ethers.utils.parseEther("100")).eq(await owner.getBalance())).is.true;
      var temp = BigNumber.from(await bob.getBalance());
      await decentralLink.connect(alice).mintNumber(await ethers.utils.parseEther("0.100000000123456789"), 31536000, {value: await ethers.utils.parseEther("0.1")});
      expect((await decentralLink.connect(alice).tokenOfOwnerByIndex(alice.address, 0)).toString()).to.equal("100000000123456789");
      expect(temp.add(await ethers.utils.parseEther("0.1")).eq(await bob.getBalance())).is.true;
      var temp = BigNumber.from(await bob.getBalance());
      console.log(temp.toString());
      await decentralLink.connect(alice).reRent(await ethers.utils.parseEther("0.100000000123456789"), 31536000, {value: await ethers.utils.parseEther("0.1")});
      console.log((await bob.getBalance()).toString());
      expect(temp.add(await ethers.utils.parseEther("0.1")).eq(await bob.getBalance())).is.true;
    });

    it("Change price, change owner of prefix, change sale price of prefix", async function () {
      await decentralLink.setSalePrice(ethers.utils.parseEther("200"))
      var temp = BigNumber.from(await owner.getBalance());
      await decentralLink.connect(bob).addPrefix("MTC", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("200")});
      expect(temp.add(await ethers.utils.parseEther("200")).eq(await owner.getBalance())).is.true;
      await decentralLink.connect(bob).changePrice(10000000, await ethers.utils.parseEther("0.5"))
      var temp = BigNumber.from(await bob.getBalance());
      await decentralLink.connect(alice).mintNumber(await ethers.utils.parseEther("0.100000000123456789"), 31536000, {value: await ethers.utils.parseEther("0.5")});
      expect(temp.add(await ethers.utils.parseEther("0.5")).eq(await bob.getBalance())).is.true;
      await decentralLink.connect(bob).changeOwnerPrerix("МТС", eva.address);
      expect((await decentralLink.perixOwner(10000000)).toString()).to.equal(eva.address.toString());

    });

  });

});
