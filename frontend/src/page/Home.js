import { Box, Button, Center, Flex, useToast } from "@chakra-ui/react"
import { participate, drawLottery, fetchLotteryStat, extractParticipating, getOwnerAddr} from "../web3/Function";
import { useState, useEffect } from "react";
import { useWalletContext } from "../context/WalletContext";
import { WalletConnect } from "../components/WalletConnect";
import { ParticipantsTable } from "../components/ParticipantTable";
import io from 'socket.io-client';
const socket = io('http://lottery-api.dyfault.com');

export const Home = () => {

    const { isConnected, address, owner, setOwner } = useWalletContext();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [lotteryStats, setLotteryStats] = useState({});
    const toast = useToast();

    useEffect(() => {
        async function fetchOwner() {
            const owner = await getOwnerAddr();
            setOwner(owner);
        }

        fetchOwner();
    }, [address])

    useEffect(() => {

        const firstCall = async() => {
            setLoadingData(true);
            const stats = await fetchLotteryStat();
            setLotteryStats(stats)
            setLoadingData(false);
        }

        const interval = setInterval(async () => {
            const stats = await fetchLotteryStat();
            setLotteryStats(stats);
        }, 10000); // 10 secondes, ajustez selon les besoins

        firstCall();
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });
    
        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });
    }, []);    

    useEffect(() => {
        socket.on('winnerInfo', (data) => {

            toast({
                title: "New Winner",
                description: `The winner is ${data.winner}`,
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "top"
            });
        });

        return () => {
            socket.off('winnerInfo');
        };
    }, []);
    
    const handleParticipate = async() => {
        setLoading(true);

        const tx = await participate();

        if (tx !== undefined) {
            setLoading(false);
            const isParticipating = await extractParticipating(tx);

            if(isParticipating) {
                toast({
                    title: "Participation successful.",
                    description: "You have successfully entered the lottery.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
            }
        }

        setLoading(false);
    } 

    const handleDraw = async() => {
        setLoading(true);

        const tx = await drawLottery();

        if (tx !== undefined) {
            setLoading(false);
            return tx;
        }
    }

    return (
        <Flex direction="column" justify="center" align="center" height="90vh">
            {isConnected ? (
                <Center gap={3}>
                    <Button onClick={handleParticipate} isLoading={loading}>
                        Participate
                    </Button>
                    
                    {address === owner ?
                    <Button onClick={handleDraw} isLoading={loading}>
                        Draw
                    </Button>
                    :
                    <Box></Box>}

                </Center>
            ) : (
                <WalletConnect />
            )}

            <Box mt="32px" >
                <ParticipantsTable isLoading={loadingData} lotteryStats={lotteryStats} />
            </Box>
        </Flex>
    );
}