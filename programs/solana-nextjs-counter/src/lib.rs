use anchor_lang::prelude::*;

declare_id!("2amnYyb9jAe933VEBSE7YDGZRQgFpYJCeep57oSNSCNt");

#[program]
mod solana_nextjs_counter {
    use super::*;

    pub fn create(ctx: Context<Create>, bump: u8) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.count = 0;
        base_account.bump = bump;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.count += 1;
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
pub struct Increment<'info> {
    #[account(mut, seeds = [b"base_account".as_ref()], bump = base_account.bump)]
    pub base_account: Account<'info, BaseAccount>,
}

// An account that goes inside a transaction instruction
#[account]
#[derive(Default)]
pub struct BaseAccount {
    pub count: u64,
    pub bump: u8,
}
