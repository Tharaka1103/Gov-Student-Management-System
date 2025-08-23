import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const isProd = process.env.NODE_ENV === 'production';

// Adjust these if your cookie names/domains differ
const TOKEN_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'token';
const REFRESH_COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || 'refreshToken';
const COOKIE_DOMAIN = process.env.AUTH_COOKIE_DOMAIN; // e.g. ".yourdomain.com" (optional)

async function clearCookie(name: string) {
    const cookieStore = await cookies();
  const opts: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    path: string;
    maxAge: number;
    expires: Date;
    domain?: string;
  } = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  };

  if (COOKIE_DOMAIN) {
    opts.domain = COOKIE_DOMAIN;
  }

  // Overwrite cookie with expired date to remove it
  cookieStore.set(name, "", { path: "/", expires: new Date(0) });
}

export async function POST() {
  try {
    clearCookie(TOKEN_COOKIE_NAME);
    clearCookie(REFRESH_COOKIE_NAME); // if you use a refresh cookie

    return NextResponse.json({ success: true });
  } catch (e) {
    // Even if something goes wrong, respond OK so the UI doesn't get stuck
    return NextResponse.json({ success: true });
  }
}

// Optional: support GET for manual testing in the browser
export async function GET() {
  return POST();
}