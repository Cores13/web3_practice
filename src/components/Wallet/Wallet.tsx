import React from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Balance } from "../Balance/Balance";
import { TokenBalance } from "../TokenBalance/TokenBalance";
import { TokenList } from "../TokenList/TokenList";
import { SWRConfig } from "swr";
import { fetcher } from "../Fetcher/Fetcher";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
  ],
});

const ERC20ABI = [
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

export const Wallet = () => {
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();

  const onClick = () => {
    activate(injectedConnector);
  };

  return (
    <div>
      <SWRConfig value={{ fetcher: fetcher(library, ERC20ABI) }}>
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
