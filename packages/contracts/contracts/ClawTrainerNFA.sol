// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/IBAP578.sol";
import "./interfaces/ILearningModule.sol";

/// @title ClawTrainerNFA - BAP-578 compliant Non-Fungible Agent
/// @notice Links to official ERC-8004 IdentityRegistry + adds BAP-578 lifecycle + learning
/// @dev Soul-bound ERC-721 with state machine, metadata, and Merkle Tree learning
contract ClawTrainerNFA is ERC721, ERC721URIStorage, IBAP578, ILearningModule, Ownable, Pausable, EIP712 {
    bytes32 public constant ACTIVATE_TYPEHASH =
        keccak256("ActivateAgent(uint256 erc8004AgentId,address trainer)");

    address public immutable erc8004Registry;
    uint256 private _nextTokenId;

    mapping(uint256 => uint256) public erc8004AgentId;
    mapping(uint256 => State) private _states;
    mapping(uint256 => AgentMetadata) private _agentMetadata;
    mapping(uint256 => bytes32) private _learningRoots;
    mapping(uint256 => LearningMetrics) private _learningMetrics;
    mapping(uint256 => address) public agentWallets;
    mapping(uint256 => bool) private _learningEnabled;
    mapping(uint256 => bool) public erc8004IdUsed;

    event NFAActivated(uint256 indexed tokenId, uint256 indexed erc8004AgentId, address indexed owner);

    constructor(address _erc8004Registry)
        ERC721("ClawTrainer NFA", "CNFA")
        Ownable(msg.sender)
        EIP712("ClawTrainerNFA", "1")
    {
        require(_erc8004Registry != address(0), "Zero registry");
        erc8004Registry = _erc8004Registry;
    }

    // ═══════════════════════════════════════════════
    // ACTIVATION
    // ═══════════════════════════════════════════════

    /// @notice Activate a BAP-578 NFA linked to an ERC-8004 agent identity
    /// @param _erc8004AgentId The agent's ID in the official ERC-8004 IdentityRegistry
    /// @param meta BAP-578 agent metadata (persona, experience, etc.)
    /// @param agentSig EIP-712 signature from the agent wallet
    function activate(
        uint256 _erc8004AgentId,
        AgentMetadata calldata meta,
        bytes calldata agentSig
    ) external whenNotPaused returns (uint256) {
        require(
            IERC721(erc8004Registry).ownerOf(_erc8004AgentId) == msg.sender,
            "Not ERC-8004 owner"
        );
        require(!erc8004IdUsed[_erc8004AgentId], "Already activated");

        address wallet = _getAgentWallet(_erc8004AgentId);
        require(wallet != address(0), "No agent wallet in ERC-8004");

        bytes32 structHash = keccak256(
            abi.encode(ACTIVATE_TYPEHASH, _erc8004AgentId, msg.sender)
        );
        require(
            ECDSA.recover(_hashTypedDataV4(structHash), agentSig) == wallet,
            "Invalid agent signature"
        );

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        erc8004AgentId[tokenId] = _erc8004AgentId;
        erc8004IdUsed[_erc8004AgentId] = true;
        agentWallets[tokenId] = wallet;

        _states[tokenId] = State({
            balance: 0,
            status: Status.Active,
            owner: msg.sender,
            logicAddress: address(0),
            lastActionTimestamp: block.timestamp
        });

        _agentMetadata[tokenId] = meta;
        _learningEnabled[tokenId] = true;

        emit NFAActivated(tokenId, _erc8004AgentId, msg.sender);
        emit StatusChanged(tokenId, Status.Active);

        return tokenId;
    }

    // ═══════════════════════════════════════════════
    // BAP-578: STATE MANAGEMENT
    // ═══════════════════════════════════════════════

    function pauseAgent(uint256 tokenId) external {
        _requireTokenOwner(tokenId);
        require(_states[tokenId].status == Status.Active, "Not active");
        _states[tokenId].status = Status.Paused;
        emit StatusChanged(tokenId, Status.Paused);
    }

    function unpauseAgent(uint256 tokenId) external {
        _requireTokenOwner(tokenId);
        require(_states[tokenId].status == Status.Paused, "Not paused");
        _states[tokenId].status = Status.Active;
        emit StatusChanged(tokenId, Status.Active);
    }

    function terminate(uint256 tokenId) external {
        _requireTokenOwner(tokenId);
        require(_states[tokenId].status != Status.Terminated, "Already terminated");
        _states[tokenId].status = Status.Terminated;
        emit StatusChanged(tokenId, Status.Terminated);
    }

    // ═══════════════════════════════════════════════
    // BAP-578: EXECUTION + FUNDING
    // ═══════════════════════════════════════════════

    function executeAction(uint256 tokenId, bytes calldata data) external {
        _requireTokenOwner(tokenId);
        require(_states[tokenId].status == Status.Active, "Not active");

        address logic = _states[tokenId].logicAddress;
        require(logic != address(0), "No logic contract");

        (bool ok,) = logic.call(data);
        require(ok, "Action failed");

        _states[tokenId].lastActionTimestamp = block.timestamp;
        emit ActionExecuted(tokenId, logic);
    }

    function setLogicAddress(uint256 tokenId, address newLogic) external {
        _requireTokenOwner(tokenId);
        _states[tokenId].logicAddress = newLogic;
        emit LogicAddressChanged(tokenId, newLogic);
    }

    function fundAgent(uint256 tokenId) external payable {
        _requireOwned(tokenId);
        require(msg.value > 0, "Zero funding");
        _states[tokenId].balance += msg.value;
        emit AgentFunded(tokenId, msg.value);
    }

    function withdrawAgentFunds(uint256 tokenId, uint256 amount) external {
        _requireTokenOwner(tokenId);
        require(_states[tokenId].balance >= amount, "Insufficient balance");
        _states[tokenId].balance -= amount;
        (bool ok,) = msg.sender.call{value: amount}("");
        require(ok, "Transfer failed");
    }

    // ═══════════════════════════════════════════════
    // BAP-578: METADATA
    // ═══════════════════════════════════════════════

    function getState(uint256 tokenId) external view returns (State memory) {
        _requireOwned(tokenId);
        return _states[tokenId];
    }

    function getAgentMetadata(uint256 tokenId) external view returns (AgentMetadata memory) {
        _requireOwned(tokenId);
        return _agentMetadata[tokenId];
    }

    function updateAgentMetadata(uint256 tokenId, AgentMetadata memory metadata) external {
        _requireTokenOwner(tokenId);
        require(_states[tokenId].status != Status.Terminated, "Terminated");
        _agentMetadata[tokenId] = metadata;
        emit MetadataUpdated(tokenId);
    }

    // ═══════════════════════════════════════════════
    // LEARNING MODULE
    // ═══════════════════════════════════════════════

    function updateLearning(uint256 tokenId, LearningUpdate calldata update) external {
        _requireTokenOwner(tokenId);
        require(_learningEnabled[tokenId], "Learning disabled");
        require(_states[tokenId].status == Status.Active, "Not active");
        require(update.previousRoot == _learningRoots[tokenId], "Root mismatch");

        _learningRoots[tokenId] = update.newRoot;
        _learningMetrics[tokenId].learningEvents++;
        _learningMetrics[tokenId].lastUpdateTimestamp = block.timestamp;

        emit LearningUpdated(tokenId, update.newRoot);
    }

    function verifyLearning(
        uint256 tokenId,
        bytes32 claim,
        bytes32[] calldata proof
    ) external view returns (bool) {
        _requireOwned(tokenId);
        bytes32 root = _learningRoots[tokenId];
        if (root == bytes32(0)) return false;

        bytes32 hash = claim;
        for (uint256 i = 0; i < proof.length; i++) {
            hash = hash <= proof[i]
                ? keccak256(abi.encodePacked(hash, proof[i]))
                : keccak256(abi.encodePacked(proof[i], hash));
        }
        return hash == root;
    }

    function getLearningMetrics(uint256 tokenId) external view returns (LearningMetrics memory) {
        _requireOwned(tokenId);
        return _learningMetrics[tokenId];
    }

    function getLearningRoot(uint256 tokenId) external view returns (bytes32) {
        _requireOwned(tokenId);
        return _learningRoots[tokenId];
    }

    function isLearningEnabled(uint256 tokenId) external view returns (bool) {
        _requireOwned(tokenId);
        return _learningEnabled[tokenId];
    }

    function recordInteraction(
        uint256 tokenId,
        string calldata interactionType,
        bool success
    ) external {
        _requireTokenOwner(tokenId);
        require(_states[tokenId].status == Status.Active, "Not active");

        LearningMetrics storage m = _learningMetrics[tokenId];
        m.totalInteractions++;
        m.lastUpdateTimestamp = block.timestamp;

        if (success && m.confidenceScore < 10000) {
            uint256 bump = 10000 / (m.totalInteractions + 10);
            if (bump < 1) bump = 1;
            m.confidenceScore = m.confidenceScore + bump > 10000
                ? 10000
                : m.confidenceScore + bump;
        }

        emit InteractionRecorded(tokenId, interactionType, success);
    }

    // ═══════════════════════════════════════════════
    // SOUL-BOUND + OVERRIDES
    // ═══════════════════════════════════════════════

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("NFA is soul-bound");
        }
        return super._update(to, tokenId, auth);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function pauseContract() external onlyOwner { _pause(); }
    function unpauseContract() external onlyOwner { _unpause(); }

    function getDomainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    // ═══════════════════════════════════════════════
    // INTERNAL
    // ═══════════════════════════════════════════════

    function _requireTokenOwner(uint256 tokenId) internal view {
        _requireOwned(tokenId);
        require(ownerOf(tokenId) == msg.sender, "Not NFA owner");
    }

    function _getAgentWallet(uint256 agentId) internal view returns (address) {
        (bool ok, bytes memory data) = erc8004Registry.staticcall(
            abi.encodeWithSignature("getAgentWallet(uint256)", agentId)
        );
        if (!ok || data.length < 32) return address(0);
        return abi.decode(data, (address));
    }
}
