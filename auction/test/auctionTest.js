const chai = require ('chai')
const {expect} = require ('chai')
const {solidity} = require ('ethereum-waffle')
const {BigNumber} = require ('ethers')
const { advanceTime, currentTimestamp} = require('./utils');
const {artifacts, ethers, waffle} = require ('hardhat')
describe ('Testing the New English Auction Contract', async function() {
    let auction;
    beforeEach('Setting up the contract for the testing', async function() {
        [alice, bob, july, laura] = await ethers.getSigners();
        const Auction = await ethers.getContractFactory('auction')
        auction = await Auction.deploy()
    })
    it ('Test1: Testing startBid function', async function() {
        await auction.setAuctionStatus();
        await auction.connect(alice).startBid({value:ethers.utils.parseEther('1')})
        await expect(auction.connect(alice).startBid({value:ethers.utils.parseEther('1')}))
            .to
            .be
            .revertedWith('Bid More')
        await expect(auction.connect(bob).startBid({value:ethers.utils.parseEther('0')}))
            .to
            .be
            .revertedWith('!0')
        expect (await auction.bidMaker(ethers.utils.parseEther('1'))).to.equal(alice.address)
        expect (await auction.highestValue()).to.equal(ethers.utils.parseEther('1'))
    })
    it ("Test2: Withdraw Owner Funds", async function() {
        await auction.setAuctionStatus();
        await auction.connect(alice).startBid({value:ethers.utils.parseEther('1')})
        await auction.connect(bob).startBid({value:ethers.utils.parseEther('1.3')})
        await auction.connect(laura).startBid({value:ethers.utils.parseEther('1.5')})
        await auction.connect(july).startBid({value:ethers.utils.parseEther('1.6')})
        let provider = waffle.provider
        let ownerBalanceBeforeWithdraw = BigNumber.from(await provider.getBalance(await auction.owner()))
        console.log('The owner balance before withdraw', ownerBalanceBeforeWithdraw);
        await auction.withDrawFundsOwner()
        let ownerBalanceAfterWithdraw = BigNumber.from(await provider.getBalance(await auction.owner()))
        console.log('The owner balance after withdraw', ownerBalanceAfterWithdraw);
    })
    it ("Test3: Start-Stop Auction", async function() {
        await auction.setAuctionStatus();
        await advanceTime(8 * 24 * 3600)
        await expect(auction.startBid({value:ethers.utils.parseEther('1')}))
            .to.be.revertedWith("Auction Not Started")
        await auction.setAuctionStatus()
        await auction.setAuctionStatus()
        await auction.connect(bob).startBid({value:ethers.utils.parseEther('1')})
        expect (await auction.highestValue())
            .to
            .equal(
                ethers.utils.parseEther('1')
            )
    })
})