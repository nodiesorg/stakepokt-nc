import {Box, Button, Checkbox, Flex, Input, Text} from "@chakra-ui/react";
import {ChangeEvent, useEffect, useState} from "react";
import {BidirectionalStepProps} from "@/components/stake-steps/step-props";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {KeyManager} from "@pokt-foundation/pocketjs-signer";
import {PoktProvider} from "@/internal/pokt-rpc/provider";

export type SetStakeAmountStepProps = { wallet: KeyManager | undefined } & BidirectionalStepProps;

export type WalletRetrieveBalanceStatus = "SUCCEEDED" | "FAILED" | "LOADING"

function SetStakeAmountStep({onPrevStep, wallet, onNextStep}: SetStakeAmountStepProps) {


    const [ncWalletAddress, setNcWalletAddress] = useState(wallet?.getAddress() || '');
    const [isEnableCustodialAddress, setIsEnableCustodialAddress] = useState(false);
    const [nextStepEnabled, setNextStepEnabled] = useState(false)
    const [walletBalance, setWalletBalance] = useState<BigInt>(BigInt("0"))
    const [walletBalanceStatus, setWalletBalanceStatus] = useState<WalletRetrieveBalanceStatus>("LOADING")

    const changeNcWalletAddress = (event: ChangeEvent<HTMLInputElement>) => {
        setNcWalletAddress(event.target.value);
    }

    useEffect(() => {
        // TODO: Add validation for inputs
        setNextStepEnabled(ncWalletAddress.length == 40 && walletBalanceStatus == "SUCCEEDED");
    }, [ncWalletAddress, walletBalanceStatus])

    useEffect(() => {
        if (!wallet)
            return;
        PoktProvider.getBalance(wallet.getAddress()).then(r => {
            setWalletBalanceStatus("SUCCEEDED");
            setWalletBalance(r)
        }).catch(() => setWalletBalanceStatus("FAILED"))
    }, [])

    const finishStep = () => {
        onNextStep({})
    }


    if (!wallet)
        return <></>

    return (
        <Box>
            <Text color="White" fontSize="20px" fontWeight="400">
                Wallet Balance: {walletBalanceStatus != "SUCCEEDED" ? walletBalanceStatus : walletBalance.toString()}
            </Text>

            <Box margin="2rem 0">
                <Text color="white" margin="1rem 0">
                    Stake Amount Each
                </Text>
                <Input type="text" value={"60005"}/>

                <Text color="white" margin="1rem 0">
                    Additional Transfer Amount Each (i.e: Paying TX Fees)
                </Text>
                <Input type="text" value={"0.01"}/>

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
                <Text color="White" fontSize="12px" fontWeight="400">
                    Amount of Nodes To Stake: {"10 POKT"}
                </Text>
                <Text color="White" fontSize="12px" fontWeight="400">
                    Total Transfer Amount: {"10 POKT"}
                </Text>

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
