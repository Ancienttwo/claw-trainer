const API_BASE = import.meta.env.VITE_API_URL ?? ""

export function isApiConfigured(): boolean {
  return API_BASE.length > 0
}

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: unknown
  wallet?: string
  signMessage?: (message: string) => Promise<string>
  sessionToken?: string
}

async function buildAuthHeaders(
  wallet: string,
  signMessage: (message: string) => Promise<string>,
): Promise<Record<string, string>> {
  const timestamp = Date.now()
  const message = `clawtrainer:${wallet}:${timestamp}`
  const signature = await signMessage(message)
  return {
    "x-wallet-address": wallet,
    "x-wallet-signature": signature,
    "x-wallet-message": message,
  }
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  if (!isApiConfigured()) throw new Error("API not configured")

  const { method = "GET", body, wallet, signMessage, sessionToken } = options
  const headers: Record<string, string> = { "Content-Type": "application/json" }

  if (wallet && signMessage) {
    const authHeaders = await buildAuthHeaders(wallet, signMessage)
    Object.assign(headers, authHeaders)
  }

  if (sessionToken) {
    headers.Authorization = `Bearer ${sessionToken}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`API ${method} ${path} failed: ${response.status} ${text}`)
  }

  return response.json() as Promise<T>
}
