/* eslint-disable no-undef */
const { assert } = require("console");
const Tether = artifacts.require("../contracts/Tether.sol");
const RewardToken = artifacts.require("../contracts/RewardToken.sol");
const DecentralBank = artifacts.require("../contracts/DecentralBank.sol");

require("chai").use(require("chai-as-promised")).should();

contract("DecentralBank", (accounts) => {
  describe("Tether deployment", () => {
    it("matches name successfully", async () => {
      let tether = await Tether.new();
      const name = tether.name();
      assert.equal(name, "Tether");
    });
  });
});
