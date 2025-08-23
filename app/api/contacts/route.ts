import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import { Contact } from '@/models/Contact';

export async function GET(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
  if (decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const contacts = await Contact.find({});
  return NextResponse.json(contacts);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const contact = await Contact.create(body);
  return NextResponse.json(contact);
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
  if (decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  await Contact.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}