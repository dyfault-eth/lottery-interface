import { useWeb3Modal } from '@web3modal/react'
import { Button, Box } from "@chakra-ui/react";
import {useAccount} from "wagmi";
import { useContext, useEffect } from 'react';
import { useWalletContext } from "../context/WalletContext";

export const WalletConnect = ({ variant }) => {

    const { setAddress, setIsConnected } = useWalletContext();
    const {address, isConnected} = useAccount()
    const { open } = useWeb3Modal()

    useEffect(() => {
        setAddress(address);
        setIsConnected(isConnected);
    }, [address, isConnected, setAddress, setIsConnected]);

    return (
        <Box> 
            <Button variant={variant} onClick={() => open()}>
                {isConnected ? `${address.slice(0,5)}...${address.slice(-5)}` : 'Connect Wallet'}
            </Button>
        </Box>
    )
}
