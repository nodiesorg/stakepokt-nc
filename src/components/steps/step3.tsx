import { Box, Checkbox, Input, Text } from "@chakra-ui/react";

function Step3() {
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

        <Checkbox margin="1rem 0" color="White">
          Output address
        </Checkbox>
      </Box>
    </Box>
  );
}

export default Step3;
