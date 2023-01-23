// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Vault {

    address public approver1;
    address public approver2;
    mapping(address => bool) public approvals;

    constructor(address _approver1, address _approver2) payable {
        approver1 = _approver1;
        approver2 = _approver2;
    }

    function approve() public {
        require(msg.sender == approver1 || msg.sender == approver2, "Invalid approver");
        approvals[msg.sender] = true;
    }

    function withdraw(uint amount) public {
        require(approvals[approver1] && approvals[approver2], "No sufficient approvals");
        payable(msg.sender).transfer(amount);
    }

    receive() external payable {}
}
