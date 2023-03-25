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


// TODO: Make this scalable with json object

function PerformStakeStep() {
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
                <Th>Node Address</Th>
                <Th>Stake TX Hash</Th>
                <Th>Balance Transfer TX Hash</Th>
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

export default PerformStakeStep;
