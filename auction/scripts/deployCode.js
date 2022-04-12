
const hre = require("hardhat");

async function main() {

    const Auction = await hre.ethers.getContractFactory("auction");
    const auction = await Auction.deploy();

    await auction.deployed();

    console.log("Auction deployed to:", auction.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
