const MyToken = artifacts.require("MyToken");
const MyTokenSale = artifacts.require("MyTokenSale");
const KYCContract = artifacts.require("KYCContract");

require("dotenv").config({
    path: "../.env"
});

const chai = require("./chaiSetup.js");
const {
    token
} = require("./MyToken.test.js");
const BN = web3.utils.BN;

const expect = chai.expect;

contract("MyTokenSale Test", async (accounts) => {
    const [deployerAccount, recipientAccount, anotherAccount] = accounts;

    it("there should be no tokens minted for myTokenSale and deployer initially", async () => {
        let myTokenInstance = await MyToken.deployed();
        let myTokenSaleInstance = await MyTokenSale.deployed();
        expect(myTokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
        return expect(myTokenInstance.balanceOf(myTokenSaleInstance.address)).to.eventually.be.a.bignumber.equal(new BN(0));
    });
    it("TokenSale must have minter role", async () => {
        let myTokenInstance = await MyToken.deployed();
        let myTokenSaleInstance = await MyTokenSale.deployed();

        return expect(myTokenInstance.isMinter(myTokenSaleInstance.address)).to.eventually.be.true;
    });

    it("TokenSale KYC should reject unknown accounts", async () => {

        let myTokenInstance = await MyToken.deployed();
        let myTokenSaleInstance = await MyTokenSale.deployed();

        let balanceOfDeployer = await myTokenInstance.balanceOf(deployerAccount);

        expect(myTokenSaleInstance.sendTransaction({
            from: deployerAccount,
            value: web3.utils.toWei("1", "wei")
        })).to.eventually.be.rejected;
        return expect(myTokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    });

    it("Token Sale should be able sell tokens for KYC Completed Accounts", async () => {

        let myTokenInstance = await MyToken.deployed();
        let myTokenSaleInstance = await MyTokenSale.deployed();
        let instanceOfKYCContract = await KYCContract.deployed();
        let balanceOfDeployer = await myTokenInstance.balanceOf(deployerAccount);

        expect(myTokenSaleInstance.sendTransaction({
            from: deployerAccount,
            value: web3.utils.toWei("1", "wei")
        })).to.eventually.be.rejected;
        expect(myTokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);

        //adding deployer account to whitelist by the deoplyer who is also the owner
        await instanceOfKYCContract.setKycCompleted(deployerAccount);


        expect(myTokenSaleInstance.sendTransaction({
            from: deployerAccount,
            value: web3.utils.toWei("1", "wei")
        })).to.eventually.be.fulfilled;
        return expect(myTokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer.add(new BN(1)));
    });
});