//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IDTO {
    function setPause(bool status_) external;

    function setSalePrice(uint256 price) external;

    function setMaxSizePrefix(uint256 size) external;

    function changeOwnerPrerix(string memory prefix_, address newAddress)
        external;

    function addPrefixOwner(string memory prefix_, uint256 price)
        external
        returns (uint256);

    function addPrefix(string memory prefix, uint256 price)
        external
        payable
        returns (uint256);

    function changePrice(uint256 id, uint256 price) external;

    function reRent(uint256 prefixNumber, uint256 duration) external payable;

    function registerNumber(uint256 number, uint256 duration) external payable;
}
