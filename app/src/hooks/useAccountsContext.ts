import {
  AccountsContext,
  AccountsContextData,
} from "src/context/AccountsContext";

import { useContext } from "react";

export default function useAccountsContext(): AccountsContextData {
  return useContext(AccountsContext);
}
