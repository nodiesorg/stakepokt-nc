import {TxMsg} from "@/internal/pocket-js-2.1.1/packages/transaction-builder";

export type ImportedNcNode = {
    node_alias: string;
    address: string;
    pub_key: string;
    domain?: string;
    chains?: string[];
}

export type PrivateNcNode = {
    priv_key:string;
} & ImportedNcNode

class StakableNode {

    private node: ImportedNcNode
    private txMsgs:TxMsg
    constructor(node: ImportedNcNode, txMsgs:TxMsg) {
        this.node = node;
        this.txMsgs = txMsgs
    }

}