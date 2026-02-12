// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title IBAP578 - Non-Fungible Agent lifecycle interface
/// @notice BAP-578 standard for BNB Chain agent lifecycle management
interface IBAP578 {
    enum Status { Active, Paused, Terminated }

    struct State {
        uint256 balance;
        Status status;
        address owner;
        address logicAddress;
        uint256 lastActionTimestamp;
    }

    struct AgentMetadata {
        string persona;
        string experience;
        string voiceHash;
        string animationURI;
        string vaultURI;
        bytes32 vaultHash;
    }

    event StatusChanged(uint256 indexed tokenId, Status newStatus);
    event MetadataUpdated(uint256 indexed tokenId);
    event AgentFunded(uint256 indexed tokenId, uint256 amount);
    event ActionExecuted(uint256 indexed tokenId, address logicAddress);
    event LogicAddressChanged(uint256 indexed tokenId, address newLogic);

    function executeAction(uint256 tokenId, bytes calldata data) external;
    function setLogicAddress(uint256 tokenId, address newLogic) external;
    function fundAgent(uint256 tokenId) external payable;
    function getState(uint256 tokenId) external view returns (State memory);
    function getAgentMetadata(uint256 tokenId) external view returns (AgentMetadata memory);
    function updateAgentMetadata(uint256 tokenId, AgentMetadata memory metadata) external;
    function pauseAgent(uint256 tokenId) external;
    function unpauseAgent(uint256 tokenId) external;
    function terminate(uint256 tokenId) external;
}
