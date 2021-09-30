import { formatEther } from "@ethersproject/units";
import React, { useEffect, useState } from "react";
import { fetcher } from "../Fetcher/Fetcher";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import Web3 from "web3";
const Tx = require("ethereumjs-tx");
var Accounts = require("web3-eth-accounts");
const Common = require("ethereumjs-common");
const common = Common.default.forCustomChain("rinkeby", {
  name: "rinkeby",
  networkId: 4,
  chainId: 4,
});
let tokenAddress = "0x12766B523bd7422834E372727880ED2585619B2f";
var web3 = new Web3(
  Web3.givenProvider ||
    "https://rinkeby.infura.io/v3/c3950d5fe0814e3e9bd30ba0fcd21aa2"
);
let contractABI: any = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "LockList",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "Account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "LockTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "LockedTokens",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "Account", type: "address" }],
    name: "UnLockTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "Account", type: "address" },
      { internalType: "bool", name: "mode", type: "bool" },
    ],
    name: "UserLock",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "_owner", type: "address" },
      { internalType: "address", name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "_spender", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "_spender", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
      { internalType: "bytes", name: "_extraData", type: "bytes" },
    ],
    name: "approveAndCall",
    outputs: [{ internalType: "bool", name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
    name: "burn",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "Account", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
    ],
    name: "burnFrom",
    outputs: [{ internalType: "bool", name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "_from", type: "address" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const Balance = () => {
  const { account, library } = useWeb3React<Web3Provider>();
  const { data: balance, mutate } = useSWR(["getBalance", account, "latest"], {
    fetcher: fetcher(library),
  });
  const password = process.env.REACT_APP_PASSWORD!.toString();
  const privateKey = process.env.REACT_APP_PRIVATE!.toString();
  const account1: string = account!;
  const account2: string = "0x4f4df571063ba33e74ed30f9b6116f010baffcf2";
  const amount = "0.1";

  const transaction = async (
    fromAddress: any,
    toAddress: any,
    amount: any,
    privateKey: any
  ) => {
    let privateK = Buffer.from(privateKey, "hex");

    let contract = await new web3.eth.Contract(contractABI, tokenAddress, {
      from: fromAddress,
    });

    let amount1 = await web3.utils.toWei(amount.toString(), "ether");
    let count = await web3.eth.getTransactionCount(fromAddress);

    let rawTransaction = {
      from: await fromAddress,
      gasPrice: await web3.utils.toHex(web3.utils.toWei("5", "gwei")),
      gasLimit: await web3.utils.toHex(90000),
      to: await tokenAddress, // When testing contract, put tokenAddress here
      value: 0x0,
      data: await contract.methods.transfer(toAddress, amount1).encodeABI(), // When testing contract, uncoment this line
      nonce: await web3.utils.toHex(count),
    };

    console.log(contract.methods.balanceOf(toAddress).call());

    let transaction = new Tx(rawTransaction);
    let trx = await transaction.sign(privateK);

    let hash = await web3.eth.sendSignedTransaction(
      "0x" + transaction.serialize().toString("hex")
    );
    console.log(hash);
  };

  useEffect(() => {
    // listen for changes on an Ethereum address
    console.log(`listening for blocks...`);
    library?.on("block", () => {
      console.log("update balance...");
      mutate(undefined, true);
    });

    // listen for changes on an Ethereum address
    console.log(`listening for Transfer...`);

    // remove listener when the component is unmounted
    return () => {
      library?.removeAllListeners("block");
    };

    // trigger the effect only on component mount
  }, []);

  if (!balance) {
    return <div>...</div>;
  }
  return (
    <div>
      Ξ {parseFloat(formatEther(balance)).toPrecision(4)}
      <button
        className='send'
        onClick={() => transaction(account1, account2, amount, privateKey)}>
        Send
      </button>
    </div>
  );
};
