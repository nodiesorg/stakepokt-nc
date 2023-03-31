import {TxMsg} from "@/internal/pocket-js-2.1.1/packages/transaction-builder";

export type ImportedNcNode = {
    nodeAlias: string;
    address: string;
    publicKey: string;
    domain?: string;
    chains?: string[];
}

class StakableNode {

    private node: ImportedNcNode
    private txMsgs:TxMsg
    constructor(node: ImportedNcNode, txMsgs:TxMsg) {
        this.node = node;
        this.txMsgs = txMsgs
    }

}