import { Box, Checkbox, Input, Text } from "@chakra-ui/react";
import { useState } from "react";

type SetStakeAmountStepsProps = {
  stakeAmount: string;
  setStakeAmount: React.Dispatch<React.SetStateAction<string>>;
  nodeBalance: string;
  setNodeBalance: React.Dispatch<React.SetStateAction<string>>;
  custodialAddress: string;
  setNonCustodialAddress: React.Dispatch<React.SetStateAction<string>>;
};

function SetStakeAmountStep({
  stakeAmount,
  setStakeAmount,
  nodeBalance,
  setNodeBalance,
  custodialAddress,
  setNonCustodialAddress,
}: SetStakeAmountStepsProps) {
  const [isEnableCustodialAddress, setIsEnableCustodialAddress] =
    useState(false);

  return (
    <Box>
      <Text color="White" fontSize="20px" fontWeight="400">
        Specify the funding amounts
      </Text>

      <Box margin="2rem 0">
        <Text color="white" margin="1rem 0">
          Stake amount
        </Text>
        <Input type="text" />

        <Text color="white" margin="1rem 0">
          Node balance amount
        </Text>
        <Input type="text" />

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
    </Box>
  );
}

export default SetStakeAmountStep;
