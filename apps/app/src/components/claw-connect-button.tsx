import { ConnectButton } from "@rainbow-me/rainbowkit"
import { cn } from "../lib/cn"
import { useI18n } from "../i18n"

export function ClawConnectButton() {
  const { t } = useI18n()

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted
        if (!ready) return null

        if (!account) {
          return (
            <button
              type="button"
              onClick={openConnectModal}
              className={cn(
                "inline-flex items-center gap-1.5 font-pixel text-[9px]",
                "rounded-pixel border-2 border-coral-mid bg-coral-mid px-3 py-1.5",
                "text-white transition-all duration-150",
                "hover:bg-coral hover:shadow-glow-coral",
                "active:scale-[0.95] active:translate-y-[2px]",
              )}
            >
              {t.common.connect}
            </button>
          )
        }

        if (chain?.unsupported) {
          return (
            <button
              type="button"
              onClick={openChainModal}
              className={cn(
                "inline-flex items-center gap-1.5 font-pixel text-[9px]",
                "rounded-pixel border-2 border-error bg-surface-raised px-3 py-1.5",
                "text-error transition-all duration-150",
                "hover:bg-error/10",
              )}
            >
              {t.common.wrongNetwork}
            </button>
          )
        }

        return (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={openChainModal}
              className={cn(
                "inline-flex items-center gap-1.5",
                "rounded-pixel border border-border-subtle bg-surface-raised px-2 py-1.5",
                "font-mono text-xs text-text-secondary transition-all duration-150",
                "hover:border-cyan/40 hover:text-cyan",
              )}
            >
              {chain?.hasIcon && chain.iconUrl && (
                <img
                  alt={chain.name ?? "Chain"}
                  src={chain.iconUrl}
                  className="h-4 w-4 rounded-full"
                />
              )}
              <span className="hidden sm:inline">{chain?.name}</span>
            </button>

            <button
              type="button"
              onClick={openAccountModal}
              className={cn(
                "inline-flex items-center gap-1.5",
                "rounded-pixel border border-border-subtle bg-surface-raised px-2 py-1.5",
                "font-mono text-xs text-text-primary transition-all duration-150",
                "hover:border-coral/40 hover:shadow-glow-coral",
              )}
            >
              {account.displayBalance && (
                <span className="text-amber">{account.displayBalance}</span>
              )}
              <span className="text-text-secondary">{account.displayName}</span>
            </button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
