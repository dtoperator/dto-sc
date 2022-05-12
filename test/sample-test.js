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


  xdescribe("Positive Test", function () {

    it("Owner Sale Prefix and sale Number, uri NFT", async function () {

      await decentralLink.addPrefixOwner("MTC", await ethers.utils.parseEther("0.1"));
      var temp = BigNumber.from(await owner.getBalance());
      await decentralLink.connect(alice).mintNumber(BigNumber.from("100000001234567890"), 31536000, {value: await ethers.utils.parseEther("0.1")});
      expect((await decentralLink.connect(alice).tokenOfOwnerByIndex(alice.address, 0)).toString()).to.equal("100000001234567890");
      expect(temp.add(await ethers.utils.parseEther("0.1")).eq(await owner.getBalance())).is.true;
      expect(await decentralLink.tokenURI(BigNumber.from("100000001234567890"))).to.equal("test/MTC1234567890");
      expect(await decentralLink.baseURI()).to.equal("test/");
      await decentralLink.connect(owner).setMaxSizePrefix(await ethers.utils.parseEther("200"));
      expect(BigNumber.from(await decentralLink.maxSizePrefix()).eq(await ethers.utils.parseEther("200"))).is.true;
      
      

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
      await decentralLink.connect(alice).reRent(await ethers.utils.parseEther("0.100000000123456789"), 31536000, {value: await ethers.utils.parseEther("0.1")});
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
      await decentralLink.connect(bob).changeOwnerPrerix("MTC", eva.address);
      expect((await decentralLink.prefixOwner(10000000)).toString()).to.equal(eva.address.toString());

    });

  });

  describe("Negative Test", function () {

    it("Owner Sale Prefix and sale Number, uri NFT", async function () {
      
      await expect(decentralLink.connect(bob).addPrefix("", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("100")})).to.be.revertedWith('Error: Empty string');
      await expect(decentralLink.connect(bob).addPrefix("12345678901", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("100")})).to.be.revertedWith('Error: This prefix bigest');
      
      await decentralLink.addPrefixOwner("MTC", await ethers.utils.parseEther("0.1"));
      var temp = BigNumber.from(await owner.getBalance());
      await decentralLink.connect(alice).mintNumber(BigNumber.from("100000001234567890"), 31536000, {value: await ethers.utils.parseEther("0.1")});
      expect((await decentralLink.connect(alice).tokenOfOwnerByIndex(alice.address, 0)).toString()).to.equal("100000001234567890");
      expect(temp.add(await ethers.utils.parseEther("0.1")).eq(await owner.getBalance())).is.true;
      expect(await decentralLink.tokenURI(BigNumber.from("100000001234567890"))).to.equal("test/MTC1234567890");
      expect(await decentralLink.baseURI()).to.equal("test/");
      await decentralLink.connect(owner).setMaxSizePrefix(await ethers.utils.parseEther("200"));
      expect(BigNumber.from(await decentralLink.maxSizePrefix()).eq(await ethers.utils.parseEther("200"))).is.true;
      
    });

    xit("Sale prefix, Mint NFT, reRent", async function () {
      
      var temp = BigNumber.from(await owner.getBalance());
      expectError(await decentralLink.connect(bob).addPrefix("", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("100")})).equal("Error: Empty string");

      await decentralLink.connect(bob).addPrefix("MTC", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("100")});
      expect(temp.add(await ethers.utils.parseEther("100")).eq(await owner.getBalance())).is.true;
      var temp = BigNumber.from(await bob.getBalance());
      await decentralLink.connect(alice).mintNumber(await ethers.utils.parseEther("0.100000000123456789"), 31536000, {value: await ethers.utils.parseEther("0.1")});
      expect((await decentralLink.connect(alice).tokenOfOwnerByIndex(alice.address, 0)).toString()).to.equal("100000000123456789");
      expect(temp.add(await ethers.utils.parseEther("0.1")).eq(await bob.getBalance())).is.true;
      var temp = BigNumber.from(await bob.getBalance());
      await decentralLink.connect(alice).reRent(await ethers.utils.parseEther("0.100000000123456789"), 31536000, {value: await ethers.utils.parseEther("0.1")});
      expect(temp.add(await ethers.utils.parseEther("0.1")).eq(await bob.getBalance())).is.true;

    });

    xit("Change price, change owner of prefix, change sale price of prefix", async function () {

      await decentralLink.setSalePrice(ethers.utils.parseEther("200"))
      var temp = BigNumber.from(await owner.getBalance());
      await decentralLink.connect(bob).addPrefix("MTC", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("200")});
      expect(temp.add(await ethers.utils.parseEther("200")).eq(await owner.getBalance())).is.true;
      await decentralLink.connect(bob).changePrice(10000000, await ethers.utils.parseEther("0.5"))
      var temp = BigNumber.from(await bob.getBalance());
      await decentralLink.connect(alice).mintNumber(await ethers.utils.parseEther("0.100000000123456789"), 31536000, {value: await ethers.utils.parseEther("0.5")});
      expect(temp.add(await ethers.utils.parseEther("0.5")).eq(await bob.getBalance())).is.true;
      await decentralLink.connect(bob).changeOwnerPrerix("MTC", eva.address);
      expect((await decentralLink.prefixOwner(10000000)).toString()).to.equal(eva.address.toString());

    });

  });

});
