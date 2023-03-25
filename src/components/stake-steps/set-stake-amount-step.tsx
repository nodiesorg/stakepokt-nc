import {Box, Button, Checkbox, Flex, Input, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {BidirectionalStepProps} from "@/components/stake-steps/step-props";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {KeyManager} from "@pokt-foundation/pocketjs-signer";

export type SetStakeAmountStepProps = {} & BidirectionalStepProps;

function SetStakeAmountStep({onPrevStep, onNextStep}: SetStakeAmountStepProps) {
    const [isEnableCustodialAddress, setIsEnableCustodialAddress] =
        useState(false);
    const [nextStepEnabled, setNextStepEnabled] = useState(false)

    useEffect(() => {
        // TODO: Add validation for inputs
        setNextStepEnabled(true);
    }, [])

    const finishStep = () => {
        onNextStep({})
    }

    return (
        <Box>
            <Text color="White" fontSize="20px" fontWeight="400">
                Specify the funding amounts
            </Text>

            <Box margin="2rem 0">
                <Text color="white" margin="1rem 0">
                    Stake amount
                </Text>
                <Input type="text"/>

                <Text color="white" margin="1rem 0">
                    Node balance amount
                </Text>
                <Input type="text"/>

                <Text color="white" margin="1rem 0">
                    Non Custodial Address
                </Text>
                <Input
                    type="text"
                    disabled={!isEnableCustodialAddress}
                    placeholder="888260190301f98da2ce1eed5c08c0699be1142f"
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
