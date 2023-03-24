import { Box, Checkbox, Input, Text } from "@chakra-ui/react";
import { useState } from "react";

function Step3() {
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

export default Step3;
