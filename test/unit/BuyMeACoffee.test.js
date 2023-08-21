const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");
const exp = require("constants");

!developmentChains.includes(network.name) ? describe.skip :
    describe("BuyMeACoffee Unit Test", function(){
        let deployer, buyMeACoffeeContract, buyMeACoffee
        const FUND_AMOUNT = ethers.utils.parseEther("1")
        beforeEach(async () => {
            accounts = await ethers.getSigners()
            deployer = await accounts[0]
            await deployments.fixture(["all"])
            
            buyMeACoffeeContract = await ethers.getContract("BuyMeACoffee")
            buyMeACoffee = buyMeACoffeeContract.connect(deployer)
        })

        describe("buy coffee", function(){
            it("test buy coffee success", async () => {
                await expect(buyMeACoffee.buyCoffee("test", "test message", { value: FUND_AMOUNT })).to.emit(buyMeACoffee, "NewMemo")
                const memo = await buyMeACoffee.getMemo()
                assert.equal(memo[0].name, "test")
            })

            it("test buy coffee balance not enough", async () => {
                await expect(buyMeACoffee.buyCoffee("test", "test message2", {value : 0})).to.be.revertedWith("can't buy coffee with 0 eth")
            })
        })

        describe("withdraw", function(){
            it("withdraw success", async () => {
                // Deploy the contract and perform actions...

                await buyMeACoffee.buyCoffee("test", "test message", { value: FUND_AMOUNT })
                const startingDeployerBalance = await deployer.getBalance();
                const startingContractBalance = await buyMeACoffee.provider.getBalance(buyMeACoffee.address);
            
                // Perform the withdrawal
                const txResponse = await buyMeACoffee.withdrawTips();
            
                const gasCost = await calculateGasCost(txResponse);
                const expectedDeployerBalance = startingDeployerBalance.add(startingContractBalance).sub(gasCost);
            
                const currentDeployerBalance = await deployer.getBalance();
                const currentContractBalance = await buyMeACoffee.provider.getBalance(buyMeACoffee.address);
            
                // Use BigNumber comparisons
                expect(currentDeployerBalance).to.equal(expectedDeployerBalance);
                expect(currentContractBalance).to.equal(ethers.constants.Zero); 

                // const startingDeployerBalance = await buyMeACoffee.provider.getBalance(deployer.address)
                // console.log("start Deployer balance", startingDeployerBalance.toString())

                // const startingDeployerBalance2 = await deployer.getBalance()
                // console.log("start Deployer balance2", startingDeployerBalance2.toString())

                // await buyMeACoffee.buyCoffee("test", "test message", { value: FUND_AMOUNT })

                // const startingContractBalance = await buyMeACoffee.provider.getBalance(buyMeACoffee.address)
                // console.log("start contract balance", startingContractBalance.toString())

                // const txResponse = await buyMeACoffee.withdrawTips()
                // const txReceipt = await txResponse.wait(1)

                // const gasCost = txReceipt.gasUsed.mul(
                //     txReceipt.effectiveGasPrice
                // )

                // console.log('tx recipt', txReceipt)
                // console.log('tx recipt2', txReceipt.gasUsed.toString())
                // console.log('tx recipt3', txReceipt.effectiveGasPrice.toString())
                // console.log('tx recipt4', txReceipt.cumulativeGasUsed.toString())

                // const currentDeployerBalance = await buyMeACoffee.provider.getBalance(deployer.address)
                // console.log("current Deployer balance", currentDeployerBalance.toString())

                // const currentDeployerBalance2 = await deployer.getBalance()
                // console.log("current Deployer balance2", currentDeployerBalance2.toString())

                // const currentContractBalance = await buyMeACoffee.provider.getBalance(buyMeACoffee.address)
                // console.log("current contract balance", currentContractBalance.toString())
                
                // console.log("final blaance", currentDeployerBalance.add(gasCost).toString())

                // assert.equal(currentContractBalance.toString(), "0")
                // assert.equal(currentDeployerBalance.add(gasCost).toString(), startingDeployerBalance.add(startingContractBalance).toString())
            })

            it("withdraw failed", async () => {
                const user = await ethers.getSigner(1)
                const buyMeACoffee2 = buyMeACoffeeContract.connect(user)
                await expect(buyMeACoffee2.withdrawTips()).to.be.revertedWith("You are not the owner")
            })
        })

        async function calculateGasCost(txResponse) {
            const txReceipt = await txResponse.wait(1);
            const gasUsed = txReceipt.gasUsed;
            const gasPrice = txReceipt.effectiveGasPrice;
            return gasUsed.mul(gasPrice);
          }
    })
