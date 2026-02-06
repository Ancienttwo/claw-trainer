import "@rainbow-me/rainbowkit/styles.css";

import { type ReactNode } from "react";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const WALLETCONNECT_PROJECT_ID = "e1cca00d545d62a2de270fba051b33e0";

const wagmiConfig = getDefaultConfig({
  appName: "ClawTrainer.ai",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [bsc, bscTestnet],
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
