import { useEffect, useState } from 'react'
import { stringify } from 'csv-string';
import { StakeForm } from '@/components/stake-steps/stake-form'
import { getTransactionBuilder } from '@/internal/pokt-rpc/provider'
import { ImportedNcNode } from '@/internal/pokt-types/imported-nc-node'
import {
    StakableNode,
    TxMsgNamed,
    TxMsgResult,
} from '@/internal/pokt-types/stakable-node'
import { toUPokt } from '@/internal/pokt-utils/pokt-denom'
import { isHex } from '@/internal/pokt-utils/pokt-validate'
import { DownloadIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Flex,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react'
import bigDecimal from 'js-big-decimal'

const DEFAULT_CHAINS = ['0001']
const DEFAULT_DOMAIN = new URL('https://parked.com')

type PerformStakeStepProps = {
    stakeForm: StakeForm
}

type StakeResult = {
    node: ImportedNcNode
    results: TxMsgResult[]
}

function convertToCsv(data: any) {
    const headers = data[0];
    const rows = data.slice(1);
    const csv = stringify([headers, ...rows]);
    return csv;  
}

function generateStakableNodes(stakeForm: StakeForm): StakableNode[] {
    const {
        stakeAmount,
        transferAmount,
        nodesToStake,
        customOutputAddress,
        wallet,
    } = stakeForm

    if (
        !wallet ||
        !stakeAmount ||
        !transferAmount ||
        !nodesToStake ||
        nodesToStake.length == 0 ||
        (customOutputAddress &&
            (customOutputAddress.length != 40 || !isHex(customOutputAddress)))
    ) {
        // TODO: Show something went wrong here
        return []
    }

    const tb = getTransactionBuilder(wallet)
    const outputAddress = customOutputAddress || wallet.getAddress()
    const transferAmountUPokt = toUPokt(transferAmount)
    const stakeAmountUPokt = toUPokt(stakeAmount)

    return nodesToStake.map((w) => {
        let txMsgs: TxMsgNamed[] = []
        // Check if there is a send tx
        if (transferAmountUPokt.compareTo(new bigDecimal('0')) > 0) {
            txMsgs.push({
                name: 'send',
                txMsg: tb.send({
                    amount: transferAmountUPokt.getValue(),
                    toAddress: w.address,
                }),
            })
        }

        txMsgs.push({
            name: 'stake',
            txMsg: tb.nodeStake({
                nodePubKey: w.pub_key,
                chains:
                    w.chains != undefined && w.chains.length > 0
                        ? w.chains
                        : DEFAULT_CHAINS,
                serviceURL:
                    w.domain != undefined ? new URL(w.domain) : DEFAULT_DOMAIN,
                amount: stakeAmountUPokt.getValue(),
                outputAddress,
            }),
        })
        // Create a mapping to node -> stake/transfer tx
        return new StakableNode(tb, w, txMsgs)
    })
}

function PerformStakeStep({ stakeForm }: PerformStakeStepProps) {
    const stakableNodes = generateStakableNodes(stakeForm)
    const [csv, setCsv] = useState('');
    const [stakeResults, setStakeResults] = useState<StakeResult[]>(
        stakableNodes.map((s) => ({
            node: s.node,
            results: [],
        }))
    )
    const tableData = [['Node Alias', 'Node Address', 'Stake TX Hash', 'Transfer TX Hash']]

    async function handleStake() {
        if (stakableNodes.length == 0) {
            return
        }
        for (const node of stakableNodes) {
            const results = await node.performStakeAndTransfer()
            setStakeResults((prevState) => {
                const copy = [...prevState]
                const nodeCopy = copy.find((s) => s.node == node.node)
                if (!nodeCopy) return copy
                nodeCopy.results = results
                return copy
            })
        }
    }

    useEffect(() => {
        handleStake()
    }, [])

    function handleExport() {
        const csvData = convertToCsv(tableData);
        setCsv(csvData);
    }

    return (
        <Box>
            <Box margin="2rem 0">
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
                                <Th>Stake TX Hash</Th>
                                <Th>Transfer TX Hash</Th>
                            </Tr>
                        </Thead>
                        <Tbody color="white">
                            {stakeResults.map((result, i) => {
                                    const { node, results } = result;
                                    const sendTx = results.find((s) => s.txMsgNamed.name === 'send')
                                    const stakeTx = results.find((s) => s.txMsgNamed.name === 'stake')
                                    const stakeTxData = !stakeTx ? 'Stake TX Pending' : stakeTx.result;
                                    const sentTxData = results.length == 1 ? 'N/A' : !sendTx ? 'Send TX Pending' : sendTx.result

                                    tableData.push([node.node_alias, node.address, stakeTxData, sentTxData])

                                    return (
                                        <Tr key={i}>
                                            <Td>{node.node_alias}</Td>
                                            <Td>{node.address}</Td>
                                            <Td>{stakeTxData}</Td>
                                            <Td>{sentTxData}</Td>
                                        </Tr>
                                    )
                                }
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>

            <Flex width="100%" justify="flex-end">
                <Button as="a"
                    border="1px solid white"
                    color="white"
                    leftIcon={<DownloadIcon />}
                    marginRight={4}
                    onClick={handleExport}
                    size="lg"
                    variant="outline"
                    href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download="staking-results.csv"
                    _hover={{ backgroundColor: 'transparent' }}
                >
                    Export
                </Button>
            </Flex>
        </Box>
    )
}

export default PerformStakeStep
