import React, { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Balance } from "../Balance/Balance";
import { TokenBalance } from "../TokenBalance/TokenBalance";
import { TokenList } from "../TokenList/TokenList";
import { SWRConfig } from "swr";
import { fetcher } from "../Fetcher/Fetcher";
import { formatEther } from "@ethersproject/units";
import useSWR from "swr";
import Web3 from "web3";
const Tx = require("ethereumjs-tx");
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

type TLatestBlock = {
  baseFeePerGas: string;
  difficulty: string;
  extraData: string;
  gasLimit: number;
  gasUsed: number;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: string;
  number: number;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: number;
  stateRoot: string;
  timestamp: number;
  totalDifficulty: string;
  transactions: string[];
  transactionsRoot: string;
  uncles: [];
};

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
  ],
});

export const Wallet = () => {
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();

  const [gasPrice, setGasPrice] = useState(0);
  const [latestBlock, setLatestBlock] = useState<TLatestBlock>({
    baseFeePerGas: "0x0",
    difficulty: "",
    extraData: "",
    gasLimit: 0,
    gasUsed: 0,
    hash: "",
    logsBloom: "",
    miner: "",
    mixHash: "",
    nonce: "",
    number: 0,
    parentHash: "",
    receiptsRoot: "",
    sha3Uncles: "",
    size: 0,
    stateRoot: "",
    timestamp: 0,
    totalDifficulty: "",
    transactions: [],
    transactionsRoot: "",
    uncles: [],
  });

  const onClick = () => {
    activate(injectedConnector);
  };

  const getLatestBlock = async () => {
    let latestBlock: any = await web3.eth.getBlock("latest");
    console.log("latest block: ", latestBlock);
    setLatestBlock(latestBlock);
  };
  const getgasPrice = async () => {
    let gasPrice: any = await web3.eth.getGasPrice();
    console.log("latest block: ", gasPrice);
    setGasPrice(gasPrice);
  };

  useEffect(() => {
    getLatestBlock();
    getgasPrice();
  }, [chainId]);

  return (
    <div>
      <SWRConfig value={{ fetcher: fetcher(library, contractABI) }}>
        <div>Latest ETH block: {latestBlock.number}</div>
        <div>Dificulty: {latestBlock.difficulty}</div>
        <div>Gas price: {gasPrice}</div>
        <div>ChainId: {chainId}</div>
        <div>Account: {account}</div>
        {active ? (
          <div>
            ✅<Balance />
            {/* <TokenList chainId={chainId} /> */}
          </div>
        ) : (
          <button type='button' onClick={onClick}>
            Connect
          </button>
        )}
      </SWRConfig>
    </div>
  );
};
