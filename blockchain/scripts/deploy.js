const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying CertificateVault contract...");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`📝 Deploying from account: ${deployer.address}`);

  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} ETH\n`);

  // Deploy contract
  const CertificateVault = await hre.ethers.getContractFactory("CertificateVault");
  const certificateVault = await CertificateVault.deploy();
  await certificateVault.waitForDeployment();

  console.log(`✅ CertificateVault deployed to: ${certificateVault.target}\n`);

  // Save contract address and ABI
  const network = await hre.ethers.provider.getNetwork();
  const deploymentData = {
    contractAddress: certificateVault.target,
    deployerAddress: deployer.address,
    chainId: network.chainId.toString(),
    deploymentTimestamp: new Date().toISOString(),
  };

  // Save to file
  const deploymentPath = path.join(__dirname, "deployment.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentData, null, 2));
  console.log(`📄 Deployment info saved to: ${deploymentPath}`);

  // Save ABI
  const abiPath = path.join(__dirname, "CertificateVault_ABI.json");
  const artifact = await hre.artifacts.readArtifact("CertificateVault");
  fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
  console.log(`📋 Contract ABI saved to: ${abiPath}`);

  // Verify contract on testnet (optional)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for confirmations before verification...");
    const receipt = await hre.ethers.provider.getTransactionReceipt(certificateVault.deploymentTransaction().hash);
    if (receipt) {
      await receipt.wait(6);
    }
    
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: certificateVault.target,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("⚠️ Verification error (may already be verified):", error.message);
    }
  }

  console.log("\n✨ Deployment complete!");
  console.log(`Contract Address: ${certificateVault.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
