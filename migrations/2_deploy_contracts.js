// eslint-disable-next-line no-undef
const Tether = artifacts.require("../contracts/Tether.sol");
// eslint-disable-next-line no-undef
const RewardToken = artifacts.require("../contracts/RewardToken.sol");
// eslint-disable-next-line no-undef
const DecentralBank = artifacts.require("../contracts/DecentralBank.sol");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Tether);
  const tether = await Tether.deployed();

  await deployer.deploy(RewardToken);
  const reward = await RewardToken.deployed();

  await deployer.deploy(DecentralBank, reward.address, tether.address);
  const decentralBank = await DecentralBank.deployed();

  await reward.transfer(decentralBank.address, "1000000000000000000000000000");
  await tether.transfer(
    "0x4f4DF571063Ba33e74Ed30F9b6116F010BAFfCf2",
    "100000000000000000000"
  );
};
