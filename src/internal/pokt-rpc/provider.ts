import { IsomorphicProvider } from '@pokt-foundation/pocketjs-isomorphic-provider'


export const PoktProvider = new IsomorphicProvider({
    rpcUrl: process.env.POKT_RPC_URL!,
});