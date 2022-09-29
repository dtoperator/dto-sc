const { expect, util } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("PublicStorage", function () {
  let dto;
  let DTO;
  before(async function () {
    [owner, alice, bob, eva] = await ethers.getSigners();

    DTO = await ethers.getContractFactory("DTO");
    PublicStorage = await ethers.getContractFactory("PublicStorage");
    dto = await DTO.deploy("Test Phone Number", "TPN", true, true);
    publicStorage = await PublicStorage.deploy(dto.address);

    await dto.connect(owner).setBaseURI("test/");
    await dto.connect(owner).setPause(true);
    await dto.connect(owner).setPausePrefix(true);
    await publicStorage
      .connect(owner)
      .addBlockchainOwner([1, 2, 3], ["BSC", "ETH", "BTC"]);
    await publicStorage
      .connect(owner)
      .addSocialOwner([1, 2, 3], ["Facebook", "Telegram", "Twiter"]);
    await dto
      .connect(bob)
      .addPrefix("DTO", await ethers.utils.parseEther("0.1"), {
        value: await ethers.utils.parseEther("100"),
      });
    var temp = BigNumber.from(await owner.getBalance());
    await dto
      .connect(alice)
      .registerNumber(BigNumber.from("100000001234567890"), {
        value: await ethers.utils.parseEther("0.1"),
      });
    expect(
      (
        await dto.connect(alice).tokenOfOwnerByIndex(alice.address, 0)
      ).toString()
    ).to.equal("100000001234567890");
  });

  it("Test add address", async function () {
    expect((await publicStorage.getNameBlockchain(1)).toString()).to.equal(
      "BSC"
    );
    expect((await publicStorage.getNameBlockchain(2)).toString()).to.equal(
      "ETH"
    );
    expect((await publicStorage.getNameBlockchain(3)).toString()).to.equal(
      "BTC"
    );

    await expect(
      publicStorage
        .connect(alice)
        .addWallet(
          BigNumber.from("100000001234567890"),
          [1, 2, 3, 0],
          ["addressBSC", "addressETH", "addressBTC", "Test"]
        )
    ).to.be.revertedWith("Error: invalide id Blockchain");
    await expect(
      publicStorage
        .connect(alice)
        .addWallet(
          BigNumber.from("100000001234567890"),
          [1, 2, 3, 4, 5, 6],
          ["addressBSC", "addressETH", "addressBTC", "Test"]
        )
    ).to.be.revertedWith("Error: big counter idBLockchain");
    await expect(
      publicStorage
        .connect(eva)
        .addWallet(
          BigNumber.from("100000001234567890"),
          [1, 2, 3],
          ["addressBSC", "addressETH", "addressBTC"]
        )
    ).to.be.revertedWith("Error: you don`t owner");

    await publicStorage
      .connect(alice)
      .addWallet(
        BigNumber.from("100000001234567890"),
        [1, 2, 3],
        ["addressBSC", "addressETH", "addressBTC"]
      );

    expect(
      (
        await publicStorage.getAddressChain(
          BigNumber.from("100000001234567890"),
          1
        )
      ).toString()
    ).to.equal("addressBSC");
    expect(
      (
        await publicStorage.getAddressChain(
          BigNumber.from("100000001234567890"),
          2
        )
      ).toString()
    ).to.equal("addressETH");
    expect(
      (
        await publicStorage.getAddressChain(
          BigNumber.from("100000001234567890"),
          3
        )
      ).toString()
    ).to.equal("addressBTC");
  });

  it("Test add Social", async function () {
    expect((await publicStorage.getNameSocial(1)).toString()).to.equal(
      "Facebook"
    );
    expect((await publicStorage.getNameSocial(2)).toString()).to.equal(
      "Telegram"
    );
    expect((await publicStorage.getNameSocial(3)).toString()).to.equal(
      "Twiter"
    );

    await expect(
      publicStorage
        .connect(alice)
        .addSocial(
          BigNumber.from("100000001234567890"),
          [1, 2, 3, 0],
          ["addressBSC", "addressETH", "addressBTC", "Test"]
        )
    ).to.be.revertedWith("Error: invalide id Social");

    await publicStorage
      .connect(alice)
      .addSocial(
        BigNumber.from("100000001234567890"),
        [1, 2, 3],
        ["LoginFacebook", "LoginTelegram", "LoginTwiter"]
      );

    expect(
      (
        await publicStorage.getUserNameSocial(
          BigNumber.from("100000001234567890"),
          1
        )
      ).toString()
    ).to.equal("LoginFacebook");
    expect(
      (
        await publicStorage.getUserNameSocial(
          BigNumber.from("100000001234567890"),
          2
        )
      ).toString()
    ).to.equal("LoginTelegram");
    expect(
      (
        await publicStorage.getUserNameSocial(
          BigNumber.from("100000001234567890"),
          3
        )
      ).toString()
    ).to.equal("LoginTwiter");
  });

  it("Test add Avatar", async function () {
    await publicStorage
      .connect(alice)
      .addAvatar(
        BigNumber.from("100000001234567890"),
        "https://ipfs.io/ipfs/<CID>"
      );
    expect(
      (
        await publicStorage.getUserAvatar(BigNumber.from("100000001234567890"))
      ).toString()
    ).to.equal("https://ipfs.io/ipfs/<CID>");
  });

  it("Test add Phone Number", async function () {
    await publicStorage
      .connect(alice)
      .addNumberPhone(BigNumber.from("100000001234567890"), "877 798 3752");
    expect(
      (
        await publicStorage.getUserPhone(BigNumber.from("100000001234567890"))
      ).toString()
    ).to.equal("877 798 3752");
  });
});
