********These are my answers for the 2nd Assessment for Energi*************



1. Gas Price is determined by miners on the network. A transaction paid with a higher than average gas price is a higher priority to the miners.
2. Storage is where the contract state variables live. Persists between function calls. Expensive to use.
   Memory holds temporary values. Much less expensive.
   Stack holds small variables, but a limited amonunt of values. 
3. Allows extra control over function calls. e.g. prerequisite much be reached before running
4. SEE BELOW


5. Should have a constructor method and bid() be rewritten using conditional as a modifier 


contract DosAuction {

   address currentFrontrunner;
   uint currentBid;

  constructor() public {
    currentFrontrunner = msg.sender;
    currentBid = msg.value;
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



BELOW:

I used a Ganache and Truffle to test my contract and I wrote some tests just to make sure it worked. 

1. Start up Ganache in one terminal
2. Open another terminal and run:
   truffle compile
   truffle run 
   
 You should see the tests that I ran inorder make sure this worked. 



Thank you so much! This was a fun assessment!
