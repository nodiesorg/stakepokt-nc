import { ArrowBackIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react'
import { StakeForm } from './stake-form'
import { BidirectionalStepProps } from './step-props'

type ConfirmationStepProps = {
    stakeForm: StakeForm
} & BidirectionalStepProps

function ConfirmationStep({
    stakeForm,
    onNextStep,
    onPrevStep,
}: ConfirmationStepProps) {
    const { stakeAmount, transferAmount, customOutputAddress } = stakeForm

    const finishStep = () => {
        onNextStep({
            stakeAmount: stakeAmount,
            transferAmount: transferAmount,
            customOutputAddress: customOutputAddress,
        })
    }

    return (
        <>
            <Text color="white" margin="1rem 0">
                {`Stake Amount Per Node: ${stakeForm.stakeAmount?.getValue()}`}
            </Text>
            <Text color="white" margin="1rem 0">
                {`Nodes to Stake: ${stakeForm.nodesToStake?.length}`}
            </Text>
            <Text color="white" margin="1rem 0">
                {`Additional Transfer Amount Per Node: ${stakeForm.transferAmount?.getValue()}`}
            </Text>
            <Text color="white" margin="1rem 0">
                {`Non Custodial Address: ${
                    stakeForm.customOutputAddress ||
                    stakeForm.wallet?.getAddress()
                }`}
            </Text>

            <Box
                margin="2rem 0"
                height="300px"
                overflowY="scroll"
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '7px',
                        borderRadius: '5px',
                        backgroundColor: '#202436',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        borderRadius: '5px',
                        backgroundColor: '#B9B6D7',
                    },
                    '&::-webkit-scrollbar:horizontal': {
                        display: 'none',
                    },
                }}
            >
                <TableContainer>
                    <Table
                        sx={{
                            tableLayout: 'fixed',
                            whiteSpace: 'normal',
                            td: {
                                wordWrap: 'break-word',
                                wordBreak: 'break-all',
                            },
                        }}
                        variant="simple"
                    >
                        <Thead>
                            <Tr>
                                <Th>Node Alias</Th>
                                <Th>Node Address</Th>
                            </Tr>
                        </Thead>
                        <Tbody color="white">
                            {stakeForm.nodesToStake?.map((node) => {
                                return (
                                    <Tr key={node.node_alias}>
                                        <Td>{node.node_alias}</Td>
                                        <Td>{node.address}</Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>

            <Flex width="100%" justify="flex-end">
                <ButtonGroup>
                    <Button
                        border="1px solid white"
                        color="white"
                        leftIcon={<ArrowBackIcon />}
                        marginRight={4}
                        onClick={onPrevStep}
                        size="lg"
                        variant="outline"
                        _hover={{ backgroundColor: 'transparent' }}
                    >
                        Back
                    </Button>
                    <Button
                        backgroundColor="#5C58FF"
                        onClick={finishStep}
                        size="lg"
                        _hover={{ backgroundColor: '#5C58FF' }}
                    >
                        {`Yes, I'm ready to stake`}
                    </Button>
                </ButtonGroup>
            </Flex>
        </>
    )
}

export default ConfirmationStep
