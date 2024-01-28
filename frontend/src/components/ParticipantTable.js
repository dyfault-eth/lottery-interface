import { Table, Thead, Tbody, Tr, Th, Td, Box, Spinner } from '@chakra-ui/react';

export const ParticipantsTable = ({ isLoading, lotteryStats }) => {
    if (isLoading || lotteryStats === undefined) {
        return <Spinner />;
    }

    return (
        <Box>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Loterie Numéro</Th>
                        <Th>Nombre de Participants</Th>
                        <Th>Récompenses</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>{lotteryStats.lotteryId}</Td>
                        <Td>{lotteryStats.participantCount}</Td>
                        <Td>{lotteryStats.rewards} Matic</Td>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    );
};
