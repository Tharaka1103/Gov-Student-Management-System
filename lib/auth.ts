import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const generateToken = (userId: string, email: string, role: string): string => {
  console.log('Generating token (Node.js) with secret length:', JWT_SECRET.length);
  const token = jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  console.log('Generated token (Node.js):', token.substring(0, 50) + '...');
  return token;
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    console.log('Verifying token (Node.js) with secret length:', JWT_SECRET.length);
    console.log('Token to verify:', token.substring(0, 50) + '...');
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log('Token verification successful (Node.js) for user:', payload.email);
    return payload;
  } catch (error) {
    console.error('Token verification failed (Node.js):', error);
    return null;
  }
};

export const getTokenFromCookies = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('auth-token');
    console.log('Token from cookies:', tokenCookie?.value ? 'Found' : 'Not found');
    return tokenCookie?.value ?? null;
  } catch (error) {
    console.error('Error getting token from cookies:', error);
    return null;
  }
};

export const getTokenFromRequest = (req: NextRequest): string | null => {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    console.log('Token from Authorization header:', token ? 'Found' : 'Not found');
    return token;
  }
  
  const tokenCookie = req.cookies.get('auth-token');
  console.log('Token from request cookies:', tokenCookie?.value ? 'Found' : 'Not found');
  return tokenCookie?.value ?? null;
};

export const getCurrentUser = async (token?: string | null) => {
  try {
    let authToken: string | null = token ?? null;
    
    // If no token provided, try to get from cookies
    if (!authToken) {
      authToken = await getTokenFromCookies();
    }
    
    if (!authToken) {
      console.log('No auth token found');
      return null;
    }

    const payload = verifyToken(authToken);
    if (!payload) {
      console.log('Token verification failed');
      return null;
    }

    await dbConnect();
    const User = (await import('@/models/User')).default;
    const user = await User.findById(payload.userId).select('-password');
    if (!user || !user.isActive) {
      console.log('User not found or inactive');
      return null;
    }

    console.log('User found:', user.email);
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const requireAuth = (allowedRoles?: string[]) => {
  return async (req: NextRequest) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      return { authorized: false, message: 'No token provided' };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return { authorized: false, message: 'Invalid token' };
    }

    if (allowedRoles && !allowedRoles.includes(payload.role)) {
      return { authorized: false, message: 'Insufficient permissions' };
    }

    return { authorized: true, user: payload };
  };
};