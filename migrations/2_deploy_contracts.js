var MyToken = artifacts.require("MyToken.sol");
var MyTokenSale = artifacts.require("MyTokenSale.sol");
var KYCContract = artifacts.require("KYCContract.sol");

require("dotenv").config({
    path: "../.env"
});

module.exports = async function (deployer) {

    //all accounts created
    const accounts = await web3.eth.getAccounts();
    console.log("account using for depoyment: "+ accounts[0]);

    console.log("account using for depoyment: "+ deployer);
    //deploy MyToken ERC20 Mintable Token so it doesn't need intital supply
    //token will be created(minted) on the go
    await deployer.deploy(MyToken);
    
    // deply KYC Contract or customer validations
    await deployer.deploy(KYCContract);
    
    //deploy MyTokenSale ( MintedCrowdsale ) with rate, account which will be used to have the receiving money,
    // & address of our ERC20 Token
    await deployer.deploy(MyTokenSale, 1, accounts[0], MyToken.address, KYCContract.address);

   

    // get the deployed instance of our ERC20Mintable Token
    const tokenInstance = await MyToken.deployed();

   
    //Assign the minterrole for MyTokenSale so it will be able to mint the tokens on the go
    await tokenInstance.addMinter(MyTokenSale.address);
}