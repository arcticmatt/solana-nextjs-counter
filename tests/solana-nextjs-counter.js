const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

describe("solana_nextjs_counter", () => {
  /* create and set a Provider */
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SolanaNextjsCounter;

  let baseAccount, baseAccountBump;
  before(async () => {
    [baseAccount, baseAccountBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("base_account")],
        program.programId
      );
  });

  it("Creates a counter)", async () => {
    /* Call the create function via RPC */
    await program.rpc.create(new anchor.BN(baseAccountBump), {
      accounts: {
        baseAccount: baseAccount,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    });

    /* Fetch the account and check the value of count */
    const account = await program.account.baseAccount.fetch(baseAccount);
    console.log('Count 0: ', account.count.toString())
    assert.ok(account.count.toString() == 0);

  });

  it("Increments the counter", async () => {
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount);
    console.log('Count 1: ', account.count.toString())
    assert.ok(account.count.toString() == 1);
  });
});