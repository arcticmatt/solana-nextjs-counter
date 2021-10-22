# solana-nextjs-counter

A simple Solana program + frontend. There is a global counter, and everyone is able to increment it once.

Adapted from https://github.com/arcticmatt/solana-nextjs.

## Deployment

See https://www.brianfriel.xyz/learning-how-to-build-on-solana/ ("Deploying our completed work for the rest of the world to see" section).

## Useful Commands

### Run tests 

```
anchor test
```

### Get program ID

```
$ solana address -k target/deploy/solana_nextjs_counter-keypair.json
bznhrZuksQzrY6fw3pb86HLFpg86zjngQ7nTiAF4QXv
```

Make sure to use this in `lib.rs` and `Anchor.toml`.

### Copy idl

Copies `./target/idl/solana_nextjs_counter.json` (generated by running `anchor build`) to `./app/src/idl.json`.

```
$ node copyIdl
```