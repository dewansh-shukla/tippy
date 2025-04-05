"use client";

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { getDefaultConfig, RainbowKitProvider, darkTheme} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth";

// Create the Wagmi config
const config = getDefaultConfig({
  appName: "Bera Tip",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

// Create a React Query client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 