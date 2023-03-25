import {Account} from "@pokt-foundation/pocketjs-types";
import {ImportedNcNode} from "@/internal/pokt-types/imported-nc-node";


export type StakeForm = {
    wallet: Account | undefined;
    stakeAmount: string;
    transferAmount: string;
    outputAddress: string;
    nodesToStake: ImportedNcNode[]
}

export const DefaultStakeForm: StakeForm = {
    outputAddress: "",
    stakeAmount: "",
    transferAmount: "",
    wallet: undefined,
    nodesToStake: [],
}
