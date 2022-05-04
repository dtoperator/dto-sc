//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IDecentralLink {
    
    function setPause(bool status_) external;

    function addPrefixOwner(string memory prefix_, uint256 price) external;

    function addPrefix(string memory prefix, uint256 price) payable external;
       
    function changePrice(string memory prefix_, uint256 price) external;

    function mintNumber(string memory prefix, uint256 number) payable external;


}