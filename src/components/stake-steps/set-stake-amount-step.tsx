import {Box, Button, Checkbox, Flex, Input, Text} from "@chakra-ui/react";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {BidirectionalStepProps} from "@/components/stake-steps/step-props";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {PoktProvider} from "@/internal/pokt-rpc/provider";
import {KeyManager} from "@/internal/pocket-js-2.1.1/packages/signer";
import {ImportedNcNode} from "@/internal/pokt-types/imported-nc-node";
import {isHex} from "@/internal/pokt-utils/pokt-validate";
import NDPoktDenomInput from "@/components/nd-input/nd-pokt-input";
import bigDecimal from "js-big-decimal";
import {POKT_DENOM_UNIT, toPokt} from "@/internal/pokt-utils/pokt-denom";

export type SetStakeAmountStepProps =
    { wallet: KeyManager | undefined, importedNodes: ImportedNcNode[] | undefined }
    & BidirectionalStepProps;

export type WalletRetrieveBalanceStatus = "SUCCEEDED" | "FAILED" | "LOADING"

const MIN_POKT_STAKE = new bigDecimal("15000")

function calculateTotalCost(numberOfNodes: number, stakeAmount: bigDecimal, transferAmount: bigDecimal) {
    let txFeeEach = new bigDecimal("0.01")
    if (transferAmount.compareTo(new bigDecimal("0")) > 0) {
        txFeeEach = txFeeEach.add(txFeeEach)
    }
    const txFeeTotal = new bigDecimal(numberOfNodes).multiply(txFeeEach)
    const transferTotal = new bigDecimal(numberOfNodes).multiply(transferAmount)
    const stakeTotal = new bigDecimal(numberOfNodes).multiply(stakeAmount)
    return transferTotal.add(stakeTotal).add(txFeeTotal)
}

function SetStakeAmountStep({onPrevStep, wallet, importedNodes, onNextStep}: SetStakeAmountStepProps) {


    const [ncWalletAddress, setNcWalletAddress] = useState(wallet?.getAddress() || '');
    const [isEnableCustodialAddress, setIsEnableCustodialAddress] = useState(false);
    const [nextStepEnabled, setNextStepEnabled] = useState(false)
    const [walletPoktBalance, setWalletPoktBalance] = useState<bigDecimal>(new bigDecimal("0"))

    const [stakePoktAmount, setStakePoktAmount] = useState<bigDecimal>(new bigDecimal("0"))

    const handleStakePoktChange = (poktAmount: bigDecimal) => {
        setStakePoktAmount(poktAmount);
    }
    const handleTransferPoktChange = (poktAmount: bigDecimal) => {
        setTransferPoktAmount(poktAmount);
    }

    const [transferPoktAmount, setTransferPoktAmount] = useState<bigDecimal>(new bigDecimal("0"))

    const [walletBalanceStatus, setWalletBalanceStatus] = useState<WalletRetrieveBalanceStatus>("LOADING")

    const changeNcWalletAddress = (event: ChangeEvent<HTMLInputElement>) => {
        setNcWalletAddress(event.target.value);
    }

    const numberOfNodes = importedNodes?.length || 0

    useEffect(() => {
        const totalCostPokt = calculateTotalCost(numberOfNodes, stakePoktAmount, transferPoktAmount)
        setNextStepEnabled(ncWalletAddress.length == 40 && isHex(ncWalletAddress) && walletBalanceStatus == "SUCCEEDED" && walletPoktBalance.compareTo(totalCostPokt) >= 0 && stakePoktAmount.compareTo(MIN_POKT_STAKE) >= 0);
    }, [ncWalletAddress, walletBalanceStatus, stakePoktAmount, transferPoktAmount])

    useEffect(() => {
        if (!wallet)
            return;
        PoktProvider.getBalance(wallet.getAddress()).then(r => {
            setWalletBalanceStatus("SUCCEEDED");
            setWalletPoktBalance(toPokt(new bigDecimal(r.toString())))
        }).catch((e) => {
            console.log(e);
            setWalletBalanceStatus("FAILED")
        })
    }, [])

    const finishStep = () => {
        // Checks once again if it's valid NC wallet address & if it doesn't match the existing imported wallet address.
        const customNonCustodialAddress = isEnableCustodialAddress && isHex(ncWalletAddress) && ncWalletAddress.length == 40 && ncWalletAddress != wallet?.getAddress() ? ncWalletAddress : undefined
        onNextStep({
            stakeAmount: stakePoktAmount,
            transferAmount: transferPoktAmount,
            customOutputAddress: customNonCustodialAddress,
        })
    }

    if (!wallet)
        return <></>

    return (
        <Box>
            <Text color="White" fontSize="20px" fontWeight="400">
                Wallet
                Balance: {walletBalanceStatus != "SUCCEEDED" ? walletBalanceStatus : walletPoktBalance.getValue()}
            </Text>
            <Text color="White" fontSize="12px" fontWeight="400">
                Amount of Nodes To Stake: {`${numberOfNodes}`}
            </Text>
            <Text color="White" fontSize="12px" fontWeight="400">
                Total Transfer Amount: {calculateTotalCost(numberOfNodes, stakePoktAmount, transferPoktAmount).getValue()}
            </Text>

            <Box margin="2rem 0">
                <Text color="white" margin="1rem 0">
                    Stake Amount Per Node
                </Text>
                <NDPoktDenomInput defaultPoktValue={new bigDecimal("60005")} minPoktValue={MIN_POKT_STAKE} onChange={handleStakePoktChange}/>

                <Text color="white" margin="1rem 0">
                    Additional Transfer Amount Per Node
                </Text>
                <NDPoktDenomInput defaultPoktValue={new bigDecimal("0")}  minPoktValue={new bigDecimal("0")}onChange={handleTransferPoktChange}/>

                <Text color="white" margin="1rem 0">
                    Non Custodial Address
                </Text>
                <Input
                    value={ncWalletAddress}
                    type="text"
                    onChange={changeNcWalletAddress}
                    disabled={!isEnableCustodialAddress}
                />
                <Checkbox
                    color="white"
                    margin="1rem 0"
                    onChange={() =>
                        setIsEnableCustodialAddress(!isEnableCustodialAddress)
                    }
                >
                    Change Output Address
                </Checkbox>


            </Box>
            <Flex width="100%" justify="flex-end">
                <Button
                    border="1px solid white"
                    color="white"
                    leftIcon={<ArrowBackIcon/>}
                    marginRight={4}
                    onClick={onPrevStep}
                    size="lg"
                    variant="outline"
                    _hover={{backgroundColor: "transparent"}}
                >
                    Back
                </Button>
                <Button
                    backgroundColor="#5C58FF"
                    onClick={finishStep}
                    isDisabled={!nextStepEnabled}
                    size="lg"
                    _hover={{backgroundColor: "#5C58FF"}}
                >
                    {"Next"}
                </Button>
            </Flex>
        </Box>
    );
}

export default SetStakeAmountStep;
