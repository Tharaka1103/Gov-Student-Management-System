import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  body.password = bcrypt.hashSync(body.password, 10);
  body.role = 'user';
  const user = await User.create(body);
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  const res = NextResponse.json({ message: 'Registered' });
  res.cookies.set('token', token, { httpOnly: true, path: '/' });
  return res;
}