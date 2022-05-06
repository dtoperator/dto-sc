//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IDecentralLink {
    function setPause(bool status_) external;

    function setSalePrice(uint256 price) external;

    function setMaxSizePrefix(uint256 size) external;

    function addPrefixOwner(string memory prefix_, uint256 price)
        external
        returns (uint256);

    function addPrefix(string memory prefix, uint256 price)
        external
        payable
        returns (uint256);

    function changePrice(uint256 id, uint256 price) external;

    function mintNumber(uint256 number) external payable;
}
