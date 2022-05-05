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
    
    uint256 public counter = 10000000;

    uint256 private _salePrice = 100 ether;

    mapping (uint256 => uint256) public prefixPrice;
    mapping (uint256 => address) public prefixOwner;
    mapping (uint256 => string) public prefixName;
    mapping (string => uint256) public prefixId;

    bool public pause;

    event AddPrefix(string prefix_, uint256 counter_, uint256 price_);
    event ChangePrice(uint256 id, uint256 price_);
    event MintNumber(uint256 prefixNumber);
    
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
    }

    modifier checkPause {
        require(pause, "Mint NFT paused");
        _;
    }

    function setBaseURI(string memory uri_) public onlyOwner {
        _uri = uri_;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        

        uint256 lenNumber = bytes(tokenId.toString()).length;
        uint256 prefix_ = uint256(tokenId / 10 ** (lenNumber - 8));
        uint256 number_ = tokenId % 10 ** (lenNumber - 8);
        string memory baseURI =  string(abi.encodePacked(_baseURI(), prefixName[prefix_]));

        return bytes(_baseURI()).length > 0 ? string(abi.encodePacked(baseURI, number_.toString())) : "";
    }

    function _baseURI() internal view override returns (string memory) {
        return _uri;
    }

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    function setPause (bool status_) override external {
        pause = status_;
    }

    function setSalePrice (uint256 price) external onlyOwner {
        _salePrice = price;
    }

    function _indexOf(string memory _base, string memory _value, uint _offset)
        internal
        pure
        returns (bool) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        require(_valueBytes.length == 1, "Error in indexOf");

        for (uint i = _offset; i < _baseBytes.length; i++) {
            if (_baseBytes[i] == _valueBytes[0]) {
                return false;
            }
        }

        return true;
    }

    function _addPrefix(string memory prefix_, uint256 price) internal returns(uint256) {
        require(bytes(prefix_).length > 0, "Error: Empty string");
        require(bytes(prefix_).length < 10, "Error: This prefix bigest");
        require(_indexOf(prefix_, " ", 0), "Error: contains a space");
        require(prefixId[prefix_] < 100000000, "This prefix busy");
        require(counter < 100000000, "Error: end prefix counter");

        prefixPrice[counter] = price;
        prefixOwner[counter] = msg.sender;
        prefixName[counter] = prefix_;
        prefixId[prefix_] = counter;

        counter++;

        emit AddPrefix(prefix_, counter, price);

        return counter - 1;
    }

    function addPrefixOwner(string memory prefix_, uint256 price) override onlyOwner checkPause external returns(uint256) {
        return _addPrefix(prefix_, price);
    }

    function addPrefix(string memory prefix_, uint256 price) payable override checkPause external returns(uint256) {
        uint256 id = _addPrefix(prefix_, price);

        (bool success, ) = payable(owner()).call{ value: msg.value }("");

        require(
                success,
                "Address: unable to send value, recipient may have reverted"
            );

        return id;
    }
    
    function changePrice(uint256 id, uint256 price) override checkPause external {
        require( prefixOwner[id] == msg.sender, "Error: You aren`t owner this Prefix" );
        prefixPrice[id] = price;
        emit ChangePrice(id, price);
    }

    function mintNumber(uint256 prefixNumber) override payable checkPause external {

        uint256 lenNumber = bytes(prefixNumber.toString()).length;
        console.log(lenNumber);
        uint256 prefix_ = prefixNumber / 10 ** (lenNumber - 8);
        console.log(prefixNumber % 10 ** (lenNumber - 8));

        require(prefixOwner[prefix_] != address(0), "Error: incorrect prefix");
        require(lenNumber - 8 < 11, "Error: incorrect length number");
        require(msg.value >= prefixPrice[prefix_], "Error: incorrect price");

        _safeMint(msg.sender, prefixNumber);
        
        emit MintNumber(prefixNumber);

        (bool success, ) = payable(prefixOwner[prefix_]).call{ value: msg.value }("");
        require(
                success,
                "Address: unable to send value, recipient may have reverted"
            );  

    }

}
