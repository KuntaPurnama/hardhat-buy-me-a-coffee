const {ethers} = require('hardhat')

async function buyACoffee(){
  const buyMeACoffee = await ethers.getContract("BuyMeACoffee")
  await buyMeACoffee.buyCoffee("test", "test message", {value: 1})
  console.log("Coffee Bought...")
}

buyACoffee()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })