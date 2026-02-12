// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title MockIdentityRegistry - Test mock for ERC-8004 IdentityRegistry
/// @dev Provides ownerOf (ERC-721) + getAgentWallet for ClawTrainerNFA tests
contract MockIdentityRegistry is ERC721 {
    uint256 private _nextId;
    mapping(uint256 => address) private _agentWallets;

    constructor() ERC721("Mock ERC-8004", "M8004") {}

    function register(address to) external returns (uint256) {
        uint256 id = _nextId++;
        _mint(to, id);
        return id;
    }

    function setMockAgentWallet(uint256 agentId, address wallet) external {
        _agentWallets[agentId] = wallet;
    }

    function getAgentWallet(uint256 agentId) external view returns (address) {
        return _agentWallets[agentId];
    }
}
