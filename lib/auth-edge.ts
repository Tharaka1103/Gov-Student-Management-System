import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const secret = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const generateTokenEdge = async (userId: string, email: string, role: string): Promise<string> => {
  const token = await new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  
  console.log('Generated token (Edge):', token.substring(0, 50) + '...');
  return token;
};

export const verifyTokenEdge = async (token: string): Promise<JWTPayload | null> => {
  try {
    console.log('Verifying token with Edge Runtime');
    console.log('Token to verify:', token.substring(0, 50) + '...');
    
    const { payload } = await jwtVerify(token, secret);
    console.log('Token verification successful (Edge) for user:', payload.email);
    
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    console.error('Token verification failed (Edge):', error);
    return null;
  }
};