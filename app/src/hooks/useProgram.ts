import { Idl, Program } from "@project-serum/anchor";
import { useEffect, useState } from "react";

import { Maybe } from "src/types/UtilityTypes";
import PROGRAM_ID from "src/constants/ProgramId";
import getProvider from "src/utils/getProvider";
import idl from "src/idl.json";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export default function useProgram() {
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Maybe<Program<Idl>>>(null);

  useEffect(() => {
    if (wallet == null) {
      return;
    }

    const provider = getProvider(wallet);
    const programInner = new Program(idl as Idl, PROGRAM_ID, provider);
    setProgram(programInner);
  }, [wallet]);

  return program;
}
