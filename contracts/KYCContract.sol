pragma solidity ^0.6.1;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KYCContract is Ownable {
    mapping(address => bool) allowed;

    function setKycCompleted(address _address) public onlyOwner {
        allowed[_address] = true;
    }

    function setKycRevoked(address _address) public onlyOwner {
        allowed[_address] = false;
    }

    function kycCompleted(address _address) public view returns(bool){
        return allowed[_address];
    }
}