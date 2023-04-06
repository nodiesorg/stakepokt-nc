import { QuestionOutlineIcon } from '@chakra-ui/icons'
import {
    Button,
    CardBody,
    CardHeader,
    Checkbox,
    Flex,
    Heading,
    HStack,
    Icon,
    Text,
    Tooltip,
} from '@chakra-ui/react'
import { ChangeEvent, useEffect, useState } from 'react'

import { downloadFile } from '@/internal/local-downloader/downloader'
import { KeyManager } from '@/internal/pocket-js-2.1.1/packages/signer'
import { PrivateNcNode } from '@/internal/pokt-types/imported-nc-node'
import NdInput from '../nd-input/nd-input'

const INTEGER_ONLY_REGEX = /^\d+$/
const CUSTOMER_DEFAULT_ALIAS = 'customer'

function GenerateNodeForm() {
    const [formComplete, setFormComplete] = useState(false)
    const [isEnableChains, setIsEnableChains] = useState(false)

    const [customerAlias, setCustomerAlias] = useState<string>('')

    const [nodesCountText, setNodeCountText] = useState<string>('1')
    const [nodesCountErr, setNodesCountErr] = useState<string | null>(null)

    const [chainsText, setChainsText] = useState('0001')
    const [chainsTextErr, setChainsTextErr] = useState<string | null>(null)

    const handleChainsInput = (event: ChangeEvent<HTMLInputElement>) => {
        setChainsText(event.target.value)
    }

    const handleFormSubmission = async () => {
        const nodes = []
        for (let i = 0; i < parseInt(nodesCountText); i++) {
            nodes.push(await KeyManager.createRandom())
        }

        const aliasOrDefault =
            customerAlias.length > 0 ? customerAlias : CUSTOMER_DEFAULT_ALIAS

        let publicNodesCsvData = 'alias,pubKey,address,domain,chains'
        nodes.forEach(
            (s: KeyManager, i) =>
                (publicNodesCsvData += `\n${aliasOrDefault}-${i},${s.getPublicKey()},${s.getAddress()},,"${chainsText}"`)
        )

        let privateNodes: PrivateNcNode[] = nodes.map((s, i) => ({
            priv_key: s.getPrivateKey(),
            node_alias: `${aliasOrDefault}-${i}`,
            address: s.getAddress(),
            pub_key: s.getPublicKey(),
        }))

        const fileToSavePrefix = `${customerAlias}_${nodesCountText}`
        downloadFile({
            data: JSON.stringify(privateNodes, null, 4),
            fileName: `${fileToSavePrefix}_private_do_not_distribute.json`,
            mimeType: 'text/json',
        })

        downloadFile({
            data: publicNodesCsvData,
            fileName: `${fileToSavePrefix}_public.csv`,
            mimeType: 'text/csv',
        })
    }

    const handleNodeCount = (event: ChangeEvent<HTMLInputElement>) => {
        const inputString = event.target.value
        if (inputString.length > 0 && !INTEGER_ONLY_REGEX.test(inputString))
            return
        setNodeCountText(inputString)
    }

    useEffect(() => {
        const chains = chainsText.split(',')
        if (chains.length == 0 && chainsText.length > 1) {
            setChainsTextErr(`Add at least one chain (i.e 0001)`)
            return
        }
        const invalidChain = chains.find((s) => s.length != 4)
        if (invalidChain) {
            setChainsTextErr(`Invalid Chain ${invalidChain}`)
            return
        }
        setChainsTextErr(null)
    }, [chainsText])

    useEffect(() => {
        if (nodesCountText !== '0') {
            setNodesCountErr(null)
            return
        }
        setNodesCountErr('Node count must be more than zero')
    }, [nodesCountText])

    useEffect(() => {
        setFormComplete(
            nodesCountText.length > 0 &&
                chainsText.length > 0 &&
                nodesCountErr == null &&
                chainsTextErr == null
        )
    }, [nodesCountText, chainsText, chainsTextErr, nodesCountErr])

    return (
        <CardBody>
            <CardHeader>
                <Heading
                    color="white"
                    fontFamily="Poppins"
                    fontSize="24px"
                    fontWeight={500}
                    textAlign="center"
                >
                    Node Operator Keygen Tool
                </Heading>
            </CardHeader>

            <HStack>
                <Text color="white" margin="1rem 0">
                    Enter customer name
                </Text>
                <Tooltip
                    label="This will prefix your nodes with the specified alias."
                    fontSize="md"
                    closeOnClick={false}
                >
                    <span>
                        <Icon as={QuestionOutlineIcon} color="white" />
                    </span>
                </Tooltip>
            </HStack>
            <NdInput
                onChange={(e) => setCustomerAlias(e.target.value)}
                type="text"
            />

            <HStack>
                <Text color="white" margin="1rem 0">
                    Enter number of nodes to generate
                </Text>
                <Tooltip
                    label="This is the amount of nodes that you will operate for your client"
                    fontSize="md"
                    closeOnClick={false}
                >
                    <span>
                        <Icon as={QuestionOutlineIcon} color="white" />
                    </span>
                </Tooltip>
            </HStack>
            <NdInput
                value={nodesCountText}
                errorMessage={nodesCountErr}
                onChange={handleNodeCount}
                type="text"
            />

            {/* Enter the chains */}
            <HStack>
                <Text color="white" margin="1rem 0">
                    Enter the chains
                </Text>
                <Tooltip
                    label="This is the chains that will be staked for your client. This is optional and you can change it later with another stake tx."
                    fontSize="md"
                    closeOnClick={false}
                >
                    <span>
                        <Icon as={QuestionOutlineIcon} color="white" />
                    </span>
                </Tooltip>
            </HStack>
            <NdInput
                onChange={handleChainsInput}
                type="text"
                errorMessage={chainsTextErr}
                value={chainsText}
                isDisabled={!isEnableChains}
            />
            <Checkbox
                color="white"
                margin="1rem 0"
                onChange={() => setIsEnableChains(!isEnableChains)}
            >
                Change chains
            </Checkbox>

            {/* Generate node button */}
            <Flex width="100%" justify="flex-end" marginY="2rem">
                <Button
                    isDisabled={!formComplete}
                    backgroundColor="#5C58FF"
                    onClick={handleFormSubmission}
                    size="lg"
                    _hover={{ backgroundColor: '#5C58FF' }}
                >
                    Generate Nodes
                </Button>
            </Flex>
        </CardBody>
    )
}

export default GenerateNodeForm
