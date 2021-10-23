import { Context, createContext, useEffect, useState } from "react";

import { Maybe } from "src/types/UtilityTypes";
import PROGRAM_ID from "src/constants/ProgramId";
import { PublicKey } from "@solana/web3.js";
import { web3 } from "@project-serum/anchor";

/**
 * Context for storing Solana accounts.
 */

export type AccountsContextData = {
  baseAccount: Maybe<PublicKey>;
  baseAccountBump: Maybe<number>;
};

export const AccountsContext: Context<AccountsContextData> =
  createContext<AccountsContextData>({
    baseAccount: null,
    baseAccountBump: null,
  });

type ProviderProps = {
  children: any;
};

export function AccountsContextProvider(props: ProviderProps): JSX.Element {
  const [baseAccount, setBaseAccount] = useState<Maybe<PublicKey>>(null);
  const [baseAccountBump, setBaseAccountBump] = useState<Maybe<number>>(null);

  useEffect(() => {
    async function run() {
      console.log("PROGRAM_ID", PROGRAM_ID.toString());
      const [account, bump] = await web3.PublicKey.findProgramAddress(
        [Buffer.from("base_account")],
        PROGRAM_ID
      );
      console.log("baseAccount", account.toString());

      setBaseAccount(account);
      setBaseAccountBump(bump);
    }

    run();
  }, []);

  return (
    <AccountsContext.Provider
      value={{
        baseAccount,
        baseAccountBump,
      }}
    >
      {props.children}
    </AccountsContext.Provider>
  );
}
