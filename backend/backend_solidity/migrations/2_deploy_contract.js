const MyContract = artifacts.require("HoleskyDeposit");

module.exports = function (deployer) {
  deployer.deploy(MyContract, "keshav");
};