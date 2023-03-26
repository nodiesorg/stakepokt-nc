import {ImportedNcNode} from "@/internal/pokt-types/imported-nc-node";
import {KeyManager} from "@/internal/pocket-js-2.1.1/packages/signer";
import bigDecimal from "js-big-decimal";

export type StakeForm = {
    wallet?: KeyManager;
    stakeAmount?: bigDecimal;
    transferAmount?: bigDecimal;
    customOutputAddress?: string;
    nodesToStake?: ImportedNcNode[]
}

export const DefaultStakeForm: StakeForm = {
    customOutputAddress: "",
    stakeAmount: "",
    transferAmount: "",
    wallet: undefined,
    nodesToStake: [],
}
