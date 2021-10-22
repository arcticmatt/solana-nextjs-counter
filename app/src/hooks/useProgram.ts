import { Idl, Program, Provider } from "@project-serum/anchor";
import { useEffect, useState } from "react";

import { Connection } from "@solana/web3.js";
import { Maybe } from "src/types/UtilityTypes";
import PROGRAM_ID from "src/constants/ProgramId";
import idl from "src/idl.json";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const opts: { preflightCommitment: "processed" } = {
  preflightCommitment: "processed",
};

export default function useProgram() {
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Maybe<Program<Idl>>>(null);

  useEffect(() => {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(connection, wallet!, opts);
    const programInner = new Program(idl as Idl, PROGRAM_ID, provider);
    setProgram(programInner);
  }, [wallet]);

  return program;
}
