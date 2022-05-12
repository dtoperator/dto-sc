//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


interface IPublicStorage {

    struct UserInfo {
        string urlAvatar;
        string numberPhone;
    }

    function addBlockchainOwner(uint256[] memory idBlockchain, string[] memory nameBlockchain) external;
    
    function addWallet(uint256 number, uint256[] memory idBlockchain, address[] memory addressUser) external;
    
    function addAvatar(uint256 number, string memory urlImage) external;

    function addNumberPhone(uint256 number, string memory phoneNumber) external;

    function addSocialOwner(uint256[] memory idSocial, string[] memory nameSocial) external;

    function addSocial(uint256 number, uint256[] memory idSocial, string[] memory userName) external;
    
}