//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IDrcentralLink {
    
    struct RangeNumber {
        uint256 min;
        uint256 max;
        uint256 price;
    }

    function setPause(bool status_) external;

    function addRangeOwner(uint256 prefix, uint256 min, uint256 max, uint256 price) external;

    function addRange(uint256 prefix, uint256 min, uint256 max, uint256 price) external;
    
    function changeRange(uint256 prefix, uint256 price) external;
    
    function changePrice(uint256 price) external;

    function mintNumber(uint256 prefix, uint256 number) external;


}