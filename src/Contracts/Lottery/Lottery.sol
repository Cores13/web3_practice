// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Lottery is VRFConsumerBase  {
    address payable[] public players;
    address payable public manager;
    
    // Chainlink random number variables
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 internal randomResult;
    
    uint public index;
    address payable public winner;
    
    constructor() 
        VRFConsumerBase(
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, // VRF Coordinator
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709  // LINK Token
        )
    {
        manager = payable(msg.sender);
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
    }
    
    modifier onlyManager(){
        require(manager == msg.sender, "Your are not the manager!");
        _;
    }
    
    /** 
     * Requests randomness 
     */
    function getRandomNumber() internal onlyManager returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        randomResult = uint(requestRandomness(keyHash, fee));
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal onlyManager override {
        randomResult = uint(requestId);
        randomResult = randomness;
    }
    
    receive() external payable{
        require(msg.sender != manager, 'Manager can\'t join the lottery!');
        require(msg.value == 0.1 ether);
        players.push(payable(msg.sender));
    }
    
    function getBalance() public view onlyManager returns(uint){
        return address(this).balance;
    }
    
    function random() public view onlyManager returns(uint){
        return (uint(keccak256(abi.encodePacked(randomResult, block.timestamp, players.length))) % players.length);
    }
    
    function pickWinner() public onlyManager {
        require(players.length >= 3);
        index = random();
        winner = players[index];
    }
    function payTheWinner() public onlyManager{
        manager.transfer((getBalance() * 10 / 100));
        winner.transfer(getBalance());
        players = new address payable[](0); // reseting the lottery
        winner = players[0];
    }
}