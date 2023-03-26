import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";

import { Step, Steps, useSteps } from "chakra-ui-steps";

import ImportNcWalletStep from "@/components/stake-steps/import-nc-wallet-step";
import ImportNodeKeysStep from "@/components/stake-steps/import-node-keys-step";
import SetStakeAmountStep from "@/components/stake-steps/set-stake-amount-step";
import PerformStakeStep from "@/components/stake-steps/perform-stake-step";
import {
  DefaultStakeForm,
  StakeForm,
} from "@/components/stake-steps/stake-form";

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
  const {
    nextStep: goToNextStep,
    prevStep: goToPrevStep,
    activeStep,
  } = useSteps({
    initialStep: 0,
  });

  const [stakeForm, setStakeForm] = useState<StakeForm>({
    ...DefaultStakeForm,
  });

  const handleOnNextStep = (updatedForm: StakeForm) => {
    // update form keys
    Object.keys(updatedForm).forEach((key: string) =>
      // @ts-ignore
      updatedForm[key] === undefined ? delete updatedForm[key] : {}
    );
    setStakeForm((prevState) => {
      return {
        ...prevState,
        ...updatedForm,
      };
    });
    // Move to next step
    goToNextStep();
  };

  return (
    <>
      <Head>
        <title>Nodies - Non Custodial Staking Tool</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
                    {activeStep < stepMetadata.length &&
                      stepMetadata[activeStep].headerTitle}
                  </Heading>
                </CardHeader>
                <Steps
                  activeStep={activeStep}
                  orientation="horizontal"
                  margin="3rem 0"
                >
                  <Step label={""} key={0}>
                    <ImportNcWalletStep onNextStep={handleOnNextStep} />
                  </Step>
                  <Step label={""} key={1}>
                    <ImportNodeKeysStep
                      onNextStep={handleOnNextStep}
                      onPrevStep={goToPrevStep}
                    />
                  </Step>
                  <Step label={""} key={2}>
                    <SetStakeAmountStep
                      wallet={stakeForm.wallet}
                      importedNodes={stakeForm.nodesToStake}
                      onNextStep={handleOnNextStep}
                      onPrevStep={goToPrevStep}
                    />
                  </Step>
                  <Step label={""} key={3}>
                    <PerformStakeStep stakeForm={stakeForm} />
                  </Step>
                </Steps>
                )
              </CardBody>
            </Card>

            {/* Footer */}
            <Box as="footer" marginBottom="2rem">
              {/* Powered by Nodies */}
              <Box margin="2rem 0" textAlign="center">
                <Text color="#737682" fontFamily="Poppins" fontSize="12px">
                  Powered by
                </Text>
                <Image
                  src="/images/nodies.svg"
                  alt="Nodies"
                  width="95px"
                  height="auto"
                  margin=".5rem auto 0"
                />
              </Box>
              {/* Subfooter */}
              <Box color="white" display="flex" justifyContent="space-between">
                <Text fontSize="12px">
                  &copy; {new Date().getFullYear()} BaaS Pools LLC
                </Text>
                <HStack>
                  <Link href="https://github.com/baaspoolsllc" target="_blank">
                    <Image src="/images/github.svg" alt="github" />
                  </Link>
                  <Link href="https://www.nodies.org/" target="_blank">
                    <Image src="/images/discord.svg" alt="discord" />
                  </Link>
                  <Link href="https://www.nodies.org/" target="_blank">
                    <Image src="/images/twitter.svg" alt="twitter" />
                  </Link>
                </HStack>
              </Box>
            </Box>
          </Container>
        </Flex>
      </Box>
    </>
  );
}
