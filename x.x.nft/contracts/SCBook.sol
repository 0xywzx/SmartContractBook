// SPDX-License-Identifier: MIT
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
import "@openzeppelin/contracts/utils/Counters.sol";

import "base64-sol/base64.sol";

import './libraries/NFTSVG.sol';

contract SCBook is ERC721, ERC721Enumerable, AccessControl {

    // @dev counter for token id
    using Counters for Counters.Counter;

    constructor() ERC721("SCBook", "SCB") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /*************
     * Constants *
     *************/

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string public constant nftName = "Smart Contract Book";
    string public constant description = "Smart Contract Book NFT";

    /*************
     * Variables *
     *************/
    Counters.Counter private _tokenIdCounter;

    // @notice Token metadata with Metadata struct
    mapping (uint256 => Metadata) private _metadata;

    /**********
     * struct *
     **********/

    // @struct NFT metadata format
    struct Metadata {
        address owner;
        uint256 random;
    }

    /*************************
     * Public View Functions *
     *************************/

    // @notice Return tokenURI with url format if _urlMetadata is existed
    // Return tokenURL with encoded JSON format if _urlMetadata is not existed
    function tokenURI(uint256 _tokenId) public view override(ERC721) returns (string memory) {

        Metadata memory metadata = _metadata[_tokenId];
        string memory image = Base64.encode(bytes(NFTSVG.generateSVG(
            metadata.owner,
            metadata.random
        )));

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
                                '", "attributes": [{"trait_type": "Type",  "value": "', "common",
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
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    tokenId,
                    blockhash(block.number),
                    block.timestamp,
                    to
                )
            )
        );

        _metadata[tokenId] = Metadata({
            owner: to,
            random: randomNumber
        });

        _safeMint(to, tokenId);
    }

    function batchMint(address[] memory to) public onlyRole(MINTER_ROLE) {
        for(uint8 i = 0; i < to.length; i ++) {
            safeMint(to[i]);
        }
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    /**********
     * Utils *
     **********/

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        require(from == address(0), "Unable to transfer");
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
