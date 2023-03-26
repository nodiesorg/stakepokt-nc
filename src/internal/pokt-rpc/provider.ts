import {IsomorphicProvider} from "@/internal/pocket-js-2.1.1/packages/isomorphic-provider";
import {KeyManager} from "@/internal/pocket-js-2.1.1/packages/signer";
import {TransactionBuilder} from "@/internal/pocket-js-2.1.1/packages/transaction-builder";

export const PoktProvider = new IsomorphicProvider({
    rpcUrl: process.env.NEXT_PUBLIC_POKT_RPC_URL!,
});

export const getTransactionBuilder = (wallet: KeyManager): TransactionBuilder => {
    return new TransactionBuilder({
        chainID: "mainnet",
        provider:PoktProvider,
        signer:wallet,
    });
}