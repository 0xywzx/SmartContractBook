// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import './HexStrings.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

// https://github.com/Uniswap/v3-periphery/blob/b771ff9a20a0fd7c3233df0eb70d4fa084766cde/contracts/libraries/NFTSVG.sol
library NFTSVG {

    using HexStrings for uint256;

    function generateSVG(uint256 tokenId, address owner, uint256 randomNumber) internal pure returns (string memory svg) {

        string memory color0 = tokenToColorHex(tokenId + uint256(uint160(owner)), 0);
        string memory color1 = tokenToColorHex(tokenId + randomNumber, 136);

        string memory idString = Strings.toString(tokenId);
        string memory ownerAddressString = addressToShortString(owner);

        return
            string(
                abi.encodePacked(
                    '<svg viewBox="0 0 100 100" width="600" height="600" fill="none" role="img" xmlns="http://www.w3.org/2000/svg"',
                    " xmlns:xlink='http://www.w3.org/1999/xlink'>",
                    //
                    '<defs> <path id="text-path-a" d="M9 4 H91 A40 40 0 0 1 96 10 V91 A40 40 0 0 1 91 96 H10 A40 40 0 0 1 4 91 V9 A40 40 0 0 1 9 4 z" />',
                    // gradient
                    '<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#',
                    color0,
                    ';stop-opacity:1" /><stop offset="100%" style="stop-color:#',
                    color1,
                    ';stop-opacity:1" /></linearGradient>',
                    '</defs>',
                    '<rect width="100%" height="100%" rx="12" fill="url(#gradient)" />',
                    // border
                    '<rect width="90" height="90" x="5" y="5" rx="10" stroke-width="0.5" stroke="white" />',
                    // title
                    '<text text-anchor="middle" x="50" y="30" fill="white" font-size="6" font-weight="bold">',
                    "Smart Contract", // variable
                    '</text>',
                    // icon
                    '<path d="M 40 60 L 60 60 L 55 70 L 45 70 Z" fill="#ffffff"/><path d="M 65 55 L 35 55 L 40 45 L 60 45 Z" fill="#ffffff"/>',
                    // rare
                    generateSVGRare(randomNumber),
                    // rounding
                    '<text text-rendering="optimizeSpeed">',
                    '<textPath startOffset="-100%" fill="white" font-family="\'Courier New\', monospace" font-size="5px" xlink:href="#text-path-a">',
                    'token id : ',
                    idString,
                    '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="8s" repeatCount="indefinite" /></textPath>',
                    '<textPath startOffset="0%" fill="white" font-family="\'Courier New\', monospace" font-size="5px" xlink:href="#text-path-a">'
                    'ID ',
                    idString,
                    '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="8s" repeatCount="indefinite" /> </textPath>',
                    '<textPath startOffset="50%" fill="white" font-family="\'Courier New\', monospace" font-size="5px" xlink:href="#text-path-a">',
                    ownerAddressString,
                    '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="8s" repeatCount="indefinite" /> </textPath>',
                    '<textPath startOffset="-50%" fill="white" font-family="\'Courier New\', monospace" font-size="5px" xlink:href="#text-path-a">',
                    ownerAddressString,
                    '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="8s" repeatCount="indefinite" /></textPath></text>',
                    '</svg>'
                )
            );
    }

    // https://github.com/Uniswap/v3-periphery/blob/6cce88e63e176af1ddb6cc56e029110289622317/contracts/libraries/NFTDescriptor.sol#L462-L464C1
    function tokenToColorHex(uint256 token, uint256 offset) public pure returns (string memory str) {
        return string((token >> offset).toHexStringNoPrefix(3));
    }

    function generateSVGRare(uint256 random) private pure returns (string memory svg) {
        if (isRare(random)) {
            svg = string(
                abi.encodePacked(
                    '<g fill="none" stroke="white" stroke-width="0.5">',
                    '<polygon points="70,76 72,80 70,84 68,80"><animateTransform attributeName="transform" type="rotate" from="0 70 80" to="360 70 80" dur="2s" repeatCount="indefinite" /></polygon>',
                    '<polygon points="70,74 72,80 70,86 68,80"><animateTransform attributeName="transform" type="rotate" from="0 70 80" to="360 70 80" dur="3s" repeatCount="indefinite" /></polygon>',
                    '<polygon points="70,72 72,80 70,88 68,80"><animateTransform attributeName="transform" type="rotate" from="0 70 80" to="360 70 80" dur="4s" repeatCount="indefinite" /></polygon>',
                    '</g>'
                )
            );
        } else {
            svg = '';
        }
    }

    function isRare(uint256 random) internal pure returns (bool) {
        return (random % 49) == 0;
    }

    function addressToShortString(address _addr) public pure returns(string memory) {
        string memory addr = (uint256(uint160(_addr))).toHexString(20);
        string memory prefix = substring(addr, 0, 8);
        string memory suffix = substring(addr, 34, 42);
        return string(abi.encodePacked(prefix, '...', suffix));
    }

    function substring(string memory str, uint startIndex, uint endIndex) public pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            result[i-startIndex] = strBytes[i];
        }
        return string(result);
    }

}