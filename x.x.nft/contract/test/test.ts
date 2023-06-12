import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {

  let DEFAULT_ADMIN_ROLE
  = '0x0000000000000000000000000000000000000000000000000000000000000000'
  let MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE'))

  async function deployContractFixture() {

    // Contracts are deployed using the first signer/account by default
    const [
      owner,
      account1,
      account2,
      account3
    ] = await ethers.getSigners();

    const ContractFactory = await ethers.getContractFactory("SCBook");

    // https://docs.chain.link/vrf/v2/direct-funding/supported-networks
    const contract = await ContractFactory.deploy(
      "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846", // LINK Token on fuji
      "0x9345AC54dA4D0B5Cda8CB749d8ef37e5F02BBb21" // VRF Wrapper on fuji
    );

    return { contract, owner, account1, account2, account3 };
  }

  describe("Deployment", function () {

    it("Should owner has roles", async function () {
      const { contract, owner } = await loadFixture(deployContractFixture);

      // for default admin role
      expect(await contract.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.equal(true);
      expect(await contract.hasRole(MINTER_ROLE, owner.address)).to.equal(true);
    });

  });

  describe("SafeMint", function () {
    describe("Valicdation", function () {
      it("should revert if called other than the minter", async function() {
        const { contract, owner, account1 } = await loadFixture(deployContractFixture);

        await expect(contract.connect(account1).safeMint(account1.address)).to.be.revertedWith(
          "AccessControl: account "
          + account1.address.toLowerCase()
          + " is missing role "
          + MINTER_ROLE
        );
      });
    });

    describe("Mint", function () {
      it("should mint NFT", async function() {
        const { contract, account1 } = await loadFixture(deployContractFixture);

        // mint nft
        await contract.safeMint(account1.address);

        expect(await contract.balanceOf(account1.address)).to.be.equal(
          1
        );
      });
    });

  });

  describe("BatchMint", function () {
    describe("Valicdation", function () {
      it("should revert if called other than the minter", async function() {
        const { contract, owner, account1 } = await loadFixture(deployContractFixture);

        await expect(contract.connect(account1).batchMint([account1.address])).to.be.revertedWith(
          "AccessControl: account "
          + account1.address.toLowerCase()
          + " is missing role "
          + MINTER_ROLE
        );
      });
    });

    describe("BatchMint", function () {
      it("should mint NFT", async function() {
        const {
          contract,
          account1,
          account2,
          account3
        } = await loadFixture(deployContractFixture);

        // mint nft
        await contract.batchMint([
          account1.address,
          account2.address,
          account3.address
        ]);

        expect(await contract.balanceOf(account1.address)).to.be.equal(1);
        expect(await contract.balanceOf(account2.address)).to.be.equal(1);
        expect(await contract.balanceOf(account3.address)).to.be.equal(1);
      });
    });
  });

});
