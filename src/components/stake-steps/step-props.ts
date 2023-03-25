import {StakeForm} from "@/components/stake-steps/stake-form";

export type ForwardStepProps = {
    onNextStep: () => void;
}

export type BidirectionalStepProps = {
    onPrevStep: () => void
} & ForwardStepProps;