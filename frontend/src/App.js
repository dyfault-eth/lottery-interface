import { Home } from "./page/Home";
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { Web3Modal } from '@web3modal/react';
import { Center, Box } from "@chakra-ui/react";
import {WalletConnect} from "./components/WalletConnect";

function App() {

  const chains = [polygonMumbai]
  const projectId = process.env.REACT_APP_WC_ID

  const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient
  })

  const ethereumClient = new EthereumClient(wagmiConfig, chains)

  return (
    <Box overflowY="hidden">
      <WagmiConfig config={wagmiConfig}>
        <Center mt="16px">
          <WalletConnect/>
        </Center>

        <Home/>
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </Box>
  );
}

export default App;
