import "@rainbow-me/rainbowkit/styles.css"

import { type ReactNode } from "react"
import { type Theme, lightTheme, getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
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
  ...lightTheme({ accentColor: "#FF4D4D", accentColorForeground: "#FFFFFF", borderRadius: "small" }),
  colors: {
    ...lightTheme().colors,
    accentColor: "#FF4D4D",
    accentColorForeground: "#FFFFFF",
    connectButtonBackground: "#FFFFFF",
    connectButtonInnerBackground: "#F0EDE6",
    connectButtonText: "#1A1A2E",
    connectButtonTextError: "#FF4D4D",
    modalBackground: "#FFFFFF",
    modalBorder: "rgba(26, 26, 46, 0.12)",
    modalText: "#1A1A2E",
    modalTextDim: "#8888A0",
    modalTextSecondary: "#4A4A6A",
    profileForeground: "#FFFFFF",
    profileAction: "#F0EDE6",
    profileActionHover: "#E8E4DC",
    generalBorder: "rgba(26, 26, 46, 0.12)",
    generalBorderDim: "rgba(26, 26, 46, 0.06)",
    menuItemBackground: "#F0EDE6",
    selectedOptionBorder: "#FF4D4D",
    actionButtonBorder: "rgba(26, 26, 46, 0.12)",
    actionButtonBorderMobile: "rgba(26, 26, 46, 0.12)",
    actionButtonSecondaryBackground: "#F0EDE6",
    closeButton: "#4A4A6A",
    closeButtonBackground: "#E8E4DC",
    connectionIndicator: "#22C55E",
    downloadBottomCardBackground: "#F8F6F0",
    downloadTopCardBackground: "#FFFFFF",
    error: "#FF4D4D",
    standby: "#F59E0B",
    modalBackdrop: "rgba(26, 26, 46, 0.3)",
  },
  fonts: {
    body: "'Satoshi', 'Inter', system-ui, sans-serif",
  },
  shadows: {
    connectButton: "0 4px 16px rgba(26, 26, 46, 0.08)",
    dialog: "0 8px 24px rgba(26, 26, 46, 0.12)",
    profileDetailsAction: "0 0 12px rgba(255, 77, 77, 0.4)",
    selectedOption: "0 0 12px rgba(255, 77, 77, 0.4)",
    selectedWallet: "0 0 12px rgba(0, 229, 204, 0.4)",
    walletLogo: "0 4px 12px rgba(26, 26, 46, 0.06)",
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
