import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { generateToken } from '@/lib/auth'; // Keep this for server-side
import { generateTokenEdge } from '@/lib/auth-edge'; // Add this for consistency

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Import User model after connection
    const User = (await import('@/models/User')).default;
    
    const { email, password } = await req.json();
    console.log('Login attempt for:', email);

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('User inactive:', email);
      return NextResponse.json(
        { message: 'Account is deactivated. Contact administrator.' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.log('Invalid password for:', email);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token using Edge-compatible method
    const token = await generateTokenEdge(user._id.toString(), user.email, user.role);
    console.log('Login successful for:', email, 'Role:', user.role);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Create response with token in cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      token,
      redirectTo: getRoleBasedRedirect(user.role)
    });

    // Set cookie with proper settings
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true, // Keep this true for security
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    console.log('Cookie set for user:', email);
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getRoleBasedRedirect(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'director':
      return '/director/dashboard';
    case 'internal_auditor':
      return '/auditor/dashboard';
    default:
      return '/dashboard';
  }
}