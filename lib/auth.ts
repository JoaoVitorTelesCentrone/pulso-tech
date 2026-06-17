import { SignJWT, jwtVerify } from 'jose'

const COOKIE_NAME = 'tf_access'

export type AccessPayload = {
  sub: string
  plan: 'premium'
}

function secret() {
  return new TextEncoder().encode(process.env.JWT_SECRET!)
}

export async function signAccessToken(subscriberId: string): Promise<string> {
  return new SignJWT({ plan: 'premium' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(subscriberId)
    .setExpirationTime('35d')
    .sign(secret())
}

export async function verifyAccessToken(token: string): Promise<AccessPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    return { sub: payload.sub as string, plan: 'premium' }
  } catch {
    return null
  }
}

export async function signMagicToken(subscriberId: string): Promise<string> {
  return new SignJWT({ type: 'magic-link' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(subscriberId)
    .setExpirationTime('1h')
    .sign(secret())
}

export async function verifyMagicToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    if (payload['type'] !== 'magic-link') return null
    return payload.sub as string
  } catch {
    return null
  }
}

export const ACCESS_COOKIE = {
  name: COOKIE_NAME,
  options: {
    maxAge: 60 * 60 * 24 * 35,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  },
}
