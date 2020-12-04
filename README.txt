These are my answers for the 2nd Assessment for Energi



1. Gas Price is determined by miners on the network. A transaction paid with a higher than average gas price is a higher priority to the miners.
2. Storage is where the contract state variables live. Persists between function calls. Expensive to use.
   Memory holds temporary values. Much less expensive.
   Stack holds small variables, but a limited amonunt of values. 
3. Allows extra control over function calls. e.g. prerequisite much be reached before running
4. Write a smart contract in solidity that sends funds to the last address that it received the
funds from if no new funds have been received for 100 blocks


5. Should have a constructor method and bid() be rewritten using conditional as a modifier 


contract DosAuction {

  constructor() public {
    address currentFrontrunner = msg.sender;
    uint currentBid = msg.value;
  }

  function bid() payable notFrontRunner() {
    require(msg.value > currentBid);
  };

  modifier notFrontRunner() {
      if (currentFrontrunner != 0) {
      require(currentFrontrunner.send(currentBid));
  };
  _;

  
  }
}


