import {ImportedNcNode} from "@/internal/pokt-types/imported-nc-node";
import {KeyManager} from "@/internal/pocket-js-2.1.1/packages/signer";

export type StakeForm = {
    wallet?: KeyManager;
    stakeAmount?: string;
    transferAmount?: string;
    outputAddress?: string;
    nodesToStake?: ImportedNcNode[]
}

export const DefaultStakeForm: StakeForm = {
    outputAddress: "",
    stakeAmount: "",
    transferAmount: "",
    wallet: undefined,
    nodesToStake: [],
}
