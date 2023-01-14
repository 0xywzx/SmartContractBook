// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@chainlink/contracts/src/v0.7/interfaces/AggregatorInterface.sol";

interface AggregatorInterface {
	function latestAnswer() external view returns (int256);・・・①
}

contract PriceConsumer {
    AggregatorInterface internal priceFeed;・・・②

    constructor() {
        priceFeed = AggregatorInterface(
            "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
        );・・・③
    }

    function getOraclePrice() public view returns (uint256) {
        return priceFeed.latestAnswer();・・・④
    }
}