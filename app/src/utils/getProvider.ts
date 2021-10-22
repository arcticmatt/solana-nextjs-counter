import { AnchorWallet } from "@solana/wallet-adapter-react";
import CONNECTION_ENDPOINT from "src/constants/ConnectionEndpoint";
import { Connection } from "@solana/web3.js";
import { Provider } from "@project-serum/anchor";

const opts: { preflightCommitment: "processed" } = {
  preflightCommitment: "processed",
};

export default function getProvider(wallet: AnchorWallet) {
  const connection = new Connection(
    CONNECTION_ENDPOINT,
    opts.preflightCommitment
  );

  return new Provider(connection, wallet, opts);
}
