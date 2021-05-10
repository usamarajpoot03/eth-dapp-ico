const MyToken = artifacts.require("MyToken");

require("dotenv").config({
    path: "../.env"
});

const chai = require("./chaiSetup.js");
const BN = web3.utils.BN;

const expect = chai.expect;

contract("MyToken Test", async (accounts) => {
    const [deployerAccount, recipientAccount, anotherAccount] = accounts;

    beforeEach(async () => {
        this.token = await MyToken.new();
    });

    it("Deployer should be able to mint tokens ", async () => {
        const myTokenInstance = this.token;

        let balanceOfDeployer = await myTokenInstance.balanceOf(deployerAccount);
        const newTokens = 1;
        const newTotalTokens = balanceOfDeployer + newTokens;

        expect(myTokenInstance.mint(deployerAccount, newTokens)).to.eventually.be.fulfilled;
        return expect(myTokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(newTotalTokens));
    });

    it("It should be able to send tokens between accounts ", async () => {
        const myTokenInstance = this.token;
        let balanceOfDeployer = await myTokenInstance.balanceOf(deployerAccount);
        let balanceOfRecipient = await myTokenInstance.balanceOf(deployerAccount);

        const newTokens = 1;

        expect(myTokenInstance.mint(deployerAccount, newTokens)).to.eventually.be.fulfilled;
        expect(myTokenInstance.transfer(recipientAccount, newTokens)).to.eventually.be.fulfilled;
        expect(myTokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
        return expect(myTokenInstance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(new BN(balanceOfRecipient + 1));
    });

    it("Its not possible to send more tokens than available", async () => {
        let instance = this.token;
        let balanceOfDeployer = await instance.balanceOf(deployerAccount);

        expect(instance.transfer(recipientAccount, balanceOfDeployer + 1)).to.eventually.be.rejected;
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    });

    it("Only minter can mint the tokens", async () => {
        const myTokenInstance = this.token;
        let balanceOfRecipient = await myTokenInstance.balanceOf(recipientAccount);

        expect(myTokenInstance.mint(recipientAccount, 1, {
            from: recipientAccount
        })).to.eventually.be.rejected;
        return expect(myTokenInstance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(new BN(balanceOfRecipient));
    });

    it("minter role can be assigned", async () => {
        const myTokenInstance = this.token;
        let balanceOfRecipient = await myTokenInstance.balanceOf(recipientAccount);
        let newTokens = 1;

        expect(myTokenInstance.addMinter(recipientAccount)).to.eventually.be.fulfilled;

        expect(myTokenInstance.mint(recipientAccount, newTokens, {
            from: recipientAccount
        })).to.eventually.be.fulfilled;
        return expect(myTokenInstance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(new BN(balanceOfRecipient + newTokens));
    });


});