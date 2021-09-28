import { formatEther } from "@ethersproject/units";
import React, { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { fetcher } from "../Fetcher/Fetcher";
import useSWR from "swr";
import BigNumber from "bignumber.js";

export const Balance = () => {
  const { account, library } = useWeb3React<Web3Provider>();
  const { data: balance, mutate } = useSWR(["getBalance", account, "latest"], {
    fetcher: fetcher(library),
  });

  useEffect(() => {
    // listen for changes on an Ethereum address
    console.log(`listening for blocks...`);
    library?.on("block", () => {
      console.log("update balance...");
      mutate(undefined, true);
    });
    // remove listener when the component is unmounted
    return () => {
      library?.removeAllListeners("block");
    };
    // trigger the effect only on component mount
  }, []);

  if (!balance) {
    return <div>...</div>;
  }
  return <div>Ξ {parseFloat(formatEther(balance)).toPrecision(4)}</div>;
};
