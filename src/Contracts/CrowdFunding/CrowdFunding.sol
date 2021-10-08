// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

contract CrowdFunding {
    mapping(address => uint) public contributors;
    address public admin;
    uint public numOfContributors;
    uint public minContribution;
    uint public deadline;
    uint public goal;
    uint public raisedAmmount;
    
    struct Request{
        string desc;
        address payable recipient;
        uint value;
        bool completed;
        uint numOfVoters;
        mapping(address => bool) voters;
    }
    
    mapping(uint => Request) public requests;
    
    uint public numRequests;
    
    constructor(uint _goal, uint _deadline){
        admin = msg.sender;
        deadline = block.timestamp + _deadline;
        goal = _goal;
        minContribution = 100 wei;
    }
    
    modifier onlyAdmin(){
        require(msg.sender == admin, 'You are not an admin!');
        _;
    }
    
    event ContributeEvent(address _sender, uint _value);
    event CreateRequestEvent(string _desc, address _recipient, uint _value);
    event MakePaymentEvent(address _recipient, uint _value);
    
    receive() payable external {
        contribute();
    }
    
    function contribute() public payable {
        require(block.timestamp < deadline, 'Deadline has passed!');
        require(msg.value >= minContribution, 'Minimum contribution not met!');
        
        if(contributors[msg.sender] == 0){
            numOfContributors++;
        }
        
        contributors[msg.sender] += msg.value;
        
        raisedAmmount += msg.value;
        
        emit ContributeEvent(msg.sender, msg.value);
    }
    
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
    
    function getRefund() public {
        require(block.timestamp > deadline && raisedAmmount < goal);
        require(contributors[msg.sender] > 0);
        
        address payable receiver = payable(msg.sender);
        uint value = contributors[msg.sender];
        
        receiver.transfer(value);
        contributors[msg.sender] = 0;
    }
    
    function createRequest(string memory _desc, address payable _recipient, uint _value) public onlyAdmin{
        Request storage newRequest = requests[numRequests];
        numRequests++;
        
        newRequest.desc = _desc;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.completed = false;
        newRequest.numOfVoters = 0;
        
        emit CreateRequestEvent(_desc, _recipient, _value);
    }
    
    function vote(uint _reqNum) public {
        require(contributors[msg.sender] > 0, 'You must be a contributor in order to vote!');
        Request storage thisRequest = requests[_reqNum];
        
        require(thisRequest.voters[msg.sender] == false, 'You already voted');
        thisRequest.voters[msg.sender] == true;
        thisRequest.numOfVoters++;
    }
    
    function makePayment(uint _reqNum) public onlyAdmin {
        require(raisedAmmount >= goal);
        Request storage thisRequest = requests[_reqNum];
        require(thisRequest.completed == false, 'The requrest has been completed.');
        require(thisRequest.numOfVoters > numOfContributors /2, 'More people have to vote!');
        
        thisRequest.recipient.transfer(thisRequest.value);
        thisRequest.completed = true;
        
        emit MakePaymentEvent(thisRequest.recipient, thisRequest.value);
    }
}