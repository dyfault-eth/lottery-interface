import React, { createContext, useState } from "react";
import { useContext } from "react";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {

  const [ address, setAddress ] = useState('');
  const [ isConnected, setIsConnected ] = useState(false);
  const [maticBal, setMaticBal] = useState(0)

  return (
    <WalletContext.Provider
      value={{

        address, 
        setAddress,

        isConnected,
        setIsConnected,

        maticBal,
        setMaticBal,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);