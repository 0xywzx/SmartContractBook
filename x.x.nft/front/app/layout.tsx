"use client";

import './globals.css'
import { Inter } from 'next/font/google'

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { avalanche, avalancheFuji, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { chains, publicClient } = configureChains(
    [
      avalancheFuji,
      avalanche,
      ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
    ],
    [publicProvider()]
  );

  const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;
  const { connectors } = getDefaultWallets({
    appName: 'RainbowKit App',
    projectId,
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  });

  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
