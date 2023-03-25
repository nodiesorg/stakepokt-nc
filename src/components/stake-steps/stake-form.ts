import {createContext} from "react";
import {Account} from "@pokt-foundation/pocketjs-types";
import {ImportedNCNode} from "@/internal/pokt-types/ImportedNCNode";


export type StakeForm = {
    wallet: Account | undefined;
    stakeAmount: string;
    transferAmount: string;
    outputAddress: string;
    nodesToStake: ImportedNCNode[]
}

export const DefaultStakeForm: StakeForm = {
    outputAddress: "",
    stakeAmount: "",
    transferAmount: "",
    wallet: undefined,
    nodesToStake: [],
}
