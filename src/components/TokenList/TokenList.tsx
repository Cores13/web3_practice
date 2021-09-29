import { TokenBalance } from "../TokenBalance/TokenBalance";

export const Networks = {
  MainNet: 1,
  Rinkeby: 4,
  Ropsten: 3,
  Kovan: 42,
};

export interface IERC20 {
  symbol: string;
  address: string;
  decimals: number;
  name: string;
}

export const TOKENS_BY_NETWORK: {
  [key: number]: IERC20[];
} = {
  [Networks.Rinkeby]: [
    // {
    //   address: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
    //   symbol: "DAI",
    //   name: "Dai",
    //   decimals: 18,
    // },
    // {
    //   address: "0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85",
    //   symbol: "MKR",
    //   name: "Maker",
    //   decimals: 18,
    // },
  ],
};

export const TokenList = ({ chainId }: any) => {
  return (
    <>
      {TOKENS_BY_NETWORK[chainId].map((token) => (
        <TokenBalance key={token.address} {...token} />
      ))}
      {/* <TokenBalance key={token.address} {...token} /> */}
    </>
  );
};
