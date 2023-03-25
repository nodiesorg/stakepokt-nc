import Head from "next/head";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Container,
    Flex,
    Heading,
} from "@chakra-ui/react";
import {Step, Steps, useSteps} from "chakra-ui-steps";
import ImportNcWalletStep from "@/components/stake-steps/import-nc-wallet-step";
import ImportNodeKeysStep from "@/components/stake-steps/import-node-keys-step";
import SetStakeAmountStep from "@/components/stake-steps/set-stake-amount-step";
import StakeTable from "@/components/stake-table/StakeTable";
import { useState} from "react";
import {DefaultStakeForm, StakeForm} from "@/components/stake-steps/stake-form";

const stepMetadata = [
    {
        headerTitle: "Non Custodial Staking Tool",
    },
    {
        headerTitle: "Import Node Keys",
    },
    {
        headerTitle: "Set Stake Distribution",
    },
    {
        headerTitle: "Staking results",
    },
];

export default function Home() {

    const {nextStep, prevStep, activeStep} = useSteps({
        initialStep: 0,
    });


    const [stakeForm, setStakeForm] = useState<StakeForm>({
        ...DefaultStakeForm,
    })

    const finishedWithSteps = activeStep == stepMetadata.length

    return (
        <>
            <Head>
                <title>Nodies</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <Box as="main" minHeight="100vh">
                <Flex alignItems="center" minHeight="100vh">
                    <Container maxWidth="3xl" height="100%">
                        {/* Multistep card */}
                        <Card backgroundColor="#1B1E30">
                            <CardBody>
                                <CardHeader>
                                    <Heading
                                        color="white"
                                        fontFamily="Poppins"
                                        fontSize="24px"
                                        fontWeight={500}
                                        textAlign="center"
                                    >
                                        {activeStep < stepMetadata.length && stepMetadata[activeStep].headerTitle}
                                    </Heading>
                                </CardHeader>
                                <Steps
                                    activeStep={activeStep}
                                    orientation="horizontal"
                                    margin="3rem 0"
                                >
                                    <Step label={""} key={0}>
                                        <ImportNcWalletStep onNextStep={nextStep}/>
                                    </Step>
                                    <Step label={""} key={1}>
                                        <ImportNodeKeysStep onNextStep={nextStep} onPrevStep={prevStep}/>
                                    </Step>
                                    <Step label={""} key={2}>
                                        <SetStakeAmountStep onNextStep={nextStep} onPrevStep={prevStep}/>
                                    </Step>
                                    <Step label={""} key={3}>
                                        <StakeTable/>
                                    </Step>
                                </Steps>
                                )
                            </CardBody>
                        </Card>
                    </Container>
                </Flex>
            </Box>
        </>
    );
}
