import {Account} from "@pokt-foundation/pocketjs-types";
import {ImportedNcNode} from "@/internal/pokt-types/imported-nc-node";
import {KeyManager} from "@pokt-foundation/pocketjs-signer";


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
