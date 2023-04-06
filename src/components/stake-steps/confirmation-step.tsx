import { useState } from 'react';
import { stringify } from 'csv-string';
import { ArrowBackIcon, DownloadIcon } from '@chakra-ui/icons'
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

function convertToCsv(data: any) {
    const headers = data[0];
    const rows = data.slice(1);
    const csv = stringify([headers, ...rows]);
    return csv;  
}

function ConfirmationStep({
    stakeForm,
    onNextStep,
    onPrevStep,
}: ConfirmationStepProps) {
    const [csv, setCsv] = useState('');
    const {
        stakeAmount,
        transferAmount,
        customOutputAddress,
    } = stakeForm

    const finishStep = () => {
        onNextStep({
            stakeAmount: stakeAmount,
            transferAmount: transferAmount,
            customOutputAddress: customOutputAddress,
        })
    }

    function handleExport() {
        const tableData = [
            ['Node Alias', 'Node Address'],
            stakeForm.nodesToStake?.map((node) => [node.node_alias, node.address])
        ]
        const csvData = convertToCsv(tableData);
        setCsv(csvData);
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
                    stakeForm.customOutputAddress || stakeForm.wallet?.getAddress()
                }`}
            </Text>

            <Box margin="2rem 0" overflow="scroll" height="300px" overflowY="scroll">
                <TableContainer >
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

            <Flex width="100%" justify="space-between">
                <Button as="a"
                    border="1px solid white"
                    color="white"
                    leftIcon={<DownloadIcon />}
                    marginRight={4}
                    onClick={handleExport}
                    size="lg"
                    variant="outline"
                    href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download="confirm-stake.csv"
                    _hover={{ backgroundColor: 'transparent' }}
                >
                    Export
                </Button>
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
                        Yes, I'm ready to stake
                    </Button>
                </ButtonGroup>
            </Flex>
        </>
    )
}

export default ConfirmationStep