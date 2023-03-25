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

type StakeTableProps = {
  passphrase: string;
  keyfile: any; // Apply proper typing
  csv: any; // Apply proper typing
  stakeAmount: string;
  nodeBalance: string;
  custodialAddress: string;
};

function StakeTable({
  passphrase,
  keyfile,
  csv,
  stakeAmount,
  nodeBalance,
  custodialAddress,
}: StakeTableProps) {
  console.log({
    passphrase,
    keyfile,
    csv,
    stakeAmount,
    nodeBalance,
    custodialAddress,
  });

  return (
    <Box>
      <Text color="white" fontSize="20px" fontWeight="400" textAlign="center">
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
            <Tbody color="white">
              <Tr>
                <Td>888260190301f98da2ce1eed5c08c0699be1142f</Td>
                <Td>
                  3E79368397C97DABD6DDA2D418AF7A022C34AA1060FB064882782C20E4D5B2FD
                </Td>
                <Td>
                  48A3BA2B4250CF2E88DE6856722B23B4629AFB71BFD402171E5EAC6E2D21EAFB
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default StakeTable;
