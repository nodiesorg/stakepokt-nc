import { useState } from 'react'

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Card,
    Container,
    Flex,
    Heading,
    HStack,
    Image,
    Link,
    Text,
} from '@chakra-ui/react'
import Head from 'next/head'

import { useSteps } from 'chakra-ui-steps'

import GenerateNodeForm from '@/components/forms/generate-node'
import StakeNodeForm from '@/components/forms/stake-node'
import fsPromises from 'fs/promises'
import { GetStaticProps } from 'next'
import path from 'path'

enum Form {
    STAKE_NODES = 'STAKE_NODES',
    GENERATE_NODES = 'GENERATE_NODES',
}

type HowToUseProps = {
    question: string
    answer: string
}[]

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

export default function Home({ data }: { data: HowToUseProps }) {
    const [form, setForm] = useState<Form | undefined>(Form.STAKE_NODES)
    const {
        nextStep: goToNextStep,
        prevStep: goToPrevStep,
        activeStep,
    } = useSteps({
        initialStep: 0,
    })

    return (
        <>
            <Head>
                <title>StakePokt - Non Custodial Staking Tool</title>
                <meta
                    name="description"
                    content="A tool inspired to make your life easier by performing bulk non-custodial stakes with minimal effort for both node operators and stakers."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <Box as="main" minHeight="100vh">
                <Flex
                    backgroundColor="#1B1E30"
                    padding="1rem 2rem"
                    justifyContent="flex-end"
                >
                    <HStack color="white" padding=".5rem 1rem" spacing={5}>
                        <Link
                            onClick={() => {
                                // is on last step of form then reload the page to reset state(s)
                                if (activeStep == stepMetadata.length - 1)
                                    window.location.reload()
                                else setForm(Form.STAKE_NODES)
                            }}
                        >
                            Stake Nodes
                        </Link>
                        <Link
                            onClick={() => {
                                // user was on an unknown state, so need to restart
                                if (activeStep != 0) window.location.reload()
                                else setForm(Form.GENERATE_NODES)
                            }}
                        >
                            Generate Nodes
                        </Link>
                        <Link onClick={() => setForm(undefined)}>
                            How to use
                        </Link>
                    </HStack>
                </Flex>

                <Flex minHeight="100vh">
                    <Container
                        maxWidth={
                            activeStep === stepMetadata.length - 1 ||
                            activeStep === 3
                                ? '5xl'
                                : '3xl'
                        }
                        height="100%"
                        padding="2rem"
                    >
                        {/* Multistep card */}
                        {form !== undefined ? (
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
                        ) : (
                            <Box color="white" minH="600px">
                                <Heading marginBottom={10} textAlign="center">
                                    How to use?
                                </Heading>
                                <Accordion w="full" allowToggle>
                                    {data.map(({ question, answer }, i) => (
                                        <AccordionItem
                                            key={i}
                                            color="Gray1"
                                            borderColor="#1b1e30"
                                        >
                                            <AccordionButton
                                                _focus={{
                                                    boxShadow:
                                                        'none !important',
                                                }}
                                                fontSize="18px"
                                                py={5}
                                            >
                                                <Box flex="1" textAlign="left">
                                                    {question}
                                                </Box>
                                                <AccordionIcon
                                                    color="#515676"
                                                    fontSize="30px"
                                                />
                                            </AccordionButton>
                                            <AccordionPanel
                                                bg="DarkGray1"
                                                color="Gray1"
                                                p={10}
                                            >
                                                {answer}
                                            </AccordionPanel>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </Box>
                        )}

                        {/* Footer */}
                        <Box as="footer">
                            {/* Powered by Nodies */}
                            <Box margin="2rem 0" textAlign="center">
                                <Text
                                    color="#737682"
                                    fontFamily="Poppins"
                                    fontSize="12px"
                                >
                                    Created by
                                </Text>
                                <Link href="https://nodies.org" target="_blank">
                                    <Image
                                        src="/images/nodies.svg"
                                        alt="Nodies"
                                        width="95px"
                                        height="auto"
                                        margin=".5rem auto 0"
                                    />
                                </Link>
                            </Box>
                            {/* Subfooter */}
                            <Box
                                color="white"
                                display="flex"
                                justifyContent="space-between"
                            >
                                <Text fontSize="12px">
                                    &copy; {new Date().getFullYear()} BaaS Pools
                                    LLC
                                </Text>
                                <HStack>
                                    <Link
                                        href="https://github.com/baaspoolsllc"
                                        target="_blank"
                                    >
                                        <Image
                                            src="/images/github.svg"
                                            alt="github"
                                        />
                                    </Link>
                                    <Link
                                        href="https://discord.gg/pokt"
                                        target="_blank"
                                    >
                                        <Image
                                            src="/images/discord.svg"
                                            alt="discord"
                                        />
                                    </Link>
                                    <Link
                                        href="https://twitter.com/PoktFund"
                                        target="_blank"
                                    >
                                        <Image
                                            src="/images/twitter.svg"
                                            alt="twitter"
                                        />
                                    </Link>
                                </HStack>
                            </Box>
                        </Box>
                    </Container>
                </Flex>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const filePath = path.join(process.cwd(), 'src/data/guide.json')
    const jsonData = await (await fsPromises.readFile(filePath)).toString()
    const objectData = JSON.parse(jsonData)

    return {
        props: {
            data: objectData,
        },
    }
}
