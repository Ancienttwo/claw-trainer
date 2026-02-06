import { useState, type ReactNode } from "react"
import { createRootRoute, Link, Outlet } from "@tanstack/react-router"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { GlobeIcon, RocketIcon, HamburgerMenuIcon, Cross1Icon, PersonIcon } from "@radix-ui/react-icons"
import { Web3Provider } from "../providers/web3-provider"
import { cn } from "../lib/cn"

function RootLayout() {
  return (
    <Web3Provider>
      <div className="flex min-h-screen flex-col bg-surface-deep">
        <Header />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </Web3Provider>
  )
}

function DesktopNav() {
  const { isConnected } = useAccount()

  return (
    <div className="hidden items-center gap-4 sm:flex">
      {isConnected && <NavLink to="/" icon={<PersonIcon />} label="My Agents" />}
      <NavLink to="/dex" icon={<GlobeIcon />} label="Browse" />
      <NavLink to="/mint" icon={<RocketIcon />} label="Mint" />
      <ConnectButton />
    </div>
  )
}

function MobileNav({ onClose }: { onClose: () => void }) {
  const { isConnected } = useAccount()

  return (
    <div className="border-t border-border-subtle bg-surface-base px-4 py-4 sm:hidden">
      <div className="flex flex-col gap-4">
        {isConnected && <NavLink to="/" icon={<PersonIcon />} label="My Agents" onClick={onClose} />}
        <NavLink to="/dex" icon={<GlobeIcon />} label="Browse" onClick={onClose} />
        <NavLink to="/mint" icon={<RocketIcon />} label="Mint" onClick={onClose} />
        <ConnectButton />
      </div>
    </div>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-base/85 backdrop-blur-lg">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="font-pixel text-[10px] text-text-primary">
          ClawTrainer
        </Link>

        <DesktopNav />

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center justify-center text-text-secondary sm:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
        </button>
      </nav>

      {menuOpen && <MobileNav onClose={() => setMenuOpen(false)} />}
    </header>
  )
}

function NavLink({
  to,
  icon,
  label,
  onClick,
}: {
  to: string
  icon: ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 font-body text-sm text-text-secondary",
        "transition-colors duration-150 hover:text-text-primary",
        "[&.active]:text-coral [&.active]:border-b-2 [&.active]:border-coral",
      )}
    >
      {icon}
      {label}
    </Link>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border-subtle px-4 py-2 text-center font-mono text-xs text-text-muted">
      ClawTrainer.ai &mdash; BNB Chain
    </footer>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
