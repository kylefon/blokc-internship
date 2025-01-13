"use client";

import { MetaMaskProvider, useSDK } from "@metamask/sdk-react"
import { useEffect, useState } from "react";

export const Button = () => {
    const { sdk, connected, connecting, account } = useSDK();
    const [ balance, setBalance ] = useState(null);
    const connect = async () => {
        try {
            await sdk?.connect();
        } catch (err) {
            console.warn('No Accounts Found', err);
        }
    };

    const disconnect = () => {
        if (sdk) {
            try {
                sdk.terminate();
                console.log("Successfully disconnected", account);
                console.log(connected)
            } catch (err) {
                console.error("Error disconnecting ", err)
            }
        } else {
            console.error("No Accounts logged in")
        }
    };

    useEffect(() => {
        const getBalance = async () => {
            try {
                const balanceInHex = await window.ethereum.request({
                    method: "eth_getBalance",
                    params: [account, "latest"],
                })
    
                const formattedBalance = parseFloat(parseInt(balanceInHex, 16)/ 1e18).toFixed(2);
                setBalance(formattedBalance);
            } catch (err) {
                console.error("Error fetching balance: ", err);
            }
        }

        getBalance();
    }, [account])
    
    return (
        <>
            <div className="flex flex-col gap-5 justify-center items-center">
                <img src="./MetaMask-Logo.png" className="w-[90vh]"/>
                {connected ? (
                    <div className="flex flex-col gap-4">
                        <div>
                            Account: {account}
                        </div>
                        <div>
                            Balance: {balance} ETH
                        </div>
                        <button onClick={disconnect} className="bg-red-700 color-white">
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <div>
                        <button disabled={connecting} onClick={connect}>
                            Connect with MetaMask
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export const MetaMaskButton = () => {

    const host = typeof window !== "undefined" ? window.location.host : "defaultHost";

    const sdkOptions = {
        logging: { developerMode: false },
        checkInstallationImmediately: false,
        dappMetadata: {
            name: "Blokc-Internship",
            url: host,
        },
    };

    return (
        <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
            <Button />
        </MetaMaskProvider>
    )
}

export default MetaMaskButton;