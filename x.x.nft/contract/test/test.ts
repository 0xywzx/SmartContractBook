import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {

  let MAX_SUPPLY = 1200
  let DEFAULT_ADMIN_ROLE
  = '0x0000000000000000000000000000000000000000000000000000000000000000'
  let MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE'))

  async function deployContractFixture() {

    // Contracts are deployed using the first signer/account by default
    const [
      owner,
      account1,
      account2,
      account3,
      operator
    ] = await ethers.getSigners();

    const ContractFactory = await ethers.getContractFactory("SCBook");

    const contract = await ContractFactory.connect(owner).deploy(
      operator.address
    );

    return { contract, owner, account1, account2, account3, operator };
  }

  describe("Deployment", function () {

    it("Should owner has roles", async function () {
      const { contract, owner } = await loadFixture(deployContractFixture);

      // for default admin role
      expect(await contract.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.equal(true);
      expect(await contract.hasRole(MINTER_ROLE, owner.address)).to.equal(true);
    });

    it("should transfer is not allowed", async function () {
      const { contract } = await loadFixture(deployContractFixture);

      expect(await contract.isTransferAllowed()).to.be.equal(
        false
      );
    });

    it("should set max supply", async function () {
      const { contract } = await loadFixture(deployContractFixture);

      expect(await contract.MAX_SUPPLY()).to.be.equal(
        MAX_SUPPLY
      );
    });

    it("should operator has NFT", async function () {
      const { contract, operator } = await loadFixture(deployContractFixture);

      expect(await contract.balanceOf(operator.address)).to.be.equal(
        1
      );
    })
  });

  describe("SafeMint", function () {
    describe("Validation", function () {
      it("should revert if called other than the operator", async function() {
        const { contract, owner, account1 } = await loadFixture(deployContractFixture);

        await expect(contract.connect(account1).safeMint(account1.address)).to.be.revertedWith(
          "AccessControl: account "
          + account1.address.toLowerCase()
          + " is missing role "
          + MINTER_ROLE
        );
      });

      // commented out because it takes too long
      // it("should revert if max supply is reached", async function() {
      //   const { contract, account1 } = await loadFixture(deployContractFixture);

      //   // mint nft to reach max supply
      //   for (let i = 0; i < MAX_SUPPLY; i++) {
      //     await contract.safeMint(account1.address);
      //   }

      //   await expect(contract.safeMint(account1.address)).to.be.revertedWith(
      //     "Max supply reached"
      //   );
      // });
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
    describe("Validation", function () {
      it("should revert if called other than the operator", async function() {
        const { contract, owner, account1 } = await loadFixture(deployContractFixture);

        await expect(contract.connect(account1).batchMint([account1.address])).to.be.revertedWith(
          "AccessControl: account "
          + account1.address.toLowerCase()
          + " is missing role "
          + MINTER_ROLE
        );
      });

      it("should revert if max supply is reached", async function() {
        const { contract, account1 } = await loadFixture(deployContractFixture);

        const batchSize = 200;

        // create an array of `account1.address` of length `MAX_SUPPLY`
        const addressArray = Array(batchSize).fill(account1.address);

        // mint nfts to reach max supply
        for(let i = 0; i < MAX_SUPPLY/batchSize; i++) {
          await contract.batchMint(addressArray);
        }

        await expect(
          contract.safeMint(account1.address)
        ).to.be.revertedWith("Max supply reached");
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
          account3.address,
          account1.address,
          account2.address,
          account3.address,
          account1.address,
          account2.address,
          account3.address,
          account1.address
        ]);

        expect(await contract.balanceOf(account1.address)).to.be.equal(4);
        expect(await contract.balanceOf(account2.address)).to.be.equal(3);
        expect(await contract.balanceOf(account3.address)).to.be.equal(3);
      });
    });
  });

  describe("Pause", function () {
    describe("Validation", function () {
      it("pause : should revert if called other than the operator", async function() {
        const { contract, owner, account1 } = await loadFixture(deployContractFixture);

        await expect(contract.connect(account1).pause()).to.be.revertedWith(
          "AccessControl: account "
          + account1.address.toLowerCase()
          + " is missing role "
          + DEFAULT_ADMIN_ROLE
        );
      });

      it("unpause : should revert if called other than the operator", async function() {
        const { contract, owner, account1 } = await loadFixture(deployContractFixture);

        await expect(contract.connect(account1).unpause()).to.be.revertedWith(
          "AccessControl: account "
          + account1.address.toLowerCase()
          + " is missing role "
          + DEFAULT_ADMIN_ROLE
        );
      });
    });

    describe("Pause", function () {
      it("should pause", async function() {
        const { contract, owner } = await loadFixture(deployContractFixture);

        await contract.connect(owner).pause();

        expect(await contract.paused()).to.be.equal(
          true
        );
      });

      it("should unpause", async function() {
        const { contract, owner } = await loadFixture(deployContractFixture);

        await contract.connect(owner).pause();
        await contract.connect(owner).unpause();

        expect(await contract.paused()).to.be.equal(
          false
        );
      });
    });
  });

  describe("AllowTransfers", function () {
    describe("Validation", function () {
      it("should revert if called other than the operator", async function() {
        const { contract, owner, account1 } = await loadFixture(deployContractFixture);

        await expect(contract.connect(account1).allowTransfers()).to.be.revertedWith(
          "AccessControl: account "
          + account1.address.toLowerCase()
          + " is missing role "
          + DEFAULT_ADMIN_ROLE
        );
      });

      it("should revert if called when not allowed", async function() {
        const { contract, owner, account1, account2 } = await loadFixture(deployContractFixture);

        await contract.safeMint(account1.address);

        await expect(contract.connect(account1).transferFrom(
           account1.address,
           account2.address,
           1
        )).to.be.revertedWith(
          "Transfers not allowed yet"
        );
      });
    });

    describe("AllowTransfers", function () {

      it("should allow transfers", async function() {
        const { contract, owner } = await loadFixture(deployContractFixture);

        await contract.connect(owner).allowTransfers();

        expect(await contract.isTransferAllowed()).to.be.equal(
          true
        );
      });
    });
  });
});
