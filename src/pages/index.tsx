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
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { ArrowBackIcon } from "@chakra-ui/icons";

import Step1 from "@/components/steps/step1";
import Step2 from "@/components/steps/step2";
import Step3 from "@/components/steps/step3";
import StakeTable from "@/components/stake-table/StakeTable";

// Content for each step
const steps = [
  {
    label: "",
    content: <Step1 />,
  },
  {
    label: "",
    content: <Step2 />,
  },
  {
    label: "",
    content: <Step3 />,
  },
];

export default function Home() {
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });

  return (
    <>
      <Head>
        <title>Nodies</title>
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
                    Set heading here
                  </Heading>
                </CardHeader>

                {activeStep !== 3 ? (
                  <>
                    {/* Multistep */}
                    <Steps
                      activeStep={activeStep}
                      orientation="horizontal"
                      margin="3rem 0"
                    >
                      {steps.map(({ label, content }, index) => (
                        <Step label={label} key={index}>
                          {content}
                        </Step>
                      ))}
                    </Steps>

                    {/* Next and Back buttons */}
                    <Flex width="100%" justify="flex-end">
                      <Button
                        border="1px solid white"
                        color="white"
                        isDisabled={activeStep === 0}
                        leftIcon={<ArrowBackIcon />}
                        marginRight={4}
                        onClick={prevStep}
                        size="lg"
                        variant="outline"
                        _hover={{ backgroundColor: "transparent" }}
                      >
                        Back
                      </Button>
                      <Button
                        backgroundColor="#5C58FF"
                        onClick={nextStep}
                        size="lg"
                        _hover={{ backgroundColor: "#5C58FF" }}
                      >
                        {activeStep === 2 ? "Start staking!" : "Next"}
                      </Button>
                    </Flex>
                  </>
                ) : (
                  <StakeTable />
                )}
              </CardBody>
            </Card>
          </Container>
        </Flex>
      </Box>
    </>
  );
}
