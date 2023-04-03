import {
    Box,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react'
import { StakeForm } from '@/components/stake-steps/stake-form'
import { useEffect, useState } from 'react'
import { isHex } from '@/internal/pokt-utils/pokt-validate'
import { getTransactionBuilder } from '@/internal/pokt-rpc/provider'
import { toUPokt } from '@/internal/pokt-utils/pokt-denom'
import bigDecimal from 'js-big-decimal'
import { ImportedNcNode } from '@/internal/pokt-types/imported-nc-node'
import {
    StakableNode,
    TxMsgNamed,
    TxMsgResult,
} from '@/internal/pokt-types/stakable-node'

const DEFAULT_CHAINS = ['0001']
const DEFAULT_DOMAIN = new URL('https://parked.com')

type PerformStakeStepProps = {
    stakeForm: StakeForm
}

type StakeResult = {
    node: ImportedNcNode
    results: TxMsgResult[]
}

type StakeResultItemProps = {
    stakeResults: StakeResult
}

function StakeResultItem({ stakeResults }: StakeResultItemProps) {
    const { node, results } = stakeResults
    const sendTx = results.find((s) => s.txMsgNamed.name === 'send')
    const stakeTx = results.find((s) => s.txMsgNamed.name === 'stake')

    return (
        <Tr>
            <Td>{node.node_alias}</Td>
            <Td>{node.address}</Td>
            <Td>{!stakeTx ? 'Stake TX Pending' : stakeTx.result}</Td>
            <Td>
                {results.length == 1
                    ? 'N/A'
                    : !sendTx
                    ? 'Send TX Pending'
                    : sendTx.result}
            </Td>
        </Tr>
    )
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
    const [stakeResults, setStakeResults] = useState<StakeResult[]>(
        stakableNodes.map((s) => ({
            node: s.node,
            results: [],
        }))
    )

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
                            {stakeResults.map((r, i) => (
                                <StakeResultItem stakeResults={r} key={i} />
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

export default PerformStakeStep
