//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IDecentralLink.sol";

contract DecentralLink is ERC721Enumerable, Ownable, IDecentralLink {
    using Strings for uint256;

        // Base URI
    string private _uri;
    
    uint256 public counter = 1;

    uint256 private _salePrice = 100 ether;

    mapping (string => uint256) public prefixPrice;
    mapping (string => address) public prefixOwner;
    mapping (string => uint256) public prefixId;

    bool public pause;
    
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
    }

    modifier checkPause {
        require(pause, "Mint NFT paused");
        _;
    }

    function setBaseURI(string memory uri_) public onlyOwner {
        _uri = uri_;
    }

    function _baseURI() internal view override returns (string memory) {
        return _uri;
    }

    function baseURI() public view returns (string memory) {
        return _uri;
    }

    function setPause (bool status_) override external {
        pause = status_;
    }

    function setSalePrice (uint256 price) external onlyOwner {
        _salePrice = price;
    }

    function addPrefixOwner(string memory prefix_, uint256 price) override onlyOwner checkPause external {
        require(bytes(prefix_).length < 10, "Error: This prefix bigest");
        require(prefixOwner[prefix_] == address(0), "This prefix busy");

        prefixPrice[prefix_] = price;
        prefixOwner[prefix_] = msg.sender;
        prefixId[prefix_] = counter;
        counter++;
    }

    function addPrefix(string memory prefix_, uint256 price) payable override checkPause external {
        require(bytes(prefix_).length < 10, "Error: This prefix bigest");
        require(prefixOwner[prefix_] == address(0), "This prefix busy");
        require(msg.value >= _salePrice, "Error: incorrect price");

        prefixPrice[prefix_] = price;
        prefixOwner[prefix_] = msg.sender;
        prefixId[prefix_] = counter;
        counter++;

        (bool success, ) = payable(owner()).call{ value: msg.value }("");
        require(
                success,
                "Address: unable to send value, recipient may have reverted"
            );
    }
    
    function changePrice(string memory prefix_, uint256 price) override onlyOwner checkPause external {
        prefixPrice[prefix_] = price;
    }

    function mintNumber(string memory prefix_, uint256 number) override payable checkPause external {
        require(msg.value >= prefixPrice[prefix_], "Error: incorrect price");
        require(prefixOwner[prefix_] != address(0), "Error: incorrect prefix");
        uint256 lenNumber = bytes(number.toString()).length;
        console.log(lenNumber);
        require(bytes(Strings.toString(number)).length < 17, "ErrorL incorrect lenght number");
        uint256 tokenId = prefixId[prefix_] * (10 ** lenNumber) + number;

        _safeMint(msg.sender, tokenId);
        (bool success, ) = payable(prefixOwner[prefix_]).call{ value: msg.value }("");
        require(
                success,
                "Address: unable to send value, recipient may have reverted"
            );  

    }

}
