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

// Get recipient's public key from command-line arguments
const destinationPublicKey = process.argv[2];
if (!destinationPublicKey) {
    console.error("Please provide the recipient's public key as an argument.");
    process.exit(1);
}

async function sendPayment() {
    try {
        const sourceKeypair = StellarSdk.Keypair.fromSecret(accountDetails.secretKey);
        const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

        const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        })
        .addOperation(StellarSdk.Operation.payment({
            destination: destinationPublicKey,
            asset: StellarSdk.Asset.native(),
            amount: '1000', // Amount of XLM to send
        }))
        .setTimeout(30)
        .build();

        transaction.sign(sourceKeypair);
        const result = await server.submitTransaction(transaction);
        console.log("Payment successful:", result);
    } catch (error) {
        console.error("Error sending payment:", error);
    }
}

sendPayment();