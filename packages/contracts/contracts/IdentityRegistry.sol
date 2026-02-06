// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @title IdentityRegistry - ERC-8004 NFA (Non-Fungible Agent) Registry
/// @notice Manages agent identity NFTs on BNB Chain
/// @dev Based on ERC-8004 Identity standard for ClawTrainer.ai
contract IdentityRegistry is ERC721, ERC721URIStorage, Ownable, Pausable, EIP712 {
    bytes32 public constant MINT_TYPEHASH = keccak256(
        "MintAgent(string agentName,address trainer,address agentWallet,string uri)"
    );

    mapping(uint256 => address) public agentWallets;
    mapping(uint256 => uint8) public agentLevels;
    mapping(uint256 => bool) public agentExists;
    mapping(address => uint256) public walletToToken;
    mapping(address => bool) public walletBound;

    event NFAMinted(
        uint256 indexed tokenId,
        address indexed owner,
        address indexed agentWallet,
        string tokenURI
    );

    event AgentLevelUp(uint256 indexed tokenId, uint8 newLevel);

    constructor()
        ERC721("ClawTrainer NFA", "NFA")
        Ownable(msg.sender)
        EIP712("ClawTrainer", "1")
    {}

    /// @notice Compute deterministic agent ID from name and owner
    function computeAgentId(
        string memory name,
        address owner
    ) public pure returns (uint256) {
        return uint256(keccak256(abi.encode(name, owner)));
    }

    /// @notice Mint a new NFA (Non-Fungible Agent) with agent signature verification
    function mint(
        string memory agentName,
        address agentWallet,
        string memory uri,
        bytes memory agentSignature
    ) external whenNotPaused returns (uint256) {
        require(agentWallet != address(0), "Zero address wallet");
        require(!walletBound[agentWallet], "Wallet already bound");

        uint256 tokenId = computeAgentId(agentName, msg.sender);
        require(!agentExists[tokenId], "Agent already exists");

        bytes32 structHash = keccak256(abi.encode(
            MINT_TYPEHASH,
            keccak256(bytes(agentName)),
            msg.sender,
            agentWallet,
            keccak256(bytes(uri))
        ));
        address signer = ECDSA.recover(_hashTypedDataV4(structHash), agentSignature);
        require(signer == agentWallet, "Invalid agent signature");

        agentExists[tokenId] = true;
        walletBound[agentWallet] = true;
        walletToToken[agentWallet] = tokenId;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        agentWallets[tokenId] = agentWallet;
        agentLevels[tokenId] = 1;

        emit NFAMinted(tokenId, msg.sender, agentWallet, uri);
        return tokenId;
    }

    /// @notice Level up an agent (only owner of the NFA)
    function levelUp(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not NFA owner");
        require(agentLevels[tokenId] < 255, "Max level reached");
        agentLevels[tokenId]++;
        emit AgentLevelUp(tokenId, agentLevels[tokenId]);
    }

    /// @notice Get agent wallet for a given NFA
    function getAgentWallet(
        uint256 tokenId
    ) external view returns (address) {
        return agentWallets[tokenId];
    }

    /// @notice Get EIP-712 domain separator for frontend integration
    function getDomainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        address wallet = agentWallets[tokenId];
        
        // Cleanup state
        walletBound[wallet] = false;
        delete walletToToken[wallet];
        // agentExists remains true to prevent re-minting same ID (history preservation)
        
        _burn(tokenId);
    }

    /// @notice Soul-bound: NFA tokens cannot be transferred after minting
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
}
