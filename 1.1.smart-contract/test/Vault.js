const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Lock", function () {

  async function deployVaultFixture() {

    const depositAmount = 1_000_000_000;
    const [owner, approver1, approver2, otherAccount] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(approver1.address, approver2.address, { value: depositAmount });

    return { vault, approver1, approver2, otherAccount, depositAmount };
  }

  describe("Deployment", function () {
    it("Should set the right approver", async function () {
      const { vault, approver1, approver2 } = await loadFixture(deployVaultFixture);

      expect(await vault.approver1()).to.equal(approver1.address);
      expect(await vault.approver2()).to.equal(approver2.address);
    });

  });

  describe("Approve()", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from non approver", async function () {
        const { vault, otherAccount } = await loadFixture(deployVaultFixture);

        await expect(vault.connect(otherAccount).approve()).to.be.revertedWith(
          "Invalid approver"
        );
      });

      it("Sould't fail if called from approver", async function () {
        const { vault, approver1, approver2 } = await loadFixture(deployVaultFixture);

        await expect(vault.connect(approver1).approve()).not.to.be.reverted;
        await expect(vault.connect(approver2).approve()).not.to.be.reverted;
      });
    });

    describe("Approvals", function () {
      it("Should set approvals with true", async function() {
        const { vault, approver1, approver2 } = await loadFixture(deployVaultFixture);

        await vault.connect(approver1).approve();
        expect(await vault.approvals(approver1.address)).to.equal(true);

        await vault.connect(approver2).approve();
        expect(await vault.approvals(approver2.address)).to.equal(true);
      })
    })
  })


  describe("withdraw()", function() {
    describe("Validations", function() {
      it("Should revert with the right error if called with insufficient approvals", async function() {
        const { vault, depositAmount } = await loadFixture(deployVaultFixture);

        await expect(vault.withdraw(depositAmount)).to.be.revertedWith(
          "No sufficient approvals"
        );
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        const { vault, approver1, approver2, otherAccount, depositAmount } = await loadFixture(
          deployVaultFixture
        );

        await vault.connect(approver1).approve();
        await vault.connect(approver2).approve();

        await expect(vault.connect(otherAccount).withdraw(depositAmount)).to.changeEtherBalances(
          [vault, otherAccount],
          [-depositAmount, depositAmount]
        );
      });
    });

  });

});
