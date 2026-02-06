import { useState, type ReactNode } from "react"
import { createRootRoute, Link, Outlet } from "@tanstack/react-router"
import { ClawConnectButton } from "../components/claw-connect-button"
import { useAccount } from "wagmi"
import { GlobeIcon, RocketIcon, HamburgerMenuIcon, Cross1Icon, PersonIcon } from "@radix-ui/react-icons"
import { Web3Provider } from "../providers/web3-provider"
import { MoltWorkerFeed } from "../components/molt-worker-feed"
import { I18nProvider, useI18n } from "../i18n"
import { LocaleSwitcher } from "../components/locale-switcher"
import { cn } from "../lib/cn"

function RootLayout() {
  return (
    <I18nProvider>
      <Web3Provider>
        <div className="flex min-h-screen flex-col bg-surface-deep">
          <Header />
          <main className="flex-1 p-4">
            <Outlet />
          </main>
          <Footer />
        </div>
        <MoltWorkerFeed />
      </Web3Provider>
    </I18nProvider>
  )
}

function DesktopNav() {
  const { isConnected } = useAccount()
  const { t } = useI18n()

  return (
    <div className="hidden items-center gap-4 sm:flex">
      {isConnected && <NavLink to="/" icon={<PersonIcon />} label={t.nav.myAgents} />}
      <NavLink to="/dex" icon={<GlobeIcon />} label={t.nav.browse} />
      <NavLink to="/mint" icon={<RocketIcon />} label={t.nav.mint} />
      <LocaleSwitcher />
      <ClawConnectButton />
    </div>
  )
}

function MobileNav({ onClose }: { onClose: () => void }) {
  const { isConnected } = useAccount()
  const { t } = useI18n()

  return (
    <div className="border-t border-border-subtle bg-surface-base px-4 py-4 sm:hidden">
      <div className="flex flex-col gap-4">
        {isConnected && <NavLink to="/" icon={<PersonIcon />} label={t.nav.myAgents} onClick={onClose} />}
        <NavLink to="/dex" icon={<GlobeIcon />} label={t.nav.browse} onClick={onClose} />
        <NavLink to="/mint" icon={<RocketIcon />} label={t.nav.mint} onClick={onClose} />
        <ClawConnectButton />
      </div>
    </div>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useI18n()

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-base/85 backdrop-blur-lg">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="font-pixel text-[10px] text-text-primary">
          {t.nav.clawTrainer}
        </Link>

        <DesktopNav />

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center justify-center text-text-secondary sm:hidden"
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
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
  const { t } = useI18n()

  return (
    <footer className="border-t border-border-subtle px-4 py-2 text-center font-mono text-xs text-text-muted">
      {t.footer.brand}
    </footer>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
