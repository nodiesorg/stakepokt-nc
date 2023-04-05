import {
    Box,
    Button,
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
    form: StakeForm
} & BidirectionalStepProps

function ConfirmationStep({
    form,
    onNextStep,
    onPrevStep,
}: ConfirmationStepProps) {
    const finishStep = () => {}

    return (
        <>
            <Text color="white" margin="1rem 0">
                {`Stake Amount Per Node: ${form.stakeAmount?.getValue()}`}
            </Text>
            <Text color="white" margin="1rem 0">
                {`Nodes to Stake: ${form.nodesToStake?.length}`}
            </Text>
            <Text color="white" margin="1rem 0">
                {`Additional Transfer Amount Per Node: ${form.transferAmount?.getValue()}`}
            </Text>
            <Text color="white" margin="1rem 0">
                {`Non Custodial Address: Test: ${
                    form.customOutputAddress || form.wallet?.getAddress()
                }`}
            </Text>

            <Box margin="2rem 0" overflow="scroll" maxH="500px">
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
                            <Tr>
                                <Td>gMZmZHXWNzD8hpKfue3ik5KG</Td>
                                <Td>gMZmZHXWNzD8hpKfue3ik5KG</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>

            <Flex width="100%" justify="flex-end">
                <Button
                    backgroundColor="#5C58FF"
                    onClick={finishStep}
                    size="lg"
                    _hover={{ backgroundColor: '#5C58FF' }}
                >
                    Next
                </Button>
            </Flex>
        </>
    )
}

export default ConfirmationStep
