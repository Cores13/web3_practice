// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

contract SquidGamer {
    string public name = 'SquidGamer';
    string public symbol = 'SQDG';
    uint256 public totalSupply = 1000000000000000000000000000;
    uint256 public decimals = 18;
    address payable public = owner;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approve(address indexed _owner, address indexed _spender, uint256 _value);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() {
        owner = msg.sender;
        balanceOf[owner] = totalSupply
    }

    function transfer(address payable _to, uint256 _value) public returns(bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {
        require(balanceOf[_from] >= _value);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][_to] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }
}