pragma solidity ^0.8.9;

import './HexStrings.sol';

// https://github.com/Uniswap/v3-periphery/blob/b771ff9a20a0fd7c3233df0eb70d4fa084766cde/contracts/libraries/NFTSVG.sol
library NFTSVG {

    using HexStrings for uint256;

    function generateSVG(address owner, uint256 randomNumber) internal pure returns (string memory svg) {

        string memory color0 = tokenToColorHex(uint256(uint160(owner)), 0);
        string memory color1 = tokenToColorHex(randomNumber, 136);

        return
            string(
                abi.encodePacked(
                    '<svg viewBox="0 0 100 100" width="600" height="600" fill="none" role="img" xmlns="http://www.w3.org/2000/svg"',
                    " xmlns:xlink='http://www.w3.org/1999/xlink'>",
                    //
                    '<defs> <path id="text-path-a" d="M6 3 H95 A28 28 0 0 1 97 6 V95 A28 28 0 0 1 95 97 H5 A28 28 0 0 1 3 93 V5 A28 28 0 0 1 6 3 z" />',
                    '<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#',
                    color0,
                    ';stop-opacity:1" /><stop offset="100%" style="stop-color:#',
                    color1,
                    ';stop-opacity:1" /></linearGradient>',
                    '</defs>',
                    '<rect width="100%" height="100%" rx="12" fill="url(#gradient)" />',
                    // border
                    '<rect width="90" height="90" x="5" y="5" rx="10" stroke-width="0.5" stroke="black" />',
                    // title
                    '<text text-anchor="middle" x="50" y="30" fill="black" font-size="6" font-weight="bold">',
                    "Smart Contract", // variable
                    '</text>',
                    // icon
                    '<path d="M 40 60 L 60 60 L 55 70 L 45 70 Z" fill="#000000"/><path d="M 65 55 L 35 55 L 40 45 L 60 45 Z" fill="#000000"/>',
                    // rounding
                    '<text text-rendering="optimizeSpeed">',
                    '<textPath startOffset="-100%" fill="black" font-family="\'Courier New\', monospace" font-size="5px" xlink:href="#text-path-a">',
                    "Smart Contract", // variable
                    '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="8s" repeatCount="indefinite" /></textPath>',
                    '<textPath startOffset="0%" fill="black" font-family="\'Courier New\', monospace" font-size="5px" xlink:href="#text-path-a">'
                    "Smart Contract", //
                    '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="8s" repeatCount="indefinite" /> </textPath>',
                    '<textPath startOffset="50%" fill="black" font-family="\'Courier New\', monospace" font-size="5px" xlink:href="#text-path-a">',
                    "Smart Contract",
                    '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="8s" repeatCount="indefinite" /> </textPath>',
                    '<textPath startOffset="-50%" fill="black" font-family="\'Courier New\', monospace" font-size="5px" xlink:href="#text-path-a">',
                    "Smart Contract",
                    '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="8s" repeatCount="indefinite" /></textPath></text>',
                    '</svg>'
                )
            );
    }

    // https://github.com/Uniswap/v3-periphery/blob/6cce88e63e176af1ddb6cc56e029110289622317/contracts/libraries/NFTDescriptor.sol#L462-L464C1
    function tokenToColorHex(uint256 token, uint256 offset) public pure returns (string memory str) {
        return string((token >> offset).toHexStringNoPrefix(3));
    }
}