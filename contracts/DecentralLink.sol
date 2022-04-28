//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./contracts/interface/IDecentralLink.sol";

contract DrcentralLink is ERC721, Ownable, IDecentralLink {

    uint256 private _priceNumber = 1 ether / 1000;

    mapping (uint256 => RangeNumber) number;
    mapping (uint256 => address) numberOwner;
    bool public pause;
    
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
    }
    
    function setPause (bool status_) external {
        pause = status_;
    }

    function addRangeOwner(uint256 prefix, uint256 min, uint256 max, uint256 price) onlyOwner external {
        
    }

    function addRange(uint256 prefix, uint256 min, uint256 max, uint256 price) external {}
    
    function changeRange(uint256 prefix, uint256 price) external {}
    
    function changePrice(uint256 price) onlyOwner external {
        _priceNumber = price;
    }

    function mintNumber(uint256 prefix, uint256 number) external {}

}
