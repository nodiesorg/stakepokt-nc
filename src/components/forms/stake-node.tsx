import { CardBody, CardHeader, Heading } from '@chakra-ui/react'
import { Step, Steps } from 'chakra-ui-steps'
import { useState } from 'react'

import {
    DefaultStakeForm,
    StakeForm,
} from '@/components/stake-steps/stake-form'
import ImportNcWalletStep from '../stake-steps/import-nc-wallet-step'
import ImportNodeKeysStep from '../stake-steps/import-node-keys-step'
import PerformStakeStep from '../stake-steps/perform-stake-step'
import SetStakeAmountStep from '../stake-steps/set-stake-amount-step'
import ConfirmationStep from '../stake-steps/confirmation-step'

const stepMetadata = [
    {
        headerTitle: 'Non Custodial Staking Tool',
    },
    {
        headerTitle: 'Import Node Keys',
    },
    {
        headerTitle: 'Set Stake Distribution',
    },
    {
        headerTitle: 'Confirm Stake',
    },
    {
        headerTitle: 'Staking results',
    },
]

function StakeNodeForm({
    activeStep,
    goToNextStep,
    goToPrevStep,
}: {
    activeStep: number
    goToNextStep: () => void
    goToPrevStep: () => void
}) {
    const [stakeForm, setStakeForm] = useState<StakeForm>({
        ...DefaultStakeForm,
    })

    const handleOnNextStep = (updatedForm: StakeForm) => {
        // update form keys
        Object.keys(updatedForm).forEach((key: string) =>
            // @ts-ignore
            updatedForm[key] === undefined ? delete updatedForm[key] : {}
        )
        setStakeForm((prevState) => {
            return {
                ...prevState,
                ...updatedForm,
            }
        })
        // Move to next step
        goToNextStep()
    }

    return (
        <CardBody>
            <CardHeader>
                <Heading
                    color="white"
                    fontFamily="Poppins"
                    fontSize="24px"
                    fontWeight={500}
                    textAlign="center"
                >
                    {activeStep < stepMetadata.length &&
                        stepMetadata[activeStep].headerTitle}
                </Heading>
            </CardHeader>
            <Steps
                activeStep={activeStep}
                orientation="horizontal"
                margin="3rem 0"
            >
                <Step label={''} key={0}>
                    <ImportNcWalletStep onNextStep={handleOnNextStep} />
                </Step>
                <Step label={''} key={1}>
                    <ImportNodeKeysStep
                        onNextStep={handleOnNextStep}
                        onPrevStep={goToPrevStep}
                    />
                </Step>
                <Step label={''} key={2}>
                    <SetStakeAmountStep
                        wallet={stakeForm.wallet}
                        importedNodes={stakeForm.nodesToStake}
                        onNextStep={handleOnNextStep}
                        onPrevStep={goToPrevStep}
                    />
                </Step>
                <Step label={''} key={3}>
                    <ConfirmationStep 
                        stakeForm={stakeForm}
                        onNextStep={handleOnNextStep}
                        onPrevStep={goToPrevStep}
                    />
                </Step>
                <Step label={''} key={4}>
                    <PerformStakeStep stakeForm={stakeForm} />
                </Step>
            </Steps>
        </CardBody>
    )
}

export default StakeNodeForm
