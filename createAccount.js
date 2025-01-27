const StellarSdk = require('stellar-sdk');
const fs = require('fs');
const path = require('path');

// File to store account details
const accountFilePath = path.join(__dirname, 'account.json');

// Generate a new keypair
const pair = StellarSdk.Keypair.random();

// Save account details to a file
const accountDetails = {
    publicKey: pair.publicKey(),
    secretKey: pair.secret(),
};

fs.writeFileSync(accountFilePath, JSON.stringify(accountDetails, null, 2));
console.log("Account details saved to account.json");

// Fund the account with Testnet XLM
async function fundAccount() {
    try {
        const response = await fetch(`https://friendbot.stellar.org?addr=${pair.publicKey()}`);
        const data = await response.json();
        console.log("Account funded:", data);
    } catch (error) {
        console.error("Error funding account:", error);
    }
}

fundAccount();