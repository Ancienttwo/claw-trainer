import { createFileRoute } from "@tanstack/react-router"
import { MintWizard } from "../components/mint/mint-wizard"

function MintPage() {
  return <MintWizard />
}

export const Route = createFileRoute("/mint")({
  component: MintPage,
})
