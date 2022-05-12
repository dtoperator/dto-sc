//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interface/IPublicStorage.sol";    
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";   
import "@openzeppelin/contracts/access/Ownable.sol";
    
contract PublicStorage is IPublicStorage, Ownable {

    IERC721 public dtl;

    mapping(uint256 => mapping (uint256=>address)) public addressChain;
    mapping(uint256 => mapping (uint256=>string)) public userNameSocial;

    mapping(uint256 => UserInfo) public userInfo;
    mapping(uint256 => string) public nameBlockchain;
    mapping(uint256 => string) public nameSocial;

    constructor(address addressDtl) {
        dtl = IERC721(addressDtl);
    }

    modifier ownerNft(uint256 tokenId) {
        require(msg.sender == dtl.ownerOf(tokenId), "Error: you don`t owner");
        _;
    }

    function addBlockchainOwner(uint256[] memory idBlockchain, string[] memory nameBlockchain_) external onlyOwner override {
        require(idBlockchain.length < 21, "Error: big counter idBLockchain");
        for (uint256 i = 0; i < idBlockchain.length; i++) {
            nameBlockchain[idBlockchain[i]] = nameBlockchain_[i];
        }
    }
    
    function addWallet(uint256 number, uint256[] memory idBlockchain, address[] memory addressUser) external ownerNft(number) onlyOwner override {
        for (uint256 i = 0; i < idBlockchain.length; i++) {
            addressChain[number][idBlockchain[i]] = addressUser[i];
        }
    }
    
    function addAvatar(uint256 number, string memory urlImage) external ownerNft(number) override {
        userInfo[number].urlAvatar = urlImage;
    }

    function addNumberPhone(uint256 number, string memory phoneNumber) external ownerNft(number) override {
        userInfo[number].numberPhone = phoneNumber;
    }

    function addSocialOwner(uint256[] memory idSocial, string[] memory nameSocial_) external onlyOwner override {
        require(idSocial.length < 21, "Error: big counter idBLockchain");
        for (uint256 i = 0; i < idSocial.length; i++) {
            nameSocial[idSocial[i]] = nameSocial_[i];
        }
    }

    function addSocial(uint256 number, uint256[] memory idSocial, string[] memory userName) external ownerNft(number) override {
        require(idSocial.length < 21, "Error: big counter idBLockchain");
        for (uint256 i = 0; i < idSocial.length; i++) {
            userNameSocial[number][idSocial[i]] = userName[i];
        }
    }

}