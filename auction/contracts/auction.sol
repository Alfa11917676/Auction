//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
contract auction is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter public peopleCount;

    uint public highestValue;
    uint public auctionStartTime;
    bool public auctionStatus;
    mapping (uint => address) public bidMaker;
    mapping (address => uint) public bidAmount;
    mapping (uint => bool) public isBidPresent;
    mapping (address => bool) public hasBid;
    mapping (address => uint) public bidCounterToAddress;
    mapping (uint => mapping (address => uint)) public biddingSetting;
    event highestValueChanged(uint amount);

    modifier isAuctionOn {
        require (auctionStatus == true && auctionStartTime+ 7 days >= block.timestamp, 'Auction Not Started');
        _;
    }

    //Setters
    function setAuctionStatus() external onlyOwner {
        auctionStatus = !auctionStatus;
        if (auctionStatus) auctionStartTime = block.timestamp;
    }

    function startBid () external payable isAuctionOn{
        require (msg.value > 0,'!0');
        require (msg.value > highestValue,'Bid More');
        if (!hasBid[_msgSender()])
        peopleCount.increment();
        hasBid[_msgSender()] = true;
        if (highestValue>0){
            address _toSend = bidMaker[highestValue];
            payable(_toSend).transfer(highestValue);
        }
        bidMaker[msg.value] = msg.sender;
        highestValue = msg.value;
        emit highestValueChanged(msg.value);
    }

    function withDrawFundsOwner () external onlyOwner {
        require(address(this).balance >= 0,'Empty');
        payable(owner()).transfer(address(this).balance);
    }
}
