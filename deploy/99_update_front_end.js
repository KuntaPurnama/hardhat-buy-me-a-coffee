const { ethers, network } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDRESSES_FILE = "../nextjs-buy-me-coffee/constants/contract-address.json"
const FRONT_END_ABI_FILE = "../nextjs-buy-me-coffee/constants/abi.json"

module.exports = async function(){
    if(process.env.UPDATE_FRONT_END){
        console.log("update front end")
        await updateContractAddress()
        console.log("get abi")
        await updateAbi()
    }
}

async function updateAbi(){
    const chatApp = await ethers.getContract('BuyMeACoffee')
    fs.writeFileSync(FRONT_END_ABI_FILE, chatApp.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddress(){
    const chatApp = await ethers.getContract("BuyMeACoffee")
    const chainId = network.config.chainId.toString()
    const contractAddress = (await chatApp).address
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(contractAddress)) {
            currentAddresses[chainId].push(contractAddress)
        }
    } else {
        currentAddresses[chainId] = [contractAddress]
    }

    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))

}

module.exports.tags = ["all", "frontend"]