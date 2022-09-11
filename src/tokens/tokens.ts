import { PROTOCOL_NAMES } from "../protocols/protocols";
import { CHAIN_ID } from "../chains/chains";
import { SUPPORTED_LP_TYPES } from "../lp-pairs";

export interface PriceSource {
  source: "coingecko" | "nomics" | "custom";
}

export interface SupportedPriceSource extends PriceSource {
  source: "coingecko" | "nomics";
  apiId: string;
}

export interface CustomPriceSource extends PriceSource {
  source: "custom";
  customPriceFunction: () => Promise<string>;
}

export interface Token {
  name: string;
  symbol: string;
  supportedChainIds: CHAIN_ID[];
  logoUrl?: string;
  protocol?: PROTOCOL_NAMES;
  priceSources: Map<number, SupportedPriceSource | CustomPriceSource>;
}

export interface LpToken extends Token {
  lpType?: SUPPORTED_LP_TYPES;
  token0Address: string;
  token1Address: string;
  baseTokenPosition: 0 | 1;
}

export function getToken(address: string): Token | null {
  // @ts-ignore
  return TOKENS.get(address.toLowerCase()) || null;
}

export const getUniqueApiIds = function(): {
  coingecko: Set<string>,
  nomics: Set<string>,
} {
  const coingecko: Set<string> = new Set();
  const nomics: Set<string> = new Set();

  for (const token of TOKENS.values()) {
    for (const priceSource of token.priceSources.values()) {
      priceSource.source === "coingecko" && coingecko.add(priceSource.apiId);
      priceSource.source === "nomics" && nomics.add(priceSource.apiId);
    }
  }

  return {
    coingecko: coingecko,
    nomics: nomics
  };
};

const mapReducer = (arr: any, [keys, val]: any) => [
  ...arr,
  ...(Array.isArray(keys)
      ? [...keys.map(key => [key, val])]
      : [[keys, val]]
  )
];

// @ts-ignore
export const TOKENS = new Map<string, Token>([
  [
    [
      "ethereum_0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase(),
      "rinkeby_0x458821d1eBcAFC3f185a359c1bf2d27f8421AC14".toLowerCase(),
      "goerli_0x8b7fb00abb67ba04ce894b9e2769fe24a8409a6a".toLowerCase()
    ],
    {
      name: "Ethereum",
      symbol: "ETH",
      priceSources: new Map<number, SupportedPriceSource | CustomPriceSource>([
        [0, { source: "coingecko", apiId: "ethereum" }],
        [1, { source: "nomics", apiId: "ETH" }]
      ])
    }
  ],
  [
    [
      "ethereum_0x0ab87046fbb341d058f17cbc4c1133f25a20a52f".toLowerCase(),
      "goerli_0xbd5cd2dc63626780b496f55a8e99bfa42b2b891a".toLowerCase()
    ],
    {
      name: "Governance OHM",
      symbol: "GOHM",
      priceSources: new Map<number, SupportedPriceSource | CustomPriceSource>([
        [1, { source: "nomics", apiId: "GOHM" }],
        [0, { source: "coingecko", apiId: "governance-ohm" }]
      ])
    }
  ],
  [
    [
      "ethereum_0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5".toLowerCase(),
      "goerli_0x0595328847af962f951a4f8f8ee9a3bf261e4f6b".toLowerCase()
    ],
    {
      name: "Olympus",
      symbol: "OHM",
      priceSources: new Map<number, SupportedPriceSource | CustomPriceSource>([
        [0, { source: "coingecko", apiId: "olympus" }],
        [1, { source: "nomics", apiId: "OHM2" }]
      ])
    }
  ],
  [
    [
      "rinkeby_0x034618c94c99232dc7463563d5285cdb6edc73e0".toLowerCase()
    ],
    {
      name: "Mock Token 1",
      symbol: "MOCK1",
      priceSources: new Map<number, SupportedPriceSource | CustomPriceSource>([
        [0, {
          source: "custom",
          customPriceFunction: async () => "33.00"
        }]
      ])
    }
  ],
  [
    [
      "rinkeby_0x47096F8f6166762b727e8985D92D31be37DD26Bd".toLowerCase()
    ],
    {
      name: "MOCK1-ETH SLP",
      symbol: "MOCK1-ETH SLP",
      lpType: SUPPORTED_LP_TYPES.SUSHISWAP,
      token0Address: "rinkeby_0x034618c94c99232Dc7463563D5285cDB6eDc73e0".toLowerCase(),
      token1Address: "rinkeby_0x458821d1eBcAFC3f185a359c1bf2d27f8421AC14".toLowerCase(),
      baseTokenPosition: 1,
      priceSources: new Map()
    }
  ],
  [
    [
      "goerli_0x41e38e70a36150d08a8c97aec194321b5eb545a5".toLowerCase()
    ],
    {
      name: "Mock Token 2",
      symbol: "MOCK2",
      priceSources: new Map<number, SupportedPriceSource | CustomPriceSource>([
        [0, {
          source: "custom",
          customPriceFunction: async () => "1.00"
        }]
      ])
    }
  ],
  [
    [
      "rinkeby_0x2f7249cb599139e560f0c81c269ab9b04799e453".toLowerCase()
    ],
    {
      name: "Mock Token 3",
      symbol: "MOCK3",
      priceSources: new Map<number, SupportedPriceSource | CustomPriceSource>([
        [0, {
          source: "custom",
          customPriceFunction: async () => "1.00"
        }]
      ])
    }
  ],
  [
    [
      "goerli_0x326C977E6efc84E512bB9C30f76E30c160eD06FB".toLowerCase()
    ],
    {
      name: "Mock Chainlink",
      symbol: "LINK",
      priceSources: new Map<number, SupportedPriceSource | CustomPriceSource>([
        [0, {
          source: "coingecko",
          apiId: "chainlink"
        }]
      ])
    }
  ]
].reduce(mapReducer, []));
