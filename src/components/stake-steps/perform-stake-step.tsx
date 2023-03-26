import {
    Box,
    Table,
    Text,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import {StakeForm} from "@/components/stake-steps/stake-form";
import {useEffect, useState} from "react";
import {isHex} from "@/internal/pokt-utils/pokt-validate";
import {getTransactionBuilder} from "@/internal/pokt-rpc/provider";
import {toUPokt} from "@/internal/pokt-utils/pokt-denom";
import bigDecimal from "js-big-decimal";
import {ImportedNcNode} from "@/internal/pokt-types/imported-nc-node";
import {TransactionBuilder, TxMsg} from "@/internal/pocket-js-2.1.1/packages/transaction-builder";
import {TransactionResponse} from "@/internal/pocket-js-2.1.1/packages/types/src";


// TODO: Make this scalable with json object
type PerformStakeStepProps = {
    stakeForm: StakeForm
}

type NodeAliasTxsResultsPair = {
    nodeAlias: string,
    txs: NodeTxResultPair[]
}

type StakeResultProps = {
    nodeAliasTxMap: NodeAliasTxsResultsPair
}


type NodeTxResultPair = {
    node: ImportedNcNode
    results?: TransactionResponse
    error?: any
    type: string;
}


type TxType = "send" | "stake";

type TxMsgDetailed = {
    txMsg: TxMsg
    type: TxType;
}

function StakeResult({nodeAliasTxMap}: StakeResultProps) {


    const sendTx = nodeAliasTxMap.txs.find(s => s.type == "send")
    const stakeTx = nodeAliasTxMap.txs.find(s => s.type == "stake")

    return (
        <Tr>
            <Td>{nodeAliasTxMap.nodeAlias}</Td>
            <Td>r</Td>
            <Td>
                {!stakeTx ? "Can't find Stake TX" : (stakeTx?.error ? JSON.stringify(stakeTx.error) : (stakeTx.results?.txHash || 'Could not determine TX Hash'))}
            </Td>
            <Td>
                {!sendTx ? "N/A" : (sendTx?.error ? JSON.stringify(sendTx.error) : (sendTx.results?.txHash || 'Could not determine TX Hash'))}
            </Td>
        </Tr>
    )
}

async function stubSubmit ({txMsg: TxMsg}: any) {
    return {
        logs: "123",
    } as TransactionResponse
}

function submitTxNodePair(node: ImportedNcNode, tb: TransactionBuilder, txMsgs: TxMsgDetailed[]) {
    const pairTxSubmit = txMsgs.map((tx) => stubSubmit({txMsg: tx.txMsg}).then((r: TransactionResponse) => ({
        node: node,
        type: tx.type,
        result: r
    } as NodeTxResultPair)).catch(e => ({node: node, error: e, type: tx.type} as NodeTxResultPair)))
    return pairTxSubmit;
}

function PerformStakeStep({stakeForm}: PerformStakeStepProps) {

    const [stakeResults, setStakeResults] = useState<NodeAliasTxsResultsPair[]>([])

    async function handleStake() {
        const {stakeAmount, transferAmount, nodesToStake, customOutputAddress, wallet} = stakeForm

        if (!wallet || !stakeAmount || !transferAmount || !nodesToStake || nodesToStake.length == 0 || customOutputAddress && (customOutputAddress.length != 40 || !isHex(customOutputAddress))) {
            // TODO: Show something went wrong here
            return;
        }

        const tb = getTransactionBuilder(wallet)
        const outputAddress = customOutputAddress || wallet.getAddress()
        const transferAmountUPokt = toUPokt(transferAmount)
        const stakeAmountUPokt = toUPokt(transferAmount)

        const txMsgsPair = nodesToStake.map(w => {
            let sendTxMsg;

            // Check if there is a send tx
            if (transferAmountUPokt.compareTo(new bigDecimal("0")) > 0) {
                sendTxMsg = tb.send({
                    amount: transferAmountUPokt.getValue(),
                    toAddress: w.address,
                });
            }
            const stakeTxMsg = tb.nodeStake({
                nodePubKey: w.publicKey,
                chains: w.chains != undefined && w.chains.length > 0 ? w.chains : ["0001"],
                serviceURL: w.domain != undefined ? new URL(w.domain) : new URL('https://parked.com'),
                amount: stakeAmountUPokt.getValue(),
                outputAddress: outputAddress,
            })

            // Create a mapping to node -> stake/transfer tx
            return {
                node: w,
                txMsgs: [
                    {txMsg: stakeTxMsg, type: "stake"} as TxMsgDetailed,
                    {txMsg: stakeTxMsg, type: "send"} as TxMsgDetailed,
                ]
            }
        })

        const PARALLEL_TASKS = 10;
        for (let i = 0; i < txMsgsPair.length;) {
            let promises = [];
            for (let j = 0; j < PARALLEL_TASKS && i < txMsgsPair.length; i++, j++) {
                const node = txMsgsPair[i].node;
                const txMsgs = txMsgsPair[i].txMsgs
                promises.push(...submitTxNodePair(node, tb, txMsgs));
            }
            const result = await Promise.all(promises);
            setStakeResults((prevState) => {
                return [...prevState, {nodeAlias: result[0].node.nodeAlias, txs: result}]
            })
        }
    }

    useEffect(() => {
        handleStake();
    }, [])

    return (
        <Box>
            <Box margin="2rem 0">
                <TableContainer>
                    <Table
                        sx={{
                            tableLayout: "fixed",
                            whiteSpace: "normal",
                            td: {
                                wordWrap: "break-word",
                                wordBreak: "break-all",
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
                            {stakeResults.map((r, i) =>
                                (<StakeResult nodeAliasTxMap={r} key={i}/>)
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default PerformStakeStep;
