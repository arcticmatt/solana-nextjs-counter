use anchor_lang::prelude::*;

declare_id!("2zHwAYnZeN8gip3j6HkU5nvKpraVaFJSXfGLZb4FFWE6");

// ===== Goal =====
// Each account can only increment the counter ONCE.
//
// ===== Implementation =====
// We want one PDA per user account.
// Each PDA will store whether that user has incremented the counter yet.

#[program]
mod solana_nextjs_counter {
    use super::*;

    pub fn create(ctx: Context<Create>, bump: u8) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.count = 0;
        base_account.bump = bump;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>, _bump: u8) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.count += 1;

        // Don't actually need to check the value, because if one user tries to increment
        // twice, it will fail because the has_incremented PDA is already in use.
        let has_incremented = &mut ctx.accounts.has_incremented;
        has_incremented.has_incremented = true;

        Ok(())
    }
}

// Transaction instructions
#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct Create<'info> {
    #[account(init, seeds = [b"base_account".as_ref()], bump = bump, payer = user)]
    pub base_account: Account<'info, BaseAccount>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Transaction instructions
#[derive(Accounts)]
#[instruction(_bump: u8)]
pub struct Increment<'info> {
    #[account(mut, seeds = [b"base_account".as_ref()], bump = base_account.bump)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(init, seeds = [user.key().as_ref()], bump = _bump, payer = user)]
    pub has_incremented: Account<'info, HasIncremented>,
    // This is another kind of sneaky thing, user is the wallet (provider.wallet.publicKey)
    // this is automatically mutable. But if you use another public key, it needs to be mutable,
    // since paying for stuff (e.g. paying for the tx) counts as modifying an account.
    // Note, receiving money also counts as a mutation!
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// An account that goes inside a transaction instruction
#[account]
#[derive(Default)]
pub struct BaseAccount {
    pub count: u64,
    pub bump: u8,
}

// Should be one of these per user that wants to increment.
#[account]
#[derive(Default)]
pub struct HasIncremented {
    pub has_incremented: bool,
}
