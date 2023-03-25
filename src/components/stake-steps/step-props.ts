import {StakeForm} from "@/components/stake-steps/stake-form";

export type ForwardStepProps = {
    onNextStep: (updatedForm: StakeForm) => void;
}

export type BidirectionalStepProps = {
    onPrevStep: () => void
} & ForwardStepProps;