import { createFileRoute, Navigate } from "@tanstack/react-router"

function CardRedirect() {
  const { tokenId } = Route.useParams()
  return <Navigate to="/agent/$tokenId" params={{ tokenId }} replace />
}

export const Route = createFileRoute("/card/$tokenId")({
  component: CardRedirect,
})
