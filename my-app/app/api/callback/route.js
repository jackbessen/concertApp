import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // User denied access
  if (error || !code) {
    return NextResponse.redirect(new URL('/?error=spotify_denied', request.url))
  }

  // 1. Exchange code for tokens
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
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
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    }),
  })

  if (!tokenResponse.ok) {
    console.error('Token exchange failed:', await tokenResponse.text())
    return NextResponse.redirect(new URL('/?error=token_failed', request.url))
  }

  const { access_token, refresh_token, expires_in } = await tokenResponse.json()

  // 2. Fetch the Spotify user profile
  const profileResponse = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  if (!profileResponse.ok) {
    return NextResponse.redirect(new URL('/?error=profile_failed', request.url))
  }

  const profile = await profileResponse.json()

  // 3. Fetch top artists (up to 50, long_term = all time)
  const topArtistsResponse = await fetch(
    'https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term',
    { headers: { Authorization: `Bearer ${access_token}` } }
  )

  const topArtistsData = await topArtistsResponse.json()
  const topArtists = topArtistsData.items.map((artist, index) => ({
    spotify_id: artist.id,
    name: artist.name,
    rank: index + 1, // 1 = most listened to
    image_url: artist.images?.[0]?.url ?? null,
    genres: artist.genres,
  }))

  // 4. Upsert user into Supabase
  const tokenExpiresAt = new Date(Date.now() + expires_in * 1000).toISOString()

  const { data: user, error: upsertError } = await supabase
    .from('users')
    .upsert(
      {
        spotify_id: profile.id,
        email: profile.email,
        display_name: profile.display_name,
        spotify_access_token: access_token,
        spotify_refresh_token: refresh_token,
        spotify_token_expires_at: tokenExpiresAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'spotify_id', returning: 'representation' }
    )
    .select()
    .single()

  if (upsertError) {
    console.error('Supabase upsert error:', upsertError)
    return NextResponse.redirect(new URL('/?error=db_failed', request.url))
  }

  // 5. Replace user's top artists in Supabase
  await supabase.from('user_top_artists').delete().eq('user_id', user.id)

  await supabase.from('user_top_artists').insert(
    topArtists.map((a) => ({ ...a, user_id: user.id }))
  )

  // 6. Redirect to dashboard with user id in a cookie
  const response = NextResponse.redirect(new URL('/dashboard', request.url))
  response.cookies.set('user_id', user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  return response
}
