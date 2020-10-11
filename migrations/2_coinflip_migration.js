const Coinflip = artifacts.require("Coinflip");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Coinflip);
};
