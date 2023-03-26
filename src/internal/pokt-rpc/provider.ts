import {IsomorphicProvider} from "@/internal/pocket-js-2.1.1/packages/isomorphic-provider";

export const PoktProvider = new IsomorphicProvider({
    rpcUrl: process.env.NEXT_PUBLIC_POKT_RPC_URL!,
});