import React from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { fetcher } from "../Fetcher/Fetcher";
import useSWR from "swr";

export const Balance = () => {
  const { account, library } = useWeb3React<Web3Provider>();
  const { data: balance } = useSWR(["getBalance", account, "latest"], {
    fetcher: fetcher(library),
  });
  if (!balance) {
    return <div>...</div>;
  }
  return <div>Balance: {balance.toString()}</div>;
};
//test
