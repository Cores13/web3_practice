import { Contract } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { isAddress } from "@ethersproject/address";

export const fetcher =
  (library?: Web3Provider | any, abi?: any) =>
  (...args: any) => {
    const [arg1, arg2, ...params] = args;
    // it's a contract
    if (isAddress(arg1)) {
      const address = arg1;
      const method = arg2;
      const contract = new Contract(address, abi, library?.getSigner());
      return contract[method](...params);
    }
    // it's a eth call
    const method: string = arg1;
    //eslint-disable-next-line
    return library[method](arg2, ...params);
  };
