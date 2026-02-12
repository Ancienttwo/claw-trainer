import { ethers } from "hardhat"

const ERC8004_IDENTITY_REGISTRY: Record<number, string> = {
  97: "0x8004A818BFB912233c491871b3d84c89A494BD9e",
  56: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
}

async function main() {
  const [deployer] = await ethers.getSigners()
  const { chainId } = await ethers.provider.getNetwork()

  const registry = ERC8004_IDENTITY_REGISTRY[Number(chainId)]
  if (!registry) throw new Error(`No ERC-8004 registry for chain ${chainId}`)

  console.log(`Deploying ClawTrainerNFA on chain ${chainId}`)
  console.log(`Deployer: ${deployer.address}`)
  console.log(`ERC-8004 Registry: ${registry}`)

  const factory = await ethers.getContractFactory("ClawTrainerNFA")
  const nfa = await factory.deploy(registry)
  await nfa.waitForDeployment()

  const address = await nfa.getAddress()
  console.log(`ClawTrainerNFA deployed at: ${address}`)
  console.log(`Block: ${await ethers.provider.getBlockNumber()}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
