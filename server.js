var fs = require('fs');
const Web3 = require('web3')
const abi = require("./abi.json");

let privateKey = [];

try {  
  var data = fs.readFileSync('wallet.txt', 'utf8');
  privateKey = data.toString().split(/[\r\n]+/g);  
} catch(e) {
  console.log('Error:', e.stack);
}

const mint = async () => {
  const web3 = new Web3("https://polygon-mumbai.g.alchemy.com/v2/hij5lKtrDr5mDcc_141DyuqYRGcJmYYf")
  const contractAddress = '0x60e22499F75fd771b568D9dfa12ea039D93b2613' // NFT contract address

  const maxFeePerGas = 25; // maxFeePerGas
  const maxPriorityFeePerGas = 25; // maxPriorityFeePerGas
  const gas = 400000; // gasfee

  const nftContract = new web3.eth.Contract(abi, contractAddress);
  for (let index = 0; index < privateKey.length - 1; index++) {
    console.log("index", index)
    const account = web3.eth.accounts.privateKeyToAccount(privateKey[index]);
    try {
      const dataValue = nftContract.methods.publicMint(1).encodeABI()
      const nonce = await web3.eth.getTransactionCount(account.address, 'latest');
      const createTransaction = await web3.eth.accounts.signTransaction(
        {
          to: contractAddress, 
          value: 0.004 * 10**18,
          gas: gas,
          data: dataValue,
          maxFeePerGas: maxFeePerGas * 10**9,
          maxPriorityFeePerGas: maxPriorityFeePerGas * 10**9,
          nonce:nonce,
        },
        account.privateKey
      );
      web3.eth.sendSignedTransaction(createTransaction.rawTransaction, function(error, hash) {
        if (!error) {
          console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
        } else {
          console.log("❗Something went wrong while submitting your transaction:", error)
        }
      });
    } catch (error) {
      console.log("error", error)
    }
  }
}

mint();