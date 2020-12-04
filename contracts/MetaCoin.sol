// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.7.0;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

/*
Write a smart contract in solidity that sends funds to the last address that it received th
funds from if no new funds have been received for 100 blocks
- does funds mean wei?

Write a smart contract in solidity that
- sends funds to the last address that it received the funds from
- if no new funds have been received for 100 blocks

an individual can deposit coin
if no individual has deposited coins for 100 blocks,
- send funds to the last address that has deposited funds to the contract

- deposit function
	- deposits wei
	- store the address as "lastAddress"
	- store current block as "blockNumOnReceive"
	- add value to total wei amount

- withdraw function
	- can only be done by lastAddress
	- can only be done if there has been 100 or more blocks since last "blockNumOnReceive"
	- resets lastaddress, wei amount and blockNumOnReceive





*/

contract MetaCoin {
	mapping (address => uint) balances;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	address lastAddress;
	uint256 lastAmount;
	uint256 blockNumOnReceive;
	uint totalAmount;

	constructor() public {
		reset();
	}

	function reset() private {
		totalAmount = 10000;
		lastAddress = tx.origin;
		blockNumOnReceive = block.number;
		balances[tx.origin] = 10000;
	}

function sendCoin(
  address receiver, uint amount
) public returns(bool sufficient) {
	if(sendCoinInternal(receiver, amount, msg.sender)){
	  emit Transfer(lastAddress, receiver, amount); 
		return true;
	}
}

function sendCoinInternal(
		address receiver, uint amount, address sender
) private returns(bool sufficient) {
		if (balances[sender] < amount) return false;
		if (sender == receiver) return false;
		balances[sender] -= amount;
		balances[receiver] += amount;
		blockNumOnReceive = block.number;
		lastAddress = sender;
		lastAmount = amount;
		return true;
} 

	function claimTimeout(address sender) public returns (bool sufficient) {
    require(block.number - 100 >= blockNumOnReceive);
    sendCoinInternal(lastAddress, lastAmount, sender);
		return true;
  }

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}

	function getBlockNumber() public view returns(uint) {
		return blockNumOnReceive;
	}


}
