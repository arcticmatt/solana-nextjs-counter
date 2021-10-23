import { BN, web3 } from "@project-serum/anchor";
import {
  ConnectionProvider,
  WalletProvider,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { Maybe, MaybeUndef } from "src/types/UtilityTypes";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

import { AccountsContextProvider } from "src/context/AccountsContext";
import CONNECTION_ENDPOINT from "src/constants/ConnectionEndpoint";
import ResponsiveContainer from "src/components/ResponsiveContainer";
import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import getProvider from "src/utils/getProvider";
import styles from "@/css/pages/home/HomePage.module.css";
import useAccountsContext from "src/hooks/useAccountsContext";
import useProgram from "src/hooks/useProgram";

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  getPhantomWallet(),
];

const { SystemProgram } = web3;

function App(): Maybe<JSX.Element> {
  const [value, setValue] = useState<MaybeUndef<number>>(undefined);
  const wallet = useAnchorWallet();
  const program = useProgram();
  const { baseAccount, baseAccountBump } = useAccountsContext();

  useEffect(() => {
    async function run() {
      if (program == null || baseAccount == null) {
        return;
      }
      try {
        const account = await program.account.baseAccount.fetch(baseAccount);
        setValue(Number(account.count.toString()));
      } catch (e) {
        console.log("initial fetch tx error: ", e);
        setValue(null);
      }
    }

    run();
  }, [program, baseAccount]);

  async function createCounter() {
    if (
      program == null ||
      wallet == null ||
      baseAccount == null ||
      baseAccountBump == null
    ) {
      return;
    }

    const provider = getProvider(wallet);

    try {
      /* interact with the program via rpc */
      await program.rpc.create(new BN(baseAccountBump), {
        accounts: {
          baseAccount,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      });

      const account = await program.account.baseAccount.fetch(baseAccount);
      setValue(Number(account.count.toString()));
    } catch (e) {
      console.log("createCounter tx error: ", e);
    }
  }

  async function increment() {
    if (program == null || baseAccount == null) {
      return;
    }

    await program.rpc.increment({
      accounts: {
        baseAccount,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount);
    setValue(Number(account.count.toString()));
  }

  if (wallet == null) {
    return (
      <div className={styles.container}>
        <WalletMultiButton />
      </div>
    );
  }

  if (value === undefined) {
    return null;
  }

  return (
    <div className={styles.container}>
      {value == null && (
        <button onClick={createCounter} type="button">
          Create counter
        </button>
      )}
      {value != null && (
        <>
          <button onClick={increment} type="button">
            Increment counter
          </button>
          <h2>{value}</h2>
        </>
      )}
    </div>
  );
}

/* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
export default function HomePage(): JSX.Element {
  return (
    <ConnectionProvider endpoint={CONNECTION_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AccountsContextProvider>
            <ResponsiveContainer>
              <App />
            </ResponsiveContainer>
          </AccountsContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
