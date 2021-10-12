const Tether = artifacts.require("../contracts/Tether.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Tether);
};
