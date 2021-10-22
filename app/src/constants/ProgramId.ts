import { PublicKey } from "@solana/web3.js";
import idl from "src/idl.json";

const PROGRAM_ID = new PublicKey(idl.metadata.address);

export default PROGRAM_ID;
