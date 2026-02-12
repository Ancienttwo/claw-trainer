// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ILearningModule - BAP-578 optional learning extension
/// @notice Merkle Tree verified on-chain learning for agents
interface ILearningModule {
    struct LearningMetrics {
        uint256 totalInteractions;
        uint256 learningEvents;
        uint256 lastUpdateTimestamp;
        uint256 learningVelocity;
        uint256 confidenceScore; // basis points (0-10000)
    }

    struct LearningUpdate {
        bytes32 previousRoot;
        bytes32 newRoot;
        bytes32 proof;
        bytes32 metadata;
    }

    event LearningUpdated(uint256 indexed tokenId, bytes32 newRoot);
    event InteractionRecorded(uint256 indexed tokenId, string interactionType, bool success);

    function updateLearning(uint256 tokenId, LearningUpdate calldata update) external;
    function verifyLearning(uint256 tokenId, bytes32 claim, bytes32[] calldata proof) external view returns (bool);
    function getLearningMetrics(uint256 tokenId) external view returns (LearningMetrics memory);
    function getLearningRoot(uint256 tokenId) external view returns (bytes32);
    function isLearningEnabled(uint256 tokenId) external view returns (bool);
    function recordInteraction(uint256 tokenId, string calldata interactionType, bool success) external;
}
