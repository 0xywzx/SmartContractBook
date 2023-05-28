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

import { VRFV2WrapperConsumerBase, LinkTokenInterface } from "./chainlink/vrf/VRFV2WrapperConsumerBase.sol";

contract SCBook is ERC721, ERC721Enumerable, AccessControl, VRFV2WrapperConsumerBase {

    // @dev counter for token id
    using Counters for Counters.Counter;

    // https://docs.chain.link/vrf/v2/direct-funding/supported-networks
    constructor(address _linkAddress, address _wrapperAddress)
        ERC721("SCBook", "SCB")
        VRFV2WrapperConsumerBase(_linkAddress, _wrapperAddress)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        uint256 admins = 2;
        uint256 max = type(uint256).max - 1;
        for(uint256 i = 0; i < admins; i ++) {
            uint256 tokenId = max - i;
            _metadata[tokenId] = Metadata({
                owner: msg.sender,
                random: 49 * block.timestamp * i
            });

            _safeMint(msg.sender, tokenId);
        }

        linkAddress = _linkAddress;
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
    Counters.Counter private _utilizedTokenIdCounter;

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
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
    }

    function batchMint(address[] memory to) public onlyRole(MINTER_ROLE) {
        for(uint8 i = 0; i < to.length; i ++) {
            safeMint(to[i]);
        }
    }

    function setMetadata() public onlyRole(MINTER_ROLE) {
        require(
            _tokenIdCounter.current() - _utilizedTokenIdCounter.current() > 0,
            "all metadata already set"
        );
        require(lastRequestId != 0, "requestId is not set");

        // chainlink VRFで得た乱数をここに置き換えることが可能
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    s_requests[lastRequestId].randomWords[0],
                    blockhash(block.number),
                    block.timestamp
                )
            )
        );

        uint8 _length =
            uint8(_tokenIdCounter.current() - _utilizedTokenIdCounter.current());

        for(uint8 i = 0; i < _length; i ++) {

            uint256 _random = randomNumber++;

            _metadata[_utilizedTokenIdCounter.current()] = Metadata({
                owner: _ownerOf(_utilizedTokenIdCounter.current()),
                random: _random
            });

            _utilizedTokenIdCounter.increment();
        }
        delete lastRequestId;
        delete s_requests[lastRequestId];
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
        // If you want to make untransferable NFT, uncomment this line
        // require(from == address(0), "Unable to transfer");
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

    /*********************
     * VRF Configuration *
     *********************/

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );

    struct RequestStatus {
        uint256 paid; // amount paid in link
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256[] randomWords;
    }

    mapping(uint256 => RequestStatus) public s_requests; /* requestId --> requestStatus */

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFV2Wrapper.getConfig().maxNumWords.
    uint32 numWords = 2;

    // LINK Token Address
    address private linkAddress;

    /*****************
     * VRF Functions *
     *****************/
    //https://docs.chain.link/vrf/v2/direct-funding/examples/get-a-random-number

    function requestRandomWords()
        external
        onlyRole(MINTER_ROLE)
        returns (uint256 requestId)
    {
        require(lastRequestId == 0, "request already sent");

        requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            randomWords: new uint256[](0),
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].paid > 0, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(
            _requestId,
            _randomWords,
            s_requests[_requestId].paid
        );
    }

    function getRequestStatus(
        uint256 _requestId
    )
        external
        view
        returns (uint256 paid, bool fulfilled, uint256[] memory randomWords)
    {
        require(s_requests[_requestId].paid > 0, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.paid, request.fulfilled, request.randomWords);
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyRole(MINTER_ROLE) {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
