import { redirect } from 'next/navigation'

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI

  const scopes = ['user-top-read'].join(' ')

  // Random state string to prevent CSRF
  const state = Math.random().toString(36).substring(2, 15)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    state,
  })

  redirect(`https://accounts.spotify.com/authorize?${params.toString()}`)
}
