// next.config.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTM = require("next-transpile-modules")([
  "@blocto/sdk",
  "@solana/wallet-adapter-blocto",
  "@solana/wallet-adapter-react",
  "@solana/wallet-adapter-wallets",
]); // pass the modules you would like to see transpiled

const webpack = {
  webpack5: true,
  webpack: (config) => {
    // eslint-disable-next-line no-param-reassign
    config.resolve.fallback = {
      crypto: false,
      fs: false,
      os: false,
      path: false,
    };

    return config;
  },
};

module.exports = { ...withTM(), ...webpack };
