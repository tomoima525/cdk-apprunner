import "dotenv/config";
import express from "express";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { waitTransaction, isSuccessfulTransaction, parseError } from "./tx";

const alchemyApiKey = process.env.ALCHEMY_KEY;
console.log({ alchemyApiKey });

// This is the NFT contract we want to watch.
const contractAddress = "0xBD34d145fcFD3992a0dEf1057891D51339a90128";
console.log(`Listening to Contract: ${contractAddress}`);

// Initialize alchemy-web3 object.
// Docs: https://docs.alchemy.com/alchemy/documentation/subscription-api-websockets
const web3 = createAlchemyWeb3(
  `wss://eth-rinkeby.ws.alchemyapi.io/ws/${alchemyApiKey}`
);

const checkStatus = async (txn: any) => {
  const hash = txn.hash;
  console.log({ hash });
  const receipt = await waitTransaction(web3.eth, hash);
  const isSuccess = isSuccessfulTransaction(receipt);
  if (!isSuccess) {
    await parseError(web3, receipt);
  }
  console.log({ isSuccess, log: receipt.logs });
};

// subscribe pending events
const params = {
  address: contractAddress,
};
web3.eth.getBlockNumber().then(console.log);
web3.eth
  .subscribe("alchemy_filteredFullPendingTransactions", params)
  .on("data", checkStatus);

// server for health check

const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({
    message: `Hello from AWS AppRunner service running!`,
  });
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started`);
});
