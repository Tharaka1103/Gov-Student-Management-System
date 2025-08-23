import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

const authorize = (role: string, allowedRoles: string[]) => allowedRoles.includes(role);

export async function GET(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
  if (decoded.role !== 'admin' && decoded.role !== 'director') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const searchParams = req.nextUrl.searchParams;
  const roleFilter = searchParams.get('role');
  const query = roleFilter ? { role: roleFilter } : {};
  if (decoded.role === 'director' && roleFilter !== 'user') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const users = await User.find(query).select('-password');
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
  if (!authorize(decoded.role, ['admin'])) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  body.password = bcrypt.hashSync(body.password, 10);
  const user = await User.create(body);
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
  const body = await req.json();
  const id = body.id;
  if (decoded.role !== 'admin' && decoded.id !== id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (body.password) body.password = bcrypt.hashSync(body.password, 10);
  const user = await User.findByIdAndUpdate(id, body, { new: true }).select('-password');
  return NextResponse.json(user);
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (decoded.role !== 'admin' && decoded.id !== id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await User.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}