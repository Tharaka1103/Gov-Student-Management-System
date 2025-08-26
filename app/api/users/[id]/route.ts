import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import {User} from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    await dbConnect();

    const body = await request.json();
    const { email, username, contact, nic, work, address, password, role } = body;

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if email or username is taken by another user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      _id: { $ne: params.id }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email or username already taken' }, { status: 400 });
    }

    const updateData: any = {
      email,
      username,
      contact,
      nic,
      work,
      address,
      role,
      updatedAt: new Date()
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).select('-password');

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    await dbConnect();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }


    await User.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}