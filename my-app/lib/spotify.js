import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * Returns a valid Spotify access token for a user.
 * Automatically refreshes if the token is expired or expiring soon.
 *
 * @param {string} userId - Your internal Supabase user ID
 * @returns {string} A valid access token
 */
export async function getValidSpotifyToken(userId) {
  const { data: user, error } = await supabase
    .from('users')
    .select('spotify_access_token, spotify_refresh_token, spotify_token_expires_at')
    .eq('id', userId)
    .single()

  if (error || !user) throw new Error(`User not found: ${userId}`)

  const expiresAt = new Date(user.spotify_token_expires_at)
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000)

  // Token is still valid
  if (expiresAt > fiveMinutesFromNow) {
    return user.spotify_access_token
  }

  // Token expired — refresh it
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user.spotify_refresh_token,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh Spotify token')
  }

  const { access_token, expires_in } = await response.json()
  const newExpiresAt = new Date(Date.now() + expires_in * 1000).toISOString()

  // Save the new token
  await supabase
    .from('users')
    .update({
      spotify_access_token: access_token,
      spotify_token_expires_at: newExpiresAt,
    })
    .eq('id', userId)

  return access_token
}
