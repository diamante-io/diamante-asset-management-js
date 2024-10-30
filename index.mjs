import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import { create } from "ipfs-http-client";
import {
  Keypair,
  BASE_FEE,
  TransactionBuilder,
  Aurora,
  Networks,
  Operation,
  Asset,
} from "diamnet-sdk";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Configure multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Create an IPFS client
const ipfs = create({ url: "https://uploadipfs.diamcircle.io" });

app.use(cors());
app.use(express.static("public"));

app.post("/CreateNft", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    // The file is available in req.file.buffer
    const fileContent = req.file.buffer;
    const result = await ipfs.add(fileContent);
    console.log("File uploaded to IPFS with CID:", result.cid.toString());

    const { userAddress, assetName } = req.body;
    const metadata = { cid: result.cid.toString() };

    console.log("Received data:", { userAddress, assetName, metadata });

    if (!userAddress || !assetName) {
      return res
        .status(400)
        .json({ error: "userAddress and assetName are required" });
    }

    const server = new Aurora.Server("https://diamtestnet.diamcircle.io/");

    // Create a new issuer keypair
    const issuerkeypair = Keypair.random();

    const asset = new Asset(assetName, issuerkeypair.publicKey());

    const userAccount = await server.loadAccount(userAddress);

    const numOperations = 6;
    const totalFee = ((BASE_FEE * numOperations) / Math.pow(10, 7)).toString();

    const tx = new TransactionBuilder(userAccount, {
      fee: BASE_FEE,
      networkPassphrase: "Diamante Testnet 2024",
    })
      .addOperation(
        Operation.payment({
          destination: userAddress,
          asset: Asset.native(),
          amount: totalFee,
          source: userAddress,
        })
      )
      .addOperation(
        Operation.createAccount({
          destination: issuerkeypair.publicKey(),
          startingBalance: "0.000001",
          source: userAddress,
        })
      )
      .addOperation(
        Operation.changeTrust({
          asset: asset,
          source: userAddress,
        })
      )
      .addOperation(
        Operation.manageData({
          name: assetName,
          source: issuerkeypair.publicKey(),
          value: metadata.cid,
        })
      )
      .addOperation(
        Operation.payment({
          destination: userAddress,
          source: issuerkeypair.publicKey(),
          asset: asset,
          amount: "0.0000001",
        })
      )
      .addOperation(
        Operation.setOptions({
          source: issuerkeypair.publicKey(),
          masterWeight: 0,
        })
      )
      .setTimeout(0)
      .build();

    tx.sign(issuerkeypair);

    const xdr = tx.toXDR();

    res.status(200).json({
      message: "Asset creation request received",
      xdr: xdr,
      cid: result.cid.toString(),
    });
  } catch (error) {
    console.error("Error uploading file to IPFS and creating asset:", error);
    res.status(500).json({ error: "Error uploading file to IPFS and creating asset" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
