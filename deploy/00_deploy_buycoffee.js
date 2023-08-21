const {network} = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const { verify } = require('crypto')


module.exports = async({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    
    const buyMeACoffee = await deploy("BuyMeACoffee", {
        from: deployer,
        args : [],
        log: true,
        waitConfirmations: 1
    })

    if(!developmentChains.includes(network.name)){
        verify(buyMeACoffee.addresss, [])
    }

    log("---------------------------------------------")
}

module.exports.tags = ["all", "buymeacoffee"]