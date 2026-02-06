import { ethers } from "hardhat"

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with:", deployer.address)

  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry")
  const registry = await IdentityRegistry.deploy()
  await registry.waitForDeployment()

  const address = await registry.getAddress()
  console.log("IdentityRegistry deployed to:", address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
