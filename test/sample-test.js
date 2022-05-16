const { expect, util } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("DTO", function () {
  let dto;
  let DTO;
  beforeEach(async function () {
    [owner, alice, bob, eva] = await ethers.getSigners();

    DTO = await ethers.getContractFactory("DTO");
    dto = await DTO.deploy("Test Phone Number", "TPN", true, true);

    await dto.connect(owner).setBaseURI("test/");
    await dto.connect(owner).setPause(true);
    await dto.connect(owner).setPausePrefix(true);
  });


  describe("Positive Test", function () {

    it("Owner Sale Prefix and sale Number, uri NFT", async function () {

      await dto.addPrefixOwner("MTC", await ethers.utils.parseEther("0.1"));
      var temp = BigNumber.from(await owner.getBalance());
      await dto.connect(alice).registerNumber(BigNumber.from("100000001234567890"), 31536000, {value: await ethers.utils.parseEther("0.1")});
      expect((await dto.connect(alice).tokenOfOwnerByIndex(alice.address, 0)).toString()).to.equal("100000001234567890");
      expect(temp.add(await ethers.utils.parseEther("0.1")).eq(await owner.getBalance())).is.true;
      expect(await dto.tokenURI(BigNumber.from("100000001234567890"))).to.equal("test/MTC1234567890");
      expect(await dto.baseURI()).to.equal("test/");
      await dto.connect(owner).setMaxSizePrefix(await ethers.utils.parseEther("200"));
      expect(BigNumber.from(await dto.maxSizePrefix()).eq(await ethers.utils.parseEther("200"))).is.true;
      
    });

    it("Sale prefix, Mint NFT, reRent", async function () {
      
      var temp = BigNumber.from(await owner.getBalance());
      await dto.connect(bob).addPrefix("MTC", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("100")});
      expect(temp.add(await ethers.utils.parseEther("100")).eq(await owner.getBalance())).is.true;
      var temp = BigNumber.from(await bob.getBalance());
      await dto.connect(alice).registerNumber(await ethers.utils.parseEther("0.100000000123456789"), 31536000, {value: await ethers.utils.parseEther("0.1")});
      expect((await dto.connect(alice).tokenOfOwnerByIndex(alice.address, 0)).toString()).to.equal("100000000123456789");
      expect(temp.add(await ethers.utils.parseEther("0.1")).eq(await bob.getBalance())).is.true;
      var temp = BigNumber.from(await bob.getBalance());
      await dto.connect(alice).reRent(await ethers.utils.parseEther("0.100000000123456789"), 31536000, {value: await ethers.utils.parseEther("0.1")});
      expect(temp.add(await ethers.utils.parseEther("0.1")).eq(await bob.getBalance())).is.true;

    });

    it("Change price, change owner of prefix, change sale price of prefix", async function () {

      await dto.setSalePrice(ethers.utils.parseEther("200"))
      var temp = BigNumber.from(await owner.getBalance());
      await dto.connect(bob).addPrefix("MTC", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("200")});
      expect(temp.add(await ethers.utils.parseEther("200")).eq(await owner.getBalance())).is.true;
      await dto.connect(bob).changePrice(10000000, await ethers.utils.parseEther("0.5"))
      var temp = BigNumber.from(await bob.getBalance());
      await dto.connect(alice).registerNumber(await ethers.utils.parseEther("0.100000000123456789"), 31536000, {value: await ethers.utils.parseEther("0.5")});
      expect(temp.add(await ethers.utils.parseEther("0.5")).eq(await bob.getBalance())).is.true;
      await dto.connect(bob).changeOwnerPrerix("MTC", eva.address);
      expect((await dto.prefixOwner(10000000)).toString()).to.equal(eva.address.toString());

    });

  });

  describe("Negative Test", function () {

    it("Sale Prefix and sale Number, uri NFT", async function () {
      await dto.connect(owner).setPause(false);
      await expect(dto.connect(bob).addPrefix("", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("100")})).to.be.revertedWith('Error: Contract paused');
      await dto.connect(owner).setPause(true);
      await dto.connect(owner).setPausePrefix(false);
      await expect(dto.connect(bob).addPrefix("", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("100")})).to.be.revertedWith('Error: Mint Prefix paused');
      await dto.connect(owner).setPausePrefix(true);
      await expect(dto.connect(bob).addPrefix("", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("100")})).to.be.revertedWith('Error: Empty string');
      await expect(dto.connect(bob).addPrefix("12345678901", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("100")})).to.be.revertedWith('Error: This prefix bigest');
      await expect(dto.connect(bob).addPrefix("3456 7890", await ethers.utils.parseEther("0.1"), {value: await ethers.utils.parseEther("100")})).to.be.revertedWith("Error: Prefix contains a space");
      
      await dto.addPrefixOwner("MTC", await ethers.utils.parseEther("0.1"));
      var temp = BigNumber.from(await owner.getBalance());
      await expect(dto.connect(alice).registerNumber(BigNumber.from("100000001234567890"), 3153600, {value: await ethers.utils.parseEther("0.1")})).to.be.revertedWith("Error: duration incorrect");
      await expect(dto.connect(alice).registerNumber(BigNumber.from("1000000012345678901"), 31536000, {value: await ethers.utils.parseEther("0.1")})).to.be.revertedWith("Error: incorrect length number");
      await expect(dto.connect(alice).registerNumber(BigNumber.from("100000001234567890"), 31536000, {value: await ethers.utils.parseEther("0.01")})).to.be.revertedWith("Error: incorrect value price");
      await dto.connect(alice).registerNumber(BigNumber.from("100000001234567890"), 31536000, {value: await ethers.utils.parseEther("0.1")})

      await expect(dto.connect(alice).registerNumber(BigNumber.from("100000001234567890"), 31536000, {value: await ethers.utils.parseEther("0.1")})).to.be.revertedWith("Error: Rent don`t end");
      await expect(dto.connect(alice).reRent(BigNumber.from("100000001234567890"), 31536000, {value: await ethers.utils.parseEther("0.01")})).to.be.revertedWith("Error: incorrect value price");
      
      await dto.connect(owner).setMaxSizePrefix(await ethers.utils.parseEther("200"));
    
      
    });

   
    it("Change price, change owner of prefix, change sale price of prefix", async function () {

      await expect(dto.connect(bob).setSalePrice(ethers.utils.parseEther("200"))).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(dto.connect(eva).changePrice(10000000, await ethers.utils.parseEther("0.5"))).to.be.revertedWith("Error: You aren`t owner this Prefix")
      await expect(dto.connect(bob).changeOwnerPrerix("MTC", eva.address)).to.be.revertedWith("Error: You don`t owner this prefix");

    });

  });

});
