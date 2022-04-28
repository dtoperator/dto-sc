//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IDecentralLink.sol";

contract DrcentralLink is ERC721, Ownable, IDecentralLink {

    uint256 private _priceNumber = 1 ether / 1000;

    mapping (uint256 => RangeNumber) public prefix;
    mapping (uint256 => address) public prefixOwner;
    bool public pause;
    
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
    }
    
    function setPause (bool status_) override external {
        pause = status_;
    }

    modifier checkPause {
        require(pause, "Mint NFT paused");
        _;
    }

    function addRangeOwner(uint256 prefix_, uint256 min, uint256 max, uint256 price) override onlyOwner checkPause external {
        require(prefixOwner[prefix_] == address(0), "This prefix busy");
        require(min < max, "Incorrect min or max");
        prefix[prefix_] = RangeNumber(min, max, price);
        prefixOwner[prefix_] = msg.sender;
    }

    function addRange(uint256 prefix_, uint256 min, uint256 max, uint256 price) payable override checkPause external {
        require(prefixOwner[prefix_] == address(0), "This prefix busy");
        require(min < max, "Incorrect min or max");

        prefix[prefix_] = RangeNumber(min, max, price);
        prefixOwner[prefix_] = msg.sender;
        (bool success, ) = payable(msg.sender).call{ value: _priceNumber * (10 ** (max- min)) }("");
        require(
                success,
                "Address: unable to send value, recipient may have reverted"
            );
    }
    
    function changeRange(uint256 prefix_, uint256 min, uint256 max, uint256 price) payable override checkPause external {
        require(prefixOwner[prefix_] == msg.sender, "This prefix busy");
        require(min < max, "Incorrect min or max");
        require(min > prefix[prefix_].max, "Incorrect min");
        prefix[prefix_] = RangeNumber(min, max, price);
        (bool success, ) = payable(msg.sender).call{ value: _priceNumber * (10 ** (max- min)) }("");
        require(
                success,
                "Address: unable to send value, recipient may have reverted"
            );



    }
    
    function changePrice(uint256 price) override onlyOwner checkPause external {
        _priceNumber = price;
    }

    function mintNumber(uint256 prefix, uint256 number) override checkPause external {

    }

}
