"use client";

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { getDefaultConfig, RainbowKitProvider, darkTheme} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { berachain } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth";

// Create the Wagmi config
const config = getDefaultConfig({
  appName: "Bera Tip",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  chains: [berachain],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

// Create a React Query client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: "#ffffff",
          accentColorForeground: "black",
          fontStack: "system",

        })}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
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