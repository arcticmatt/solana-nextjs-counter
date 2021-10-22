import { Connection, PublicKey } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { Idl, Program, Provider, web3 } from "@project-serum/anchor";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import ResponsiveContainer from "src/components/ResponsiveContainer";
import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import idl from "src/idl.json";
import styles from "@/css/pages/home/HomePage.module.css";
import { useState } from "react";

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  getPhantomWallet(),
];

const { SystemProgram, Keypair } = web3;
/* create an account  */
const baseAccount = Keypair.generate();
const opts: { preflightCommitment: "processed" } = {
  preflightCommitment: "processed",
};
const programID = new PublicKey(idl.metadata.address);

function App(): JSX.Element {
  const [value, setValue] = useState(null);
  const wallet = useAnchorWallet();

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(connection, wallet!, opts);
    return provider;
  }

  async function createCounter() {
    const provider = await getProvider();
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl as Idl, programID, provider);
    try {
      /* interact with the program via rpc */
      await program.rpc.create({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });

      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      console.log("account: ", account);
      setValue(account.count.toString());
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function increment() {
    const provider = await getProvider();
    const program = new Program(idl as Idl, programID, provider);
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("account: ", account);
    setValue(account.count.toString());
  }

  if (wallet == null) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return (
      <div className={styles.container}>
        <WalletMultiButton />
      </div>
    );
  }
  return (
    <div className={styles.container}>
      {!value && (
        <button onClick={createCounter} type="button">
          Create counter
        </button>
      )}
      {value && (
        <button onClick={increment} type="button">
          Increment counter
        </button>
      )}

      {value && value >= Number(0) ? (
        <h2>{value}</h2>
      ) : (
        <h3>Please create the counter.</h3>
      )}
    </div>
  );
}

/* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
export default function HomePage(): JSX.Element {
  return (
    <ConnectionProvider endpoint="http://127.0.0.1:8899">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ResponsiveContainer>
            <App />
          </ResponsiveContainer>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
