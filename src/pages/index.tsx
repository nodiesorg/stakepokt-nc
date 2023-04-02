import { useState } from "react";

import Head from "next/head";
import {
  Box,
  Card,
  Container,
  Flex,
  HStack,
  Image,
  Text,
  Link,
} from "@chakra-ui/react";

import { useSteps } from "chakra-ui-steps";

import StakeNodeForm from "@/components/forms/stake-node";
import GenerateNodeForm from "@/components/forms/generate-node";

enum Form {
  STAKE_NODES = "STAKE_NODES",
  GENERATE_NODES ="GENERATE_NODES"
};

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
  const [form, setForm] = useState<Form>(Form.STAKE_NODES);
  const {
    nextStep: goToNextStep,
    prevStep: goToPrevStep,
    activeStep,
  } = useSteps({
    initialStep: 0,
  });

  return (
    <>
      <Head>
        <title>Nodies - Non Custodial Staking Tool</title>
        <meta name="description" content="A tool inspired to make your life easier by performing bulk non-custodial stakes with minimal effort for both node operators and stakers." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {/* Nav */}
      <Box as="main" minHeight="100vh">
        <Flex
          backgroundColor="#1B1E30"
          padding="1rem 2rem"
          justifyContent="flex-end"
        >
          <HStack color="white" padding=".5rem 1rem" spacing={5}>
            <Link onClick={() => setForm(Form.STAKE_NODES)}>Stake Nodes</Link>
            <Link onClick={() => setForm(Form.GENERATE_NODES)}>Generate Nodes</Link>
          </HStack>
        </Flex>
        <Flex minHeight="100vh">
          <Container
            maxWidth={activeStep === stepMetadata.length - 1 ? "5xl" : "3xl"}
            height="100%"
            padding="2rem"
          >
            {/* Multistep card */}
            <Card backgroundColor="#1B1E30">
              {form === Form.STAKE_NODES ? (
                <StakeNodeForm
                  activeStep={activeStep}
                  goToNextStep={goToNextStep}
                  goToPrevStep={goToPrevStep}
                />
              ) : (
                <GenerateNodeForm />
              )}
            </Card>

            {/* Footer */}
            <Box as="footer">
              {/* Powered by Nodies */}
              <Box margin="2rem 0" textAlign="center">
                <Text color="#737682" fontFamily="Poppins" fontSize="12px">
                  Created by
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
