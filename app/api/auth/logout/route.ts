import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const isProd = process.env.NODE_ENV === 'production';
const COOKIE_DOMAIN = process.env.AUTH_COOKIE_DOMAIN;

// List of cookies to clear during logout
const COOKIES_TO_CLEAR = [
  'token',
  'isAuthenticated',
  '__next_hmr_refresh_hash__', // Next.js HMR cookie
  'refreshToken', // Add if you use refresh tokens
  'sessionId', // Add if you use session IDs
];

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  path?: string;
  maxAge?: number;
  expires?: Date;
  domain?: string;
}

async function clearCookie(name: string, customPath?: string) {
  const cookieStore = await cookies();
  
  // Base options for clearing cookies
  const baseOpts: CookieOptions = {
    path: customPath || '/',
    maxAge: 0,
    expires: new Date(0),
  };

  // Options for httpOnly cookies (server-side cookies)
  const httpOnlyOpts: CookieOptions = {
    ...baseOpts,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
  };

  // Options for client-side accessible cookies
  const clientOpts: CookieOptions = {
    ...baseOpts,
    httpOnly: false,
    secure: isProd,
    sameSite: 'lax',
  };

  // Add domain if specified
  if (COOKIE_DOMAIN) {
    httpOnlyOpts.domain = COOKIE_DOMAIN;
    clientOpts.domain = COOKIE_DOMAIN;
  }

  try {
    // Clear with different configurations to ensure removal
    // Try clearing as httpOnly cookie
    cookieStore.set(name, '', httpOnlyOpts);
    
    // Try clearing as client-accessible cookie
    cookieStore.set(name, '', clientOpts);
    
    // Also try clearing with root path
    if (customPath !== '/') {
      cookieStore.set(name, '', { ...httpOnlyOpts, path: '/' });
      cookieStore.set(name, '', { ...clientOpts, path: '/' });
    }

    // Try clearing without domain (for localhost development)
    if (COOKIE_DOMAIN) {
      const optsWithoutDomain = { ...httpOnlyOpts };
      delete optsWithoutDomain.domain;
      cookieStore.set(name, '', optsWithoutDomain);
    }

    console.log(`Successfully cleared cookie: ${name}`);
  } catch (error) {
    console.warn(`Failed to clear cookie ${name}:`, error);
  }
}

async function clearAllAuthCookies() {
  const cookieStore = await cookies();
  
  // Get all existing cookies
  const existingCookies = cookieStore.getAll();
  console.log('Existing cookies before clearing:', existingCookies.map(c => c.name));

  // Clear each cookie in our list
  for (const cookieName of COOKIES_TO_CLEAR) {
    await clearCookie(cookieName);
  }

  // Also clear any additional auth-related cookies that might exist
  const authPatterns = [
    /^auth/i,
    /^session/i,
    /^user/i,
    /token/i,
    /refresh/i
  ];

  for (const cookie of existingCookies) {
    const shouldClear = authPatterns.some(pattern => pattern.test(cookie.name));
    if (shouldClear && !COOKIES_TO_CLEAR.includes(cookie.name)) {
      await clearCookie(cookie.name);
    }
  }
}

export async function POST() {
  try {
    console.log('Logout API called - clearing cookies...');
    
    // Clear all authentication cookies
    await clearAllAuthCookies();

    // Create response with additional headers to ensure cookie clearing
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully',
      clearedCookies: COOKIES_TO_CLEAR
    });

    // Set additional headers to clear cookies on client side
    COOKIES_TO_CLEAR.forEach(cookieName => {
      // Clear with different path and domain combinations
      response.cookies.set(cookieName, '', {
        path: '/',
        expires: new Date(0),
        maxAge: 0,
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        ...(COOKIE_DOMAIN && { domain: COOKIE_DOMAIN })
      });

      // Also set a client-accessible version to clear
      response.cookies.set(cookieName, '', {
        path: '/',
        expires: new Date(0),
        maxAge: 0,
        httpOnly: false,
        secure: isProd,
        sameSite: 'lax',
        ...(COOKIE_DOMAIN && { domain: COOKIE_DOMAIN })
      });

      // Clear without domain for localhost
      if (!isProd) {
        response.cookies.set(cookieName, '', {
          path: '/',
          expires: new Date(0),
          maxAge: 0,
          httpOnly: false,
          secure: false,
          sameSite: 'lax'
        });
      }
    });

    console.log('Cookies cleared successfully');
    return response;

  } catch (error) {
    console.error('Error during logout:', error);
    
    // Even if something goes wrong, respond with success
    // but clear cookies in the response headers
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out (with errors)',
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    // Fallback cookie clearing
    COOKIES_TO_CLEAR.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        path: '/',
        expires: new Date(0),
        maxAge: 0
      });
    });

    return response;
  }
}

// Support GET for manual testing
export async function GET() {
  return POST();
}

// Alternative method using client-side clearing
export async function DELETE() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Use client-side clearing',
      cookiesToClear: COOKIES_TO_CLEAR,
      clearScript: `
        // Client-side cookie clearing script
        const cookiesToClear = ${JSON.stringify(COOKIES_TO_CLEAR)};
        cookiesToClear.forEach(name => {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';';
        });
      `
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}