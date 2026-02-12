import { expect } from "chai"
import { ethers } from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import type { ClawTrainerNFA, MockIdentityRegistry } from "../typechain-types"
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"

const SAMPLE_META = {
  persona: "CyberLobster",
  experience: "trading,analysis",
  voiceHash: "QmVoice123",
  animationURI: "ipfs://QmAnim",
  vaultURI: "ipfs://QmVault",
  vaultHash: ethers.id("vault-content"),
}

async function signActivateMessage(
  agentSigner: HardhatEthersSigner,
  erc8004AgentId: bigint,
  trainer: string,
  contractAddress: string,
) {
  const domain = {
    name: "ClawTrainerNFA",
    version: "1",
    chainId: (await agentSigner.provider.getNetwork()).chainId,
    verifyingContract: contractAddress,
  }
  const types = {
    ActivateAgent: [
      { name: "erc8004AgentId", type: "uint256" },
      { name: "trainer", type: "address" },
    ],
  }
  const value = { erc8004AgentId, trainer }
  return agentSigner.signTypedData(domain, types, value)
}

async function deployFixture() {
  const [owner, trainer, agentWallet, stranger, otherWallet] =
    await ethers.getSigners()

  const mockFactory = await ethers.getContractFactory("MockIdentityRegistry")
  const mockRegistry = (await mockFactory.deploy()) as MockIdentityRegistry

  const nfaFactory = await ethers.getContractFactory("ClawTrainerNFA")
  const nfa = (await nfaFactory.deploy(
    await mockRegistry.getAddress(),
  )) as ClawTrainerNFA

  return { nfa, mockRegistry, owner, trainer, agentWallet, stranger, otherWallet }
}

async function activatedFixture() {
  const fixture = await deployFixture()
  const { nfa, mockRegistry, trainer, agentWallet } = fixture

  const agentId = await mockRegistry.register(trainer.address)
  const erc8004AgentId = 0n
  await mockRegistry.setMockAgentWallet(erc8004AgentId, agentWallet.address)

  const contractAddress = await nfa.getAddress()
  const signature = await signActivateMessage(
    agentWallet,
    erc8004AgentId,
    trainer.address,
    contractAddress,
  )

  await nfa.connect(trainer).activate(erc8004AgentId, SAMPLE_META, signature)
  const tokenId = 0n

  return { ...fixture, tokenId, erc8004AgentId }
}

describe("ClawTrainerNFA", () => {
  // ═══════════════════════════════════════════════
  // DEPLOYMENT
  // ═══════════════════════════════════════════════

  describe("deployment", () => {
    it("should_setErc8004Registry_when_deployed", async () => {
      const { nfa, mockRegistry } = await loadFixture(deployFixture)
      expect(await nfa.erc8004Registry()).to.equal(
        await mockRegistry.getAddress(),
      )
    })

    it("should_revert_when_zeroRegistryAddress", async () => {
      const factory = await ethers.getContractFactory("ClawTrainerNFA")
      await expect(factory.deploy(ethers.ZeroAddress)).to.be.revertedWith(
        "Zero registry",
      )
    })

    it("should_setOwnerToDeployer_when_deployed", async () => {
      const { nfa, owner } = await loadFixture(deployFixture)
      expect(await nfa.owner()).to.equal(owner.address)
    })

    it("should_startWithZeroSupply_when_deployed", async () => {
      const { nfa } = await loadFixture(deployFixture)
      expect(await nfa.totalSupply()).to.equal(0)
    })
  })

  // ═══════════════════════════════════════════════
  // ACTIVATION
  // ═══════════════════════════════════════════════

  describe("activate", () => {
    it("should_mintNFA_when_erc8004OwnerActivates", async () => {
      const { nfa, mockRegistry, trainer, agentWallet } =
        await loadFixture(deployFixture)
      await mockRegistry.register(trainer.address)
      await mockRegistry.setMockAgentWallet(0n, agentWallet.address)

      const contractAddress = await nfa.getAddress()
      const sig = await signActivateMessage(
        agentWallet,
        0n,
        trainer.address,
        contractAddress,
      )

      await nfa.connect(trainer).activate(0n, SAMPLE_META, sig)
      expect(await nfa.ownerOf(0)).to.equal(trainer.address)
    })

    it("should_linkErc8004AgentId_when_activated", async () => {
      const { nfa, tokenId, erc8004AgentId } =
        await loadFixture(activatedFixture)
      expect(await nfa.erc8004AgentId(tokenId)).to.equal(erc8004AgentId)
    })

    it("should_storeAgentWallet_when_activated", async () => {
      const { nfa, tokenId, agentWallet } =
        await loadFixture(activatedFixture)
      expect(await nfa.agentWallets(tokenId)).to.equal(agentWallet.address)
    })

    it("should_setStatusToActive_when_activated", async () => {
      const { nfa, tokenId } = await loadFixture(activatedFixture)
      const state = await nfa.getState(tokenId)
      expect(state.status).to.equal(0) // Active = 0
    })

    it("should_enableLearning_when_activated", async () => {
      const { nfa, tokenId } = await loadFixture(activatedFixture)
      expect(await nfa.isLearningEnabled(tokenId)).to.be.true
    })

    it("should_incrementTotalSupply_when_activated", async () => {
      const { nfa } = await loadFixture(activatedFixture)
      expect(await nfa.totalSupply()).to.equal(1)
    })

    it("should_emitNFAActivatedEvent_when_activated", async () => {
      const { nfa, mockRegistry, trainer, agentWallet } =
        await loadFixture(deployFixture)
      await mockRegistry.register(trainer.address)
      await mockRegistry.setMockAgentWallet(0n, agentWallet.address)

      const contractAddress = await nfa.getAddress()
      const sig = await signActivateMessage(
        agentWallet,
        0n,
        trainer.address,
        contractAddress,
      )

      await expect(nfa.connect(trainer).activate(0n, SAMPLE_META, sig))
        .to.emit(nfa, "NFAActivated")
        .withArgs(0, 0n, trainer.address)
    })

    it("should_emitStatusChangedEvent_when_activated", async () => {
      const { nfa, mockRegistry, trainer, agentWallet } =
        await loadFixture(deployFixture)
      await mockRegistry.register(trainer.address)
      await mockRegistry.setMockAgentWallet(0n, agentWallet.address)

      const contractAddress = await nfa.getAddress()
      const sig = await signActivateMessage(
        agentWallet,
        0n,
        trainer.address,
        contractAddress,
      )

      await expect(nfa.connect(trainer).activate(0n, SAMPLE_META, sig))
        .to.emit(nfa, "StatusChanged")
        .withArgs(0, 0) // tokenId=0, Status.Active=0
    })

    it("should_revert_when_callerIsNotErc8004Owner", async () => {
      const { nfa, mockRegistry, trainer, agentWallet, stranger } =
        await loadFixture(deployFixture)
      await mockRegistry.register(trainer.address)
      await mockRegistry.setMockAgentWallet(0n, agentWallet.address)

      const contractAddress = await nfa.getAddress()
      const sig = await signActivateMessage(
        agentWallet,
        0n,
        stranger.address,
        contractAddress,
      )

      await expect(
        nfa.connect(stranger).activate(0n, SAMPLE_META, sig),
      ).to.be.revertedWith("Not ERC-8004 owner")
    })

    it("should_revert_when_alreadyActivated", async () => {
      const { nfa, mockRegistry, trainer, agentWallet, erc8004AgentId } =
        await loadFixture(activatedFixture)

      const contractAddress = await nfa.getAddress()
      const sig = await signActivateMessage(
        agentWallet,
        erc8004AgentId,
        trainer.address,
        contractAddress,
      )

      await expect(
        nfa.connect(trainer).activate(erc8004AgentId, SAMPLE_META, sig),
      ).to.be.revertedWith("Already activated")
    })

    it("should_revert_when_noAgentWalletInErc8004", async () => {
      const { nfa, mockRegistry, trainer, agentWallet } =
        await loadFixture(deployFixture)
      await mockRegistry.register(trainer.address)
      // Do NOT set agent wallet

      const contractAddress = await nfa.getAddress()
      const sig = await signActivateMessage(
        agentWallet,
        0n,
        trainer.address,
        contractAddress,
      )

      await expect(
        nfa.connect(trainer).activate(0n, SAMPLE_META, sig),
      ).to.be.revertedWith("No agent wallet in ERC-8004")
    })

    it("should_revert_when_invalidAgentSignature", async () => {
      const { nfa, mockRegistry, trainer, agentWallet, stranger } =
        await loadFixture(deployFixture)
      await mockRegistry.register(trainer.address)
      await mockRegistry.setMockAgentWallet(0n, agentWallet.address)

      const contractAddress = await nfa.getAddress()
      // stranger signs instead of agentWallet
      const badSig = await signActivateMessage(
        stranger,
        0n,
        trainer.address,
        contractAddress,
      )

      await expect(
        nfa.connect(trainer).activate(0n, SAMPLE_META, badSig),
      ).to.be.revertedWith("Invalid agent signature")
    })

    it("should_revert_when_contractPaused", async () => {
      const { nfa, mockRegistry, owner, trainer, agentWallet } =
        await loadFixture(deployFixture)
      await mockRegistry.register(trainer.address)
      await mockRegistry.setMockAgentWallet(0n, agentWallet.address)
      await nfa.connect(owner).pauseContract()

      await expect(
        nfa.connect(trainer).activate(0n, SAMPLE_META, "0x"),
      ).to.be.revertedWithCustomError(nfa, "EnforcedPause")
    })
  })

  // ═══════════════════════════════════════════════
  // STATE MACHINE
  // ═══════════════════════════════════════════════

  describe("state machine", () => {
    it("should_pauseAgent_when_activeAndOwnerCalls", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).pauseAgent(tokenId)
      const state = await nfa.getState(tokenId)
      expect(state.status).to.equal(1) // Paused = 1
    })

    it("should_emitStatusChanged_when_paused", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await expect(nfa.connect(trainer).pauseAgent(tokenId))
        .to.emit(nfa, "StatusChanged")
        .withArgs(tokenId, 1) // Paused = 1
    })

    it("should_unpauseAgent_when_pausedAndOwnerCalls", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).pauseAgent(tokenId)
      await nfa.connect(trainer).unpauseAgent(tokenId)
      const state = await nfa.getState(tokenId)
      expect(state.status).to.equal(0) // Active = 0
    })

    it("should_terminate_when_activeAndOwnerCalls", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).terminate(tokenId)
      const state = await nfa.getState(tokenId)
      expect(state.status).to.equal(2) // Terminated = 2
    })

    it("should_terminate_when_pausedAndOwnerCalls", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).pauseAgent(tokenId)
      await nfa.connect(trainer).terminate(tokenId)
      const state = await nfa.getState(tokenId)
      expect(state.status).to.equal(2)
    })

    it("should_revert_when_terminatingAlreadyTerminated", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).terminate(tokenId)
      await expect(
        nfa.connect(trainer).terminate(tokenId),
      ).to.be.revertedWith("Already terminated")
    })

    it("should_revert_when_pausingNonActive", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).pauseAgent(tokenId)
      await expect(
        nfa.connect(trainer).pauseAgent(tokenId),
      ).to.be.revertedWith("Not active")
    })

    it("should_revert_when_unpausingNonPaused", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await expect(
        nfa.connect(trainer).unpauseAgent(tokenId),
      ).to.be.revertedWith("Not paused")
    })

    it("should_revert_when_strangerPauses", async () => {
      const { nfa, stranger, tokenId } = await loadFixture(activatedFixture)
      await expect(
        nfa.connect(stranger).pauseAgent(tokenId),
      ).to.be.revertedWith("Not NFA owner")
    })

    it("should_revert_when_strangerTerminates", async () => {
      const { nfa, stranger, tokenId } = await loadFixture(activatedFixture)
      await expect(
        nfa.connect(stranger).terminate(tokenId),
      ).to.be.revertedWith("Not NFA owner")
    })
  })

  // ═══════════════════════════════════════════════
  // METADATA
  // ═══════════════════════════════════════════════

  describe("metadata", () => {
    it("should_returnStoredMetadata_when_getAgentMetadataCalled", async () => {
      const { nfa, tokenId } = await loadFixture(activatedFixture)
      const meta = await nfa.getAgentMetadata(tokenId)
      expect(meta.persona).to.equal(SAMPLE_META.persona)
      expect(meta.experience).to.equal(SAMPLE_META.experience)
      expect(meta.voiceHash).to.equal(SAMPLE_META.voiceHash)
      expect(meta.animationURI).to.equal(SAMPLE_META.animationURI)
      expect(meta.vaultURI).to.equal(SAMPLE_META.vaultURI)
      expect(meta.vaultHash).to.equal(SAMPLE_META.vaultHash)
    })

    it("should_updateMetadata_when_ownerCalls", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      const newMeta = {
        ...SAMPLE_META,
        persona: "EvolveLobster",
        experience: "defi,nft",
      }
      await nfa.connect(trainer).updateAgentMetadata(tokenId, newMeta)
      const meta = await nfa.getAgentMetadata(tokenId)
      expect(meta.persona).to.equal("EvolveLobster")
      expect(meta.experience).to.equal("defi,nft")
    })

    it("should_emitMetadataUpdated_when_metadataChanged", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await expect(
        nfa.connect(trainer).updateAgentMetadata(tokenId, SAMPLE_META),
      )
        .to.emit(nfa, "MetadataUpdated")
        .withArgs(tokenId)
    })

    it("should_revert_when_terminatedAgentUpdatesMetadata", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).terminate(tokenId)
      await expect(
        nfa.connect(trainer).updateAgentMetadata(tokenId, SAMPLE_META),
      ).to.be.revertedWith("Terminated")
    })

    it("should_revert_when_strangerUpdatesMetadata", async () => {
      const { nfa, stranger, tokenId } = await loadFixture(activatedFixture)
      await expect(
        nfa.connect(stranger).updateAgentMetadata(tokenId, SAMPLE_META),
      ).to.be.revertedWith("Not NFA owner")
    })
  })

  // ═══════════════════════════════════════════════
  // EXECUTION
  // ═══════════════════════════════════════════════

  describe("execution", () => {
    it("should_revert_when_noLogicContract", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await expect(
        nfa.connect(trainer).executeAction(tokenId, "0x"),
      ).to.be.revertedWith("No logic contract")
    })

    it("should_revert_when_agentNotActive", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).pauseAgent(tokenId)
      await expect(
        nfa.connect(trainer).executeAction(tokenId, "0x"),
      ).to.be.revertedWith("Not active")
    })

    it("should_revert_when_strangerExecutes", async () => {
      const { nfa, stranger, tokenId } = await loadFixture(activatedFixture)
      await expect(
        nfa.connect(stranger).executeAction(tokenId, "0x"),
      ).to.be.revertedWith("Not NFA owner")
    })

    it("should_setLogicAddress_when_ownerCalls", async () => {
      const { nfa, trainer, tokenId, stranger } =
        await loadFixture(activatedFixture)
      await nfa.connect(trainer).setLogicAddress(tokenId, stranger.address)
      const state = await nfa.getState(tokenId)
      expect(state.logicAddress).to.equal(stranger.address)
    })

    it("should_emitLogicAddressChanged_when_logicSet", async () => {
      const { nfa, trainer, tokenId, stranger } =
        await loadFixture(activatedFixture)
      await expect(
        nfa.connect(trainer).setLogicAddress(tokenId, stranger.address),
      )
        .to.emit(nfa, "LogicAddressChanged")
        .withArgs(tokenId, stranger.address)
    })

    it("should_revert_when_strangerSetsLogic", async () => {
      const { nfa, stranger, tokenId } = await loadFixture(activatedFixture)
      await expect(
        nfa.connect(stranger).setLogicAddress(tokenId, stranger.address),
      ).to.be.revertedWith("Not NFA owner")
    })
  })

  // ═══════════════════════════════════════════════
  // FUNDING
  // ═══════════════════════════════════════════════

  describe("funding", () => {
    it("should_increaseBalance_when_funded", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).fundAgent(tokenId, { value: 1000n })
      const state = await nfa.getState(tokenId)
      expect(state.balance).to.equal(1000n)
    })

    it("should_emitAgentFunded_when_funded", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await expect(
        nfa.connect(trainer).fundAgent(tokenId, { value: 500n }),
      )
        .to.emit(nfa, "AgentFunded")
        .withArgs(tokenId, 500n)
    })

    it("should_allowAnyoneToFund_when_tokenExists", async () => {
      const { nfa, stranger, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(stranger).fundAgent(tokenId, { value: 100n })
      const state = await nfa.getState(tokenId)
      expect(state.balance).to.equal(100n)
    })

    it("should_revert_when_zeroFunding", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await expect(
        nfa.connect(trainer).fundAgent(tokenId, { value: 0n }),
      ).to.be.revertedWith("Zero funding")
    })

    it("should_withdraw_when_ownerWithdrawsWithSufficientBalance", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).fundAgent(tokenId, { value: 1000n })

      const balanceBefore = await ethers.provider.getBalance(trainer.address)
      const tx = await nfa.connect(trainer).withdrawAgentFunds(tokenId, 500n)
      const receipt = await tx.wait()
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice
      const balanceAfter = await ethers.provider.getBalance(trainer.address)

      expect(balanceAfter + gasUsed - balanceBefore).to.equal(500n)

      const state = await nfa.getState(tokenId)
      expect(state.balance).to.equal(500n)
    })

    it("should_revert_when_insufficientBalance", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await expect(
        nfa.connect(trainer).withdrawAgentFunds(tokenId, 1n),
      ).to.be.revertedWith("Insufficient balance")
    })

    it("should_revert_when_strangerWithdraws", async () => {
      const { nfa, trainer, stranger, tokenId } =
        await loadFixture(activatedFixture)
      await nfa.connect(trainer).fundAgent(tokenId, { value: 1000n })
      await expect(
        nfa.connect(stranger).withdrawAgentFunds(tokenId, 100n),
      ).to.be.revertedWith("Not NFA owner")
    })
  })

  // ═══════════════════════════════════════════════
  // LEARNING
  // ═══════════════════════════════════════════════

  describe("learning", () => {
    const ROOT_A = ethers.id("learning-root-a")
    const ROOT_B = ethers.id("learning-root-b")

    it("should_updateLearningRoot_when_ownerUpdates", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      const update = {
        previousRoot: ethers.ZeroHash,
        newRoot: ROOT_A,
        proof: ethers.ZeroHash,
        metadata: ethers.ZeroHash,
      }
      await nfa.connect(trainer).updateLearning(tokenId, update)
      expect(await nfa.getLearningRoot(tokenId)).to.equal(ROOT_A)
    })

    it("should_incrementLearningEvents_when_learningUpdated", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      const update = {
        previousRoot: ethers.ZeroHash,
        newRoot: ROOT_A,
        proof: ethers.ZeroHash,
        metadata: ethers.ZeroHash,
      }
      await nfa.connect(trainer).updateLearning(tokenId, update)
      const metrics = await nfa.getLearningMetrics(tokenId)
      expect(metrics.learningEvents).to.equal(1)
    })

    it("should_emitLearningUpdated_when_rootChanged", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      const update = {
        previousRoot: ethers.ZeroHash,
        newRoot: ROOT_A,
        proof: ethers.ZeroHash,
        metadata: ethers.ZeroHash,
      }
      await expect(nfa.connect(trainer).updateLearning(tokenId, update))
        .to.emit(nfa, "LearningUpdated")
        .withArgs(tokenId, ROOT_A)
    })

    it("should_revert_when_rootMismatch", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      const update = {
        previousRoot: ROOT_A, // mismatch: actual is zero
        newRoot: ROOT_B,
        proof: ethers.ZeroHash,
        metadata: ethers.ZeroHash,
      }
      await expect(
        nfa.connect(trainer).updateLearning(tokenId, update),
      ).to.be.revertedWith("Root mismatch")
    })

    it("should_revert_when_learningDisabledOrInactive", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).pauseAgent(tokenId)
      const update = {
        previousRoot: ethers.ZeroHash,
        newRoot: ROOT_A,
        proof: ethers.ZeroHash,
        metadata: ethers.ZeroHash,
      }
      await expect(
        nfa.connect(trainer).updateLearning(tokenId, update),
      ).to.be.revertedWith("Not active")
    })

    it("should_revert_when_strangerUpdatesLearning", async () => {
      const { nfa, stranger, tokenId } = await loadFixture(activatedFixture)
      const update = {
        previousRoot: ethers.ZeroHash,
        newRoot: ROOT_A,
        proof: ethers.ZeroHash,
        metadata: ethers.ZeroHash,
      }
      await expect(
        nfa.connect(stranger).updateLearning(tokenId, update),
      ).to.be.revertedWith("Not NFA owner")
    })

    it("should_chainUpdates_when_previousRootMatchesCurrent", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).updateLearning(tokenId, {
        previousRoot: ethers.ZeroHash,
        newRoot: ROOT_A,
        proof: ethers.ZeroHash,
        metadata: ethers.ZeroHash,
      })
      await nfa.connect(trainer).updateLearning(tokenId, {
        previousRoot: ROOT_A,
        newRoot: ROOT_B,
        proof: ethers.ZeroHash,
        metadata: ethers.ZeroHash,
      })
      expect(await nfa.getLearningRoot(tokenId)).to.equal(ROOT_B)
      const metrics = await nfa.getLearningMetrics(tokenId)
      expect(metrics.learningEvents).to.equal(2)
    })
  })

  // ═══════════════════════════════════════════════
  // VERIFY LEARNING (MERKLE PROOF)
  // ═══════════════════════════════════════════════

  describe("verifyLearning", () => {
    it("should_returnFalse_when_noLearningRoot", async () => {
      const { nfa, tokenId } = await loadFixture(activatedFixture)
      const result = await nfa.verifyLearning(tokenId, ethers.ZeroHash, [])
      expect(result).to.be.false
    })

    it("should_verifyValidProof_when_rootExists", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)

      // Build a simple Merkle tree: leaf = claim, sibling
      const claim = ethers.id("skill:trading")
      const sibling = ethers.id("skill:analysis")

      // Sort and hash to get root
      const sorted =
        claim <= sibling
          ? ethers.solidityPackedKeccak256(["bytes32", "bytes32"], [claim, sibling])
          : ethers.solidityPackedKeccak256(["bytes32", "bytes32"], [sibling, claim])

      await nfa.connect(trainer).updateLearning(tokenId, {
        previousRoot: ethers.ZeroHash,
        newRoot: sorted,
        proof: ethers.ZeroHash,
        metadata: ethers.ZeroHash,
      })

      const result = await nfa.verifyLearning(tokenId, claim, [sibling])
      expect(result).to.be.true
    })

    it("should_rejectInvalidProof_when_wrongSibling", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)

      const claim = ethers.id("skill:trading")
      const sibling = ethers.id("skill:analysis")
      const sorted =
        claim <= sibling
          ? ethers.solidityPackedKeccak256(["bytes32", "bytes32"], [claim, sibling])
          : ethers.solidityPackedKeccak256(["bytes32", "bytes32"], [sibling, claim])

      await nfa.connect(trainer).updateLearning(tokenId, {
        previousRoot: ethers.ZeroHash,
        newRoot: sorted,
        proof: ethers.ZeroHash,
        metadata: ethers.ZeroHash,
      })

      const wrongSibling = ethers.id("wrong")
      const result = await nfa.verifyLearning(tokenId, claim, [wrongSibling])
      expect(result).to.be.false
    })
  })

  // ═══════════════════════════════════════════════
  // RECORD INTERACTION
  // ═══════════════════════════════════════════════

  describe("recordInteraction", () => {
    it("should_incrementTotalInteractions_when_recorded", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).recordInteraction(tokenId, "trade", true)
      const metrics = await nfa.getLearningMetrics(tokenId)
      expect(metrics.totalInteractions).to.equal(1)
    })

    it("should_bumpConfidence_when_successfulInteraction", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).recordInteraction(tokenId, "trade", true)
      const metrics = await nfa.getLearningMetrics(tokenId)
      expect(metrics.confidenceScore).to.be.greaterThan(0)
    })

    it("should_notChangeConfidence_when_failedInteraction", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).recordInteraction(tokenId, "trade", false)
      const metrics = await nfa.getLearningMetrics(tokenId)
      expect(metrics.confidenceScore).to.equal(0)
    })

    it("should_emitInteractionRecorded_when_recorded", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await expect(
        nfa.connect(trainer).recordInteraction(tokenId, "analysis", true),
      )
        .to.emit(nfa, "InteractionRecorded")
        .withArgs(tokenId, "analysis", true)
    })

    it("should_revert_when_agentNotActive", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      await nfa.connect(trainer).pauseAgent(tokenId)
      await expect(
        nfa.connect(trainer).recordInteraction(tokenId, "trade", true),
      ).to.be.revertedWith("Not active")
    })

    it("should_revert_when_strangerRecords", async () => {
      const { nfa, stranger, tokenId } = await loadFixture(activatedFixture)
      await expect(
        nfa.connect(stranger).recordInteraction(tokenId, "trade", true),
      ).to.be.revertedWith("Not NFA owner")
    })

    it("should_capConfidenceAt10000_when_manySuccessfulInteractions", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      // Run many successful interactions to approach cap
      for (let i = 0; i < 50; i++) {
        await nfa.connect(trainer).recordInteraction(tokenId, "trade", true)
      }
      const metrics = await nfa.getLearningMetrics(tokenId)
      expect(metrics.confidenceScore).to.be.lte(10000)
    })
  })

  // ═══════════════════════════════════════════════
  // SOUL-BOUND
  // ═══════════════════════════════════════════════

  describe("soul-bound", () => {
    it("should_revert_when_transferFromCalled", async () => {
      const { nfa, trainer, stranger, tokenId } =
        await loadFixture(activatedFixture)
      await expect(
        nfa
          .connect(trainer)
          .transferFrom(trainer.address, stranger.address, tokenId),
      ).to.be.revertedWith("NFA is soul-bound")
    })

    it("should_revert_when_safeTransferFromCalled", async () => {
      const { nfa, trainer, stranger, tokenId } =
        await loadFixture(activatedFixture)
      await expect(
        nfa
          .connect(trainer)
          ["safeTransferFrom(address,address,uint256)"](
            trainer.address,
            stranger.address,
            tokenId,
          ),
      ).to.be.revertedWith("NFA is soul-bound")
    })
  })

  // ═══════════════════════════════════════════════
  // CONTRACT-LEVEL PAUSE
  // ═══════════════════════════════════════════════

  describe("contract pause", () => {
    it("should_pause_when_ownerCalls", async () => {
      const { nfa, owner } = await loadFixture(deployFixture)
      await nfa.connect(owner).pauseContract()
      expect(await nfa.paused()).to.be.true
    })

    it("should_unpause_when_ownerCalls", async () => {
      const { nfa, owner } = await loadFixture(deployFixture)
      await nfa.connect(owner).pauseContract()
      await nfa.connect(owner).unpauseContract()
      expect(await nfa.paused()).to.be.false
    })

    it("should_revert_when_nonOwnerPauses", async () => {
      const { nfa, stranger } = await loadFixture(deployFixture)
      await expect(
        nfa.connect(stranger).pauseContract(),
      ).to.be.revertedWithCustomError(nfa, "OwnableUnauthorizedAccount")
    })

    it("should_revert_when_nonOwnerUnpauses", async () => {
      const { nfa, owner, stranger } = await loadFixture(deployFixture)
      await nfa.connect(owner).pauseContract()
      await expect(
        nfa.connect(stranger).unpauseContract(),
      ).to.be.revertedWithCustomError(nfa, "OwnableUnauthorizedAccount")
    })
  })

  // ═══════════════════════════════════════════════
  // VIEW FUNCTIONS
  // ═══════════════════════════════════════════════

  describe("view functions", () => {
    it("should_returnState_when_getStateCalled", async () => {
      const { nfa, trainer, tokenId } = await loadFixture(activatedFixture)
      const state = await nfa.getState(tokenId)
      expect(state.owner).to.equal(trainer.address)
      expect(state.status).to.equal(0) // Active
      expect(state.balance).to.equal(0)
      expect(state.logicAddress).to.equal(ethers.ZeroAddress)
    })

    it("should_returnNonZeroDomainSeparator_when_called", async () => {
      const { nfa } = await loadFixture(deployFixture)
      expect(await nfa.getDomainSeparator()).to.not.equal(ethers.ZeroHash)
    })

    it("should_revert_when_getStateForNonexistentToken", async () => {
      const { nfa } = await loadFixture(deployFixture)
      await expect(nfa.getState(999)).to.be.revertedWithCustomError(
        nfa,
        "ERC721NonexistentToken",
      )
    })

    it("should_revert_when_getMetadataForNonexistentToken", async () => {
      const { nfa } = await loadFixture(deployFixture)
      await expect(nfa.getAgentMetadata(999)).to.be.revertedWithCustomError(
        nfa,
        "ERC721NonexistentToken",
      )
    })

    it("should_revert_when_getLearningMetricsForNonexistentToken", async () => {
      const { nfa } = await loadFixture(deployFixture)
      await expect(
        nfa.getLearningMetrics(999),
      ).to.be.revertedWithCustomError(nfa, "ERC721NonexistentToken")
    })
  })
})
