# Nodies Non Custodial Staking Tool

An alternative tool inspired to make your life easier by performing **bulk non-custodial stakes** with minimal effort. We made this tool for a specific client so they wouldn't have to go through the pains of filling out a form and pressing stake `n` times on https://wallet.pokt.network. Feel free to use for your own use case!
All transaction generation and signing is performed within your browser locally. Only the signed tx is broadcasted to an RPC node to digest and ultimately be placed into the mempool.

##### Note: Still in experimental, use at your own risk.

## Getting Started

### Dependencies

-   [pnpm](https://pnpm.io/)
-   [pocket-js](https://github.com/pokt-foundation/pocket-js)
-   [Next](https://next.js)

First, install node dependencies

```bash
pnpm i
```

Second, create a .env.local file based off `.env.local.template` (i.e)
```bash
cp .env.local.template .env.local
```

Finally run `pnpm run dev`

```bash
https://localhost:3000
```

## Want to Contribute?
We welcome all contributors and suggestions. Submit a Issue/PR with the filled out template, and we'll go from there!