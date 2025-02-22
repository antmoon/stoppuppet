

// Check if MetaMask is installed and supports Binance Smart Chain
// Switch to Binance Smart Chain (BSC) if not already connected
async function switchToBSC() {
    const bscChainId = '0x38';  // Binance Smart Chain Mainnet ID (56 in decimal)

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: bscChainId }],
        });
    } catch (error) {
        if (error.code === 4902) {
            // If BSC network isn't added yet, prompt user to add it
            alert("Please add Binance Smart Chain to your MetaMask.");
        } else {
            console.error(error);
        }
    }
}

if (typeof window.ethereum === 'undefined') {
    console.error("MetaMask is not installed.");
    alert("Please install MetaMask to interact with the stoppuppet coin.");
}
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const chainId = await provider.getNetwork().then(network => network.chainId);

// Chain ID for Binance Smart Chain (BSC Mainnet: 56)
if (chainId !== 56) {
    switchToBSC();  // Switch to BSC network

}

const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract's address
const contractABI = [
    "function buyTokens() external payable",
    "function balanceOf(address account) external view returns (uint256)",
];

const contract = new ethers.Contract(contractAddress, contractABI, signer);

document.getElementById('buyTokensBtn').addEventListener('click', async function () {
    const bnbAmount = document.getElementById('ethAmount').value; // Use BNB as the amount input
    if (bnbAmount <= 0) {
        document.getElementById('status').textContent = "Please enter a valid amount.";
        return;
    }

    try {
        // Convert BNB to Wei
        const value = ethers.utils.parseUnits(bnbAmount, 'ether'); // Use 'ether' for BNB, since 1 BNB = 1e18 wei

        // Execute the buyTokens function
        const transaction = await contract.buyTokens({ value: value });
        document.getElementById('status').textContent = "Transaction Pending...";

        // Wait for the transaction to be mined
        await transaction.wait();

        document.getElementById('status').textContent = "Transaction Successful! You have purchased ANTIPUPPET Coins.";
    } catch (error) {
        console.error(error);
        document.getElementById('status').textContent = "Transaction Failed. Please try again.";
    }
});

