import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';

export async function GET(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  const decoded = token ? jwt.verify(token, process.env.JWT_SECRET!) as { role: string } : null;
  const courses = await Course.find({});
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
  if (!['admin', 'director'].includes(decoded.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const course = await Course.create(body);
  return NextResponse.json(course);
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
  if (!['admin', 'director'].includes(decoded.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const course = await Course.findByIdAndUpdate(body.id, body, { new: true });
  return NextResponse.json(course);
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
  if (!['admin', 'director'].includes(decoded.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  await Course.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}