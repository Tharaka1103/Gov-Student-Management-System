import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) return NextResponse.json({ error: 'Invalid' }, { status: 401 });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  const res = NextResponse.json({ message: 'Logged in' });
  res.cookies.set('token', token, { httpOnly: true, path: '/' });
  return res;
}