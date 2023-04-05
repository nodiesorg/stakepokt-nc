import { ArrowBackIcon } from '@chakra-ui/icons'
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
    console.log('form', form)
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
                {`Non Custodial Address: ${
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
                            {form.nodesToStake?.map((node) => {
                                return (
                                    <Tr key={node.node_alias} >
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
                    Yes, I'm ready to stake
                </Button>
            </Flex>
        </>
    )
}

export default ConfirmationStep
