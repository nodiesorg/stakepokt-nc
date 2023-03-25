// Instantiate a provider for querying information on the chain!
import {JsonRpcProvider} from "@pokt-foundation/pocketjs-provider";

export const PoktProvider = new JsonRpcProvider({
    rpcUrl: process.env.POKT_RPC_URL!,
});