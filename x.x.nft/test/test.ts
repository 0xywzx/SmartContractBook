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
    const contract = await ContractFactory.deploy();

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
      it("should revert if called other then the minter", async function() {
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

    });

  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
