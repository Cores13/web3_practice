import { formatUnits } from "@ethersproject/units";
import React, { useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { fetcher } from "../Fetcher/Fetcher";
import { ethers } from "ethers";
import useSWR from "swr";

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
    // listen for changes on an Ethereum address
    console.log(`listening for Transfer...`);
    const contract = new ethers.Contract(
      address,
      ERC20ABI,
      library?.getSigner()
    );
    const fromMe = contract.filters.Transfer(account);
    library?.on(fromMe, (from, to, amount, event) => {
      console.log("Transfer|sent", { from, to, amount, event });
      mutate(undefined, true);
    });
    const toMe = contract.filters.Transfer(null, account);
    library?.on(toMe, (from, to, amount, event) => {
      console.log("Transfer|received", { from, to, amount, event });
      mutate(undefined, true);
    });
    // remove listener when the component is unmounted
    return () => {
      library?.removeAllListeners(toMe);
      library?.removeAllListeners(fromMe);
    };
    // trigger the effect only on component mount
  }, [account, address, mutate, library]);

  if (!balance) {
    return <div>...</div>;
  }
  return (
    <div>
      {parseFloat(formatUnits(balance, decimals)).toPrecision(4)} {symbol}
    </div>
  );
};
