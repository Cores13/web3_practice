// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

import './RewardToken.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Bank';
    address payable public owner;

    Tether public tether;
    RewardToken public reward;

    constructor(RewardToken _reward, Tether _tether) {
        reward = _reward;
        tether = _tether;
    }
}