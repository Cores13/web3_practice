import { formatUnits } from "@ethersproject/units";
import React, { useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { fetcher } from "../Fetcher/Fetcher";
import useSWR from "swr";
import Web3 from "web3";
// import Tx from "@ethereumjs/tx";

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

var Tx = require("@ethereumjs/tx").Transaction;
const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonicPhrase = process.env.REACT_APP_MNEMONIC;

let provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonicPhrase,
  },
  providerOrUrl: Web3.givenProvider,
});

web3.setProvider(provider);
interface IProps {
  symbol: any;
  address: any;
  decimals: any;
}

// const ERC20ABI = [
//   "function allowance(address owner, address spender) external view returns (uint256)",
//   "function approve(address spender, uint256 amount) external returns (bool)",
//   "function balanceOf(address marketMaker) external view returns (uint256)",
//   "function symbol() external view returns (string)",
//   "function name() external view returns (string)",
//   "function decimals() external view returns (uint8)",
//   "function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)",
//   "function transfer(address to, uint256 value) public returns (bool)",
//   "function totalSupply() public view returns (uint)",
// ];
const ERC20ABI: any = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "b",
        type: "bytes32",
      },
    ],
    name: "Event",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "b",
        type: "bytes32",
      },
    ],
    name: "Event2",
    type: "event",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
    ],
    name: "foo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
];

export const TokenBalance: React.FC<IProps> = ({
  symbol,
  address,
  decimals,
}) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const { data: balance, mutate } = useSWR([address, "balanceOf", account], {
    fetcher: fetcher(library, ERC20ABI),
  });

  useEffect(() => {
    const password = process.env.REACT_APP_PASSWORD!.toString();

    var privateKey = Buffer.from(process.env.REACT_APP_PRIVATE!, "hex");
    // listen for changes on an Ethereum address
    console.log(`listening for Transfer...`);
    const contract = new web3.eth.Contract(ERC20ABI, address);

    let nonce;

    web3.eth
      .getTransactionCount("0x2df7317eA3001cF285d35092a2d9dC721da629dd")
      .then((_nonce) => {
        nonce = "0x" + _nonce.toString(16);
        console.log(nonce);
      });

    const rawTx = {
      // nonce: nonce,
      from: "0x2df7317eA3001cF285d35092a2d9dC721da629dd",
      gasPrice: "0x09184e72a00",
      gas: "0x9710",
      to: "0x4f4DF571063Ba33e74Ed30F9b6116F010BAFfCf2",
      value: "0x16345785D8A0000",
      data: "",
    };

    var signedTx = new Tx(rawTx, { chain: "rinkeby" });
    signedTx.sign(privateKey);

    var serializedTx = signedTx.serialize();

    web3.eth
      .sendSignedTransaction("0x" + serializedTx.toString("hex"))
      .on("receipt", console.log);
  }, []);

  if (!balance) {
    return <div>...</div>;
  }
  return (
    <div>
      {parseFloat(formatUnits(balance, decimals)).toPrecision(4)} {symbol}
    </div>
  );
};
