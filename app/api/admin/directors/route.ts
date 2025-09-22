import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';
import { uploadProfilePicture, validateImageFile } from '@/lib/upload';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const directors = await User.find({ role: 'director' })
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json({ directors });
  } catch (error) {
    console.error('Fetch directors error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const formData = await req.formData();
    
    const directorData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      nic: formData.get('nic') as string,
      mobile: formData.get('mobile') as string,
      address: formData.get('address') as string,
      role: 'director' as const,
      managingDepartments: JSON.parse(formData.get('managingDepartments') as string),
    };

    // Auto-generate password
    const autoPassword = User.generateAutoPassword(directorData.name);
    directorData.password = autoPassword;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: directorData.email.toLowerCase() },
        { nic: directorData.nic }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email or NIC already exists' },
        { status: 400 }
      );
    }

    // Handle profile picture upload
    const profilePictureFile = formData.get('profilePicture') as File;
    let profilePicturePath = null;

    if (profilePictureFile && profilePictureFile.size > 0) {
      const validation = validateImageFile(profilePictureFile);
      if (!validation.valid) {
        return NextResponse.json({ message: validation.error }, { status: 400 });
      }

      const tempUserId = new Date().getTime().toString();
      profilePicturePath = await uploadProfilePicture(profilePictureFile, tempUserId);
    }

    const director = new User({
      ...directorData,
      email: directorData.email.toLowerCase(),
      profilePicture: profilePicturePath
    });

    await director.save();

    const directorResponse = director.toObject();
    delete directorResponse.password;

    return NextResponse.json({
      message: 'Director created successfully',
      director: directorResponse,
      generatedPassword: autoPassword
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create director error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'User with this email or NIC already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}