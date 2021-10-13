const Tether = artifacts.require("../contracts/Tether.sol");
const RewardToken = artifacts.require("../contracts/RewardToken.sol");
const DecentralBank = artifacts.require("../contracts/DecentralBank.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Tether);
  await deployer.deploy(RewardToken);
  await deployer.deploy(DecentralBank);
};
