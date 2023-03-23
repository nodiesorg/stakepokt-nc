import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

function Step4() {
  return (
    <Box>
      <Text color="White" fontSize="20px" fontWeight="400">
        Staking progress
      </Text>

      <Box margin="2rem 0">
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th>Staked tx sent</Th>
                <Th>Balance tx sent</Th>
              </Tr>
            </Thead>
            <Tbody color="White">
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td>25.4</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Step4;
