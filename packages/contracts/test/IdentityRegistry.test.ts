import { expect } from "chai"
import { ethers } from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import type { IdentityRegistry } from "../typechain-types"
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"

const SAMPLE_URI = "ipfs://QmSampleHash123"
const AGENT_NAME = "ClawBot"

async function signMintMessage(
  agentSigner: HardhatEthersSigner,
  agentName: string,
  trainer: string,
  agentWallet: string,
  uri: string,
  contractAddress: string,
) {
  const domain = {
    name: "ClawTrainer",
    version: "1",
    chainId: (await agentSigner.provider.getNetwork()).chainId,
    verifyingContract: contractAddress,
  }
  const types = {
    MintAgent: [
      { name: "agentName", type: "string" },
      { name: "trainer", type: "address" },
      { name: "agentWallet", type: "address" },
      { name: "uri", type: "string" },
    ],
  }
  const value = { agentName, trainer, agentWallet, uri }
  return agentSigner.signTypedData(domain, types, value)
}

async function deployFixture() {
  const [owner, trainer, agentWallet, stranger, otherWallet] =
    await ethers.getSigners()
  const factory = await ethers.getContractFactory("IdentityRegistry")
  const registry = await factory.deploy()
  return { registry, owner, trainer, agentWallet, stranger, otherWallet }
}

async function mintedFixture() {
  const fixture = await deployFixture()
  const { registry, trainer, agentWallet } = fixture
  const contractAddress = await registry.getAddress()
  const signature = await signMintMessage(
    agentWallet,
    AGENT_NAME,
    trainer.address,
    agentWallet.address,
    SAMPLE_URI,
    contractAddress,
  )
  await registry
    .connect(trainer)
    .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, signature)
  const tokenId = await registry.computeAgentId(AGENT_NAME, trainer.address)
  return { ...fixture, tokenId }
}

describe("IdentityRegistry", () => {
  describe("mint", () => {
    it("should_mintWithDeterministicTokenId_when_called", async () => {
      const { registry, trainer, agentWallet } =
        await loadFixture(deployFixture)
      const expectedId = await registry.computeAgentId(
        AGENT_NAME,
        trainer.address,
      )
      const contractAddress = await registry.getAddress()
      const signature = await signMintMessage(
        agentWallet,
        AGENT_NAME,
        trainer.address,
        agentWallet.address,
        SAMPLE_URI,
        contractAddress,
      )
      await registry
        .connect(trainer)
        .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, signature)
      expect(await registry.ownerOf(expectedId)).to.equal(trainer.address)
    })

    it("should_setCorrectTokenURI_when_minted", async () => {
      const { registry, tokenId } = await loadFixture(mintedFixture)
      expect(await registry.tokenURI(tokenId)).to.equal(SAMPLE_URI)
    })

    it("should_bindAgentWalletToTokenId_when_minted", async () => {
      const { registry, agentWallet, tokenId } =
        await loadFixture(mintedFixture)
      expect(await registry.agentWallets(tokenId)).to.equal(
        agentWallet.address,
      )
      expect(await registry.walletToToken(agentWallet.address)).to.equal(
        tokenId,
      )
    })

    it("should_setInitialLevelToOne_when_minted", async () => {
      const { registry, tokenId } = await loadFixture(mintedFixture)
      expect(await registry.agentLevels(tokenId)).to.equal(1)
    })

    it("should_emitNFAMintedEvent_when_minted", async () => {
      const { registry, trainer, agentWallet } =
        await loadFixture(deployFixture)
      const expectedId = await registry.computeAgentId(
        AGENT_NAME,
        trainer.address,
      )
      const contractAddress = await registry.getAddress()
      const signature = await signMintMessage(
        agentWallet,
        AGENT_NAME,
        trainer.address,
        agentWallet.address,
        SAMPLE_URI,
        contractAddress,
      )
      await expect(
        registry
          .connect(trainer)
          .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, signature),
      )
        .to.emit(registry, "NFAMinted")
        .withArgs(
          expectedId,
          trainer.address,
          agentWallet.address,
          SAMPLE_URI,
        )
    })

    it("should_revert_when_duplicateAgent", async () => {
      const { registry, trainer, agentWallet, otherWallet } =
        await loadFixture(deployFixture)
      const contractAddress = await registry.getAddress()
      const signature = await signMintMessage(
        agentWallet,
        AGENT_NAME,
        trainer.address,
        agentWallet.address,
        SAMPLE_URI,
        contractAddress,
      )
      await registry
        .connect(trainer)
        .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, signature)
      const signature2 = await signMintMessage(
        otherWallet,
        AGENT_NAME,
        trainer.address,
        otherWallet.address,
        "ipfs://other",
        contractAddress,
      )
      await expect(
        registry
          .connect(trainer)
          .mint(AGENT_NAME, otherWallet.address, "ipfs://other", signature2),
      ).to.be.revertedWith("Agent already exists")
    })

    it("should_revert_when_zeroAddressWallet", async () => {
      const { registry, trainer } = await loadFixture(deployFixture)
      await expect(
        registry
          .connect(trainer)
          .mint(AGENT_NAME, ethers.ZeroAddress, SAMPLE_URI, "0x"),
      ).to.be.revertedWith("Zero address wallet")
    })

    it("should_revert_when_paused", async () => {
      const { registry, owner, trainer, agentWallet } =
        await loadFixture(deployFixture)
      await registry.connect(owner).pause()
      await expect(
        registry
          .connect(trainer)
          .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, "0x"),
      ).to.be.revertedWithCustomError(registry, "EnforcedPause")
    })

    it("should_revert_when_walletAlreadyBound", async () => {
      const { registry, trainer, stranger, agentWallet } =
        await loadFixture(deployFixture)
      const contractAddress = await registry.getAddress()
      const signature = await signMintMessage(
        agentWallet,
        AGENT_NAME,
        trainer.address,
        agentWallet.address,
        SAMPLE_URI,
        contractAddress,
      )
      await registry
        .connect(trainer)
        .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, signature)
      const signature2 = await signMintMessage(
        agentWallet,
        "OtherBot",
        stranger.address,
        agentWallet.address,
        "ipfs://other",
        contractAddress,
      )
      await expect(
        registry
          .connect(stranger)
          .mint("OtherBot", agentWallet.address, "ipfs://other", signature2),
      ).to.be.revertedWith("Wallet already bound")
    })

    it("should_mintToMsgSender_when_called", async () => {
      const { registry, trainer, agentWallet } =
        await loadFixture(deployFixture)
      const tokenId = await registry.computeAgentId(
        AGENT_NAME,
        trainer.address,
      )
      const contractAddress = await registry.getAddress()
      const signature = await signMintMessage(
        agentWallet,
        AGENT_NAME,
        trainer.address,
        agentWallet.address,
        SAMPLE_URI,
        contractAddress,
      )
      await registry
        .connect(trainer)
        .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, signature)
      expect(await registry.ownerOf(tokenId)).to.equal(trainer.address)
    })
  })

  describe("agent signature verification", () => {
    it("should_acceptValidSignatureAndMint_when_agentSigns", async () => {
      const { registry, trainer, agentWallet } =
        await loadFixture(deployFixture)
      const contractAddress = await registry.getAddress()
      const signature = await signMintMessage(
        agentWallet,
        AGENT_NAME,
        trainer.address,
        agentWallet.address,
        SAMPLE_URI,
        contractAddress,
      )
      await registry
        .connect(trainer)
        .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, signature)
      const tokenId = await registry.computeAgentId(
        AGENT_NAME,
        trainer.address,
      )
      expect(await registry.ownerOf(tokenId)).to.equal(trainer.address)
      expect(await registry.agentWallets(tokenId)).to.equal(
        agentWallet.address,
      )
    })

    it("should_reject_when_trainerSignsInsteadOfAgent", async () => {
      const { registry, trainer, agentWallet } =
        await loadFixture(deployFixture)
      const contractAddress = await registry.getAddress()
      const badSignature = await signMintMessage(
        trainer,
        AGENT_NAME,
        trainer.address,
        agentWallet.address,
        SAMPLE_URI,
        contractAddress,
      )
      await expect(
        registry
          .connect(trainer)
          .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, badSignature),
      ).to.be.revertedWith("Invalid agent signature")
    })

    it("should_reject_when_signedWithDifferentAgentName", async () => {
      const { registry, trainer, agentWallet } =
        await loadFixture(deployFixture)
      const contractAddress = await registry.getAddress()
      const badSignature = await signMintMessage(
        agentWallet,
        "TamperedName",
        trainer.address,
        agentWallet.address,
        SAMPLE_URI,
        contractAddress,
      )
      await expect(
        registry
          .connect(trainer)
          .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, badSignature),
      ).to.be.revertedWith("Invalid agent signature")
    })

    it("should_reject_when_signedForDifferentTrainer", async () => {
      const { registry, trainer, agentWallet, stranger } =
        await loadFixture(deployFixture)
      const contractAddress = await registry.getAddress()
      const badSignature = await signMintMessage(
        agentWallet,
        AGENT_NAME,
        stranger.address,
        agentWallet.address,
        SAMPLE_URI,
        contractAddress,
      )
      await expect(
        registry
          .connect(trainer)
          .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, badSignature),
      ).to.be.revertedWith("Invalid agent signature")
    })

    it("should_reject_when_emptySignature", async () => {
      const { registry, trainer, agentWallet } =
        await loadFixture(deployFixture)
      await expect(
        registry
          .connect(trainer)
          .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, "0x"),
      ).to.be.reverted
    })
  })

  describe("computeAgentId", () => {
    it("should_returnDeterministicHash_when_calledWithSameArgs", async () => {
      const { registry, trainer } = await loadFixture(deployFixture)
      const id1 = await registry.computeAgentId(AGENT_NAME, trainer.address)
      const id2 = await registry.computeAgentId(AGENT_NAME, trainer.address)
      expect(id1).to.equal(id2)
    })

    it("should_returnDifferentIds_when_differentNames", async () => {
      const { registry, trainer } = await loadFixture(deployFixture)
      const id1 = await registry.computeAgentId("BotA", trainer.address)
      const id2 = await registry.computeAgentId("BotB", trainer.address)
      expect(id1).to.not.equal(id2)
    })

    it("should_returnDifferentIds_when_differentOwners", async () => {
      const { registry, trainer, stranger } = await loadFixture(deployFixture)
      const id1 = await registry.computeAgentId(AGENT_NAME, trainer.address)
      const id2 = await registry.computeAgentId(AGENT_NAME, stranger.address)
      expect(id1).to.not.equal(id2)
    })
  })

  describe("levelUp", () => {
    it("should_incrementLevelByOne_when_calledByOwner", async () => {
      const { registry, trainer, tokenId } = await loadFixture(mintedFixture)
      await registry.connect(trainer).levelUp(tokenId)
      expect(await registry.agentLevels(tokenId)).to.equal(2)
    })

    it("should_revert_when_callerIsNotOwner", async () => {
      const { registry, stranger, tokenId } = await loadFixture(mintedFixture)
      await expect(
        registry.connect(stranger).levelUp(tokenId),
      ).to.be.revertedWith("Not NFA owner")
    })

    it("should_revert_when_atMaxLevel", async () => {
      const { registry, trainer, tokenId } = await loadFixture(mintedFixture)
      for (let i = 1; i < 255; i++) {
        await registry.connect(trainer).levelUp(tokenId)
      }
      expect(await registry.agentLevels(tokenId)).to.equal(255)
      await expect(
        registry.connect(trainer).levelUp(tokenId),
      ).to.be.revertedWith("Max level reached")
    })

    it("should_emitAgentLevelUpEvent_when_leveledUp", async () => {
      const { registry, trainer, tokenId } = await loadFixture(mintedFixture)
      await expect(registry.connect(trainer).levelUp(tokenId))
        .to.emit(registry, "AgentLevelUp")
        .withArgs(tokenId, 2)
    })
  })

  describe("getAgentWallet", () => {
    it("should_returnCorrectWallet_when_tokenExists", async () => {
      const { registry, agentWallet, tokenId } =
        await loadFixture(mintedFixture)
      expect(await registry.getAgentWallet(tokenId)).to.equal(
        agentWallet.address,
      )
    })

    it("should_returnZeroAddress_when_tokenDoesNotExist", async () => {
      const { registry } = await loadFixture(deployFixture)
      expect(await registry.getAgentWallet(999)).to.equal(ethers.ZeroAddress)
    })
  })

  describe("getDomainSeparator", () => {
    it("should_returnNonZeroValue_when_called", async () => {
      const { registry } = await loadFixture(deployFixture)
      const separator = await registry.getDomainSeparator()
      expect(separator).to.not.equal(ethers.ZeroHash)
    })
  })

  describe("soul-bound", () => {
    it("should_revert_when_transferFromCalled", async () => {
      const { registry, trainer, stranger, tokenId } =
        await loadFixture(mintedFixture)
      await expect(
        registry
          .connect(trainer)
          .transferFrom(trainer.address, stranger.address, tokenId),
      ).to.be.revertedWith("NFA is soul-bound")
    })

    it("should_revert_when_safeTransferFromCalled", async () => {
      const { registry, trainer, stranger, tokenId } =
        await loadFixture(mintedFixture)
      await expect(
        registry
          .connect(trainer)
          ["safeTransferFrom(address,address,uint256)"](
            trainer.address,
            stranger.address,
            tokenId,
          ),
      ).to.be.revertedWith("NFA is soul-bound")
    })

    it("should_allowMint_when_soulBoundEnabled", async () => {
      const { registry, trainer, agentWallet } =
        await loadFixture(deployFixture)
      const contractAddress = await registry.getAddress()
      const signature = await signMintMessage(
        agentWallet,
        AGENT_NAME,
        trainer.address,
        agentWallet.address,
        SAMPLE_URI,
        contractAddress,
      )
      await expect(
        registry
          .connect(trainer)
          .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, signature),
      ).to.not.be.reverted
    })
  })

  describe("pause/unpause", () => {
    it("should_pause_when_calledByOwner", async () => {
      const { registry, owner } = await loadFixture(deployFixture)
      await registry.connect(owner).pause()
      expect(await registry.paused()).to.be.true
    })

    it("should_unpause_when_calledByOwner", async () => {
      const { registry, owner } = await loadFixture(deployFixture)
      await registry.connect(owner).pause()
      await registry.connect(owner).unpause()
      expect(await registry.paused()).to.be.false
    })

    it("should_revert_when_nonOwnerPauses", async () => {
      const { registry, stranger } = await loadFixture(deployFixture)
      await expect(
        registry.connect(stranger).pause(),
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount")
    })

    it("should_blockMint_when_paused", async () => {
      const { registry, owner, trainer, agentWallet } =
        await loadFixture(deployFixture)
      await registry.connect(owner).pause()
      await expect(
        registry
          .connect(trainer)
          .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, "0x"),
      ).to.be.revertedWithCustomError(registry, "EnforcedPause")
    })

    it("should_allowMint_when_unpaused", async () => {
      const { registry, owner, trainer, agentWallet } =
        await loadFixture(deployFixture)
      await registry.connect(owner).pause()
      await registry.connect(owner).unpause()
      const contractAddress = await registry.getAddress()
      const signature = await signMintMessage(
        agentWallet,
        AGENT_NAME,
        trainer.address,
        agentWallet.address,
        SAMPLE_URI,
        contractAddress,
      )
      await expect(
        registry
          .connect(trainer)
          .mint(AGENT_NAME, agentWallet.address, SAMPLE_URI, signature),
      ).to.not.be.reverted
    })
  })
})
