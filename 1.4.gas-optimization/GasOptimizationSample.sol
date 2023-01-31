// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Number {
  struct Numbers {
    uint128 a -- slot 1
    uint256 b -- slot 2
    uint128 c -- slot 3
  }
}

contract OptimisedNumber {
  struct OptimisedNumbers {
    uint128 a -- slot 1
    uint128 c -- slot 1
    uint256 b -- slot 2
  }
}