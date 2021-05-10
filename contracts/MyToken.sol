pragma solidity ^0.6.2;
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC20Mintable.sol";

contract MyToken is ERC20Mintable {
    constructor() public ERC20Mintable("Real Assets", "REAX") {
        _setupDecimals(0);
    }
}