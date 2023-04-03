import {TransactionBuilder, TxMsg} from "@/internal/pocket-js-2.1.1/packages/transaction-builder";
import {ImportedNcNode} from "@/internal/pokt-types/imported-nc-node";
import {TransactionResponse} from "@/internal/pocket-js-2.1.1/packages/types";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;

export type TxType = "send" | "stake";

export type TxMsgNamed = {
    name: TxType;
    txMsg: TxMsg;
}

export type TxMsgResult = {
    txMsgNamed: TxMsgNamed
    result: string;
}

export class StakableNode {
    get node(): ImportedNcNode {
        return this._node;
    }

    private _node: ImportedNcNode
    private txMsgs: TxMsgNamed[]
    private tb: TransactionBuilder

    constructor(tb: TransactionBuilder, node: ImportedNcNode, txMsgs: TxMsgNamed[]) {
        this._node = node;
        this.tb = tb;
        this.txMsgs = txMsgs
    }
    async stubSubmit ({txMsg: TxMsg}: any) {
        return {
            txHash: "123",
        } as TransactionResponse
    }

    async performStakeAndTransfer() {
        const txs: Promise<TxMsgResult>[] = this.txMsgs.map((txMsgNamed) => {
            return this.stubSubmit({txMsg: txMsgNamed.txMsg}).then(r => ({
                txMsgNamed,
                result: r.txHash
            })).catch(err => ({result: err, txMsgNamed}))
        })
        const results = await Promise.allSettled(txs);
        return results.map(s => (s as PromiseFulfilledResult<TxMsgResult>).value)
    }
}