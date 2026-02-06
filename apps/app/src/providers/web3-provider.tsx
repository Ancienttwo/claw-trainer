import "@rainbow-me/rainbowkit/styles.css"

import { type ReactNode } from "react"
import { type Theme, darkTheme, getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID
if (!WALLETCONNECT_PROJECT_ID) {
  throw new Error("VITE_WALLETCONNECT_PROJECT_ID is required")
}

const wagmiConfig = getDefaultConfig({
  appName: "ClawTrainer.ai",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [bsc, bscTestnet],
})

const queryClient = new QueryClient()

const clawTheme: Theme = {
  ...darkTheme({ accentColor: "#FF4D4D", accentColorForeground: "#F0F4FF", borderRadius: "small" }),
  colors: {
    ...darkTheme().colors,
    accentColor: "#FF4D4D",
    accentColorForeground: "#F0F4FF",
    connectButtonBackground: "#111827",
    connectButtonInnerBackground: "#0A0F1A",
    connectButtonText: "#F0F4FF",
    connectButtonTextError: "#FF4D4D",
    modalBackground: "#0A0F1A",
    modalBorder: "rgba(136, 146, 176, 0.15)",
    modalText: "#F0F4FF",
    modalTextDim: "#5A6480",
    modalTextSecondary: "#8892B0",
    profileForeground: "#0A0F1A",
    profileAction: "#111827",
    profileActionHover: "#1E293B",
    generalBorder: "rgba(136, 146, 176, 0.15)",
    generalBorderDim: "rgba(136, 146, 176, 0.08)",
    menuItemBackground: "#111827",
    selectedOptionBorder: "#FF4D4D",
    actionButtonBorder: "rgba(136, 146, 176, 0.15)",
    actionButtonBorderMobile: "rgba(136, 146, 176, 0.15)",
    actionButtonSecondaryBackground: "#111827",
    closeButton: "#8892B0",
    closeButtonBackground: "#1E293B",
    connectionIndicator: "#22C55E",
    downloadBottomCardBackground: "#050810",
    downloadTopCardBackground: "#0A0F1A",
    error: "#FF4D4D",
    standby: "#F59E0B",
    modalBackdrop: "rgba(5, 8, 16, 0.75)",
  },
  fonts: {
    body: "'Satoshi', 'Inter', system-ui, sans-serif",
  },
  shadows: {
    connectButton: "0 4px 24px rgba(0, 0, 0, 0.5)",
    dialog: "0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 229, 204, 0.15)",
    profileDetailsAction: "0 0 12px rgba(255, 77, 77, 0.4)",
    selectedOption: "0 0 12px rgba(255, 77, 77, 0.4)",
    selectedWallet: "0 0 12px rgba(0, 229, 204, 0.4)",
    walletLogo: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
}

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={clawTheme}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
