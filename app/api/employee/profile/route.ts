import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { uploadProfilePicture, validateImageFile } from '@/lib/upload';

// GET employee profile
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'employee') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const employee = await User.findById(user._id)
      .select('-password')
      .populate('director', 'name email');

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ employee });
  } catch (error) {
    console.error('Get employee profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE employee profile
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'employee') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const mobile = formData.get('mobile') as string;
    const address = formData.get('address') as string;
    const degree = formData.get('degree') as string;
    const profilePicture = formData.get('profilePicture') as File;

    if (!name || !mobile || !address) {
      return NextResponse.json({ error: 'Name, mobile, and address are required' }, { status: 400 });
    }

    // Check if employee exists
    const existingEmployee = await User.findById(user._id);
    if (!existingEmployee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check email uniqueness if provided
    if (email && email !== existingEmployee.email) {
      const emailExists = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id }
      });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
    }

    let profilePictureUrl = existingEmployee.profilePicture;

    // Handle profile picture upload
    if (profilePicture && profilePicture.size > 0) {
      const validation = validateImageFile(profilePicture);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      profilePictureUrl = await uploadProfilePicture(profilePicture, user._id);
    }

    const updateData: any = {
      name: name.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      degree: degree?.trim() || undefined,
      profilePicture: profilePictureUrl
    };

    // Only update email if provided
    if (email) {
      updateData.email = email.toLowerCase().trim();
    }

    const updatedEmployee = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true }
    ).select('-password').populate('director', 'name email');

    return NextResponse.json({ employee: updatedEmployee });
  } catch (error) {
    console.error('Update employee profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}