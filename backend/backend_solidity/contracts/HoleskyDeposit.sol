// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HoleskyDeposit {
    address public owner;
    string public name;
    uint256 public constant THRESHOLD = 32.1 ether;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(uint256 amount);
    event AutoWithdrawTriggered(uint256 amount, address indexed to); // NEW EVENT

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can withdraw");
        _;
    }

    constructor(string memory _name) {
        owner = msg.sender;
        name = _name;
    }

    // Function for users to deposit Holesky ETH
    function deposit() external payable {
        require(msg.value > 0, "Deposit must be greater than 0");

        emit Deposited(msg.sender, msg.value);

        // Check if balance has reached 32 ETH
        checkAndWithdraw();
    }

    // Function to automatically withdraw when balance reaches 32 ETH
    function checkAndWithdraw() internal {
        if (address(this).balance >= THRESHOLD) {
            uint256 balance = address(this).balance;
            withdrawAll();

            // Emit event so frontend knows auto-withdraw happened
            emit AutoWithdrawTriggered(balance, owner);
        }
    }

    // Function for the owner to manually withdraw all ETH
    function withdrawAll() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");

        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");

        emit Withdrawn(balance);
    }

    // Function to check the contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}