const StellarSdk = require('stellar-sdk');
const fs = require('fs');
const path = require('path');

// File to read account details
const accountFilePath = path.join(__dirname, 'account.json');

// Load account details
let accountDetails;
try {
    accountDetails = JSON.parse(fs.readFileSync(accountFilePath, 'utf8'));
} catch (error) {
    console.error("Error reading account.json:", error);
    process.exit(1);
}

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

async function checkBalance() {
    try {
        const account = await server.loadAccount(accountDetails.publicKey);
        console.log("Balances for account:", accountDetails.publicKey);
        account.balances.forEach(balance => {
            console.log("Type:", balance.asset_type, "Balance:", balance.balance);
        });
    } catch (error) {
        console.error("Error checking balance:", error);
    }
}

checkBalance();