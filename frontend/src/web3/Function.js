import { createWalletClient, custom, createPublicClient, http, parseEther, formatEther, decodeEventLog } from "viem";
import { polygonMumbai } from 'viem/chains'
import ABI from "./ABI/LotteryAbi"
import { lottery } from "./ContractAddr";

const client = createPublicClient({
    batch: {
        multicall: true,
    },

    chain: polygonMumbai,
    transport: http(process.env.REACT_APP_RPC)
})

let walletClient;
console.log(window.ethereum)
if (typeof window.ethereum !== 'undefined' && window.ethereum.isConnected()) {
    try {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        walletClient = createWalletClient({
            batch: {
                multicall: true,
            },
            account,
            chain: polygonMumbai,
            transport: custom(window.ethereum)
        });
    } catch (e) {
        console.log(e)
    }
} else {
    walletClient = null;
}

export async function fetchLotteryStat() {
    try {

        let id = Number(await client.readContract({
            address: lottery,
            abi: ABI,
            functionName: 'lotteryId',
        }));

        id = Number(id + 1);

        const count = Number(await client.readContract({
            address: lottery,
            abi: ABI,
            functionName: 'participantCount',
        }));

        let balance = await client.getBalance({ 
            address: lottery,
        });

        balance = Number(formatEther(balance));
          
        balance *= 0.95;

        return { lotteryId: id, participantCount: count, rewards: balance};

    } catch (err) {
        console.error("Erreur lors de la récupération de tous les participants :", err);
    }
}

export async function getOwnerAddr() {
    try {

        let owner = await client.readContract({
            address: lottery,
            abi: ABI,
            functionName: 'owner',
        });

        return owner;

    } catch (err) {
        console.error("Erreur lors de la récupération de tous les participants :", err);
    }
}

export async function participate() {
    try {

        const { request } = await client.simulateContract({
            address: lottery,
            abi: ABI,
            functionName: 'participate',
            value: parseEther('0.1'),
        })

        const tx = walletClient.writeContract(request);

        return tx;
    } catch (err) {
        console.log(err)
    }
}

export async function drawLottery() {
    try {

        const { request } = await client.simulateContract({
            address: lottery,
            abi: ABI,
            functionName: 'selectWinner',
        })

        const tx = walletClient.writeContract(request)

        return tx;
    } catch (err) {
        console.log(err)
    }
}

export async function extractParticipating(hash) {
    try {
        hash = await client.waitForTransactionReceipt({ hash })
        const logs = hash.logs

        for (let i = 0; i < logs.length; i++) {
            const log = logs[i]

            if(log.address === lottery.toLowerCase()) {
                const topics = decodeEventLog({
                    abi: ABI,
                    data: log.data,
                    topics: log.topics,
                })

                if (topics.eventName === 'NewParticipant') {
                    return true;
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}