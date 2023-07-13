// SPDX-License-Identifier: GPL-2.0-or-later
// @tittle Smart Contract book NFT contract

// ┏━━━┓━━━━━━━━━━━━━┏┓━┏━━━┓━━━━━━━━━┏┓━━━━━━━━━━━━━━┏┓━
// ┃┏━┓┃━━━━━━━━━━━━┏┛┗┓┃┏━┓┃━━━━━━━━┏┛┗┓━━━━━━━━━━━━┏┛┗┓
// ┃┗━━┓┏┓┏┓┏━━┓━┏━┓┗┓┏┛┃┃━┗┛┏━━┓┏━┓━┗┓┏┛┏━┓┏━━┓━┏━━┓┗┓┏┛
// ┗━━┓┃┃┗┛┃┗━┓┃━┃┏┛━┃┃━┃┃━┏┓┃┏┓┃┃┏┓┓━┃┃━┃┏┛┗━┓┃━┃┏━┛━┃┃━
// ┃┗━┛┃┃┃┃┃┃┗┛┗┓┃┃━━┃┗┓┃┗━┛┃┃┗┛┃┃┃┃┃━┃┗┓┃┃━┃┗┛┗┓┃┗━┓━┃┗┓
// ┗━━━┛┗┻┻┛┗━━━┛┗┛━━┗━┛┗━━━┛┗━━┛┗┛┗┛━┗━┛┗┛━┗━━━┛┗━━┛━┗━┛
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "base64-sol/base64.sol";

import './libraries/NFTSVG.sol';

contract SmartContractBook is ERC721, ERC721Enumerable, AccessControl, Pausable {

    // @dev counter for token id
    using Counters for Counters.Counter;

    constructor(
        address _operator
    )
        ERC721("SmartContractBook", "SCB")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        // mint for operation test
        uint256 tokenId = MAX_SUPPLY;
        _metadata[tokenId] = Metadata({
            random: 49 * block.timestamp * MAX_SUPPLY
        });
        _safeMint(_operator, tokenId);
    }

    /*************
     * Constants *
     *************/
    uint256 public constant MAX_SUPPLY = 1200;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string public constant nftName = "Smart Contract Book";
    string public constant description = "Smart Contract Book NFT";

    /*************
     * Variables *
     *************/
    Counters.Counter private _tokenIdCounter;
    bool public isTransferAllowed = false;

    mapping (uint256 => Metadata) private _metadata;

    /**********
     * struct *
     **********/
    struct Metadata {
        uint256 random;
    }

    /*************************
     * Public View Functions *
     *************************/
    function tokenURI(uint256 _tokenId) public view override(ERC721) returns (string memory) {

        Metadata memory metadata = _metadata[_tokenId];
        string memory image = Base64.encode(bytes(NFTSVG.generateSVG(
            _tokenId,
            ownerOf(_tokenId),
            metadata.random
        )));
        string memory traitType = NFTSVG.isRare(metadata.random) ? "rare" : "common";

        return
            string(
                abi.encodePacked(
                    'data:application/json;base64,',
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"', nftName,
                                '", "description":"', description,
                                '", "image":"', 'data:image/svg+xml;base64,', image,
                                '", "attributes": [{"trait_type": "Type",  "value": "', traitType,
                                '"}]}'
                            )
                        )
                    )
                )
            );

    }

    function getMetadata(uint256 _tokenId) public view returns (Metadata memory) {
        return _metadata[_tokenId];
    }

    /*************************
     * MINTER_ROLE Functions *
     *************************/
    function safeMint(address to)
        public
        onlyRole(MINTER_ROLE)
    {
        // start from 1
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < MAX_SUPPLY, "Max supply reached");

        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    tokenId,
                    _metadata[tokenId - 1].random,
                    blockhash(block.number - 1),
                    block.timestamp
                )
            )
        );

        _metadata[tokenId] = Metadata({
            random: randomNumber
        });

        _safeMint(to, tokenId);
    }

    function batchMint(address[] memory to) external onlyRole(MINTER_ROLE) {
        for(uint8 i = 0; i < to.length; i ++) {
            safeMint(to[i]);
        }
    }

    /********************************
     * DEFAULT_ADMIN_ROLE Functions *
     ********************************/
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function allowTransfers() external onlyRole(DEFAULT_ADMIN_ROLE) {
        // Allow transfers
        isTransferAllowed = true;
    }

    /*********************
     * Internal Function *
     *********************/
    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        if(from != address(0)) {
            require(isTransferAllowed, "Transfers not allowed yet");
        }

        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
