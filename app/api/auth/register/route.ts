import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { uploadProfilePicture, validateImageFile } from '@/lib/upload';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await req.formData();
    
    const userData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      nic: formData.get('nic') as string,
      mobile: formData.get('mobile') as string,
      address: formData.get('address') as string,
      password: formData.get('password') as string,
      role: 'internal_auditor',
      managingDepartments: JSON.parse(formData.get('managingDepartments') as string),
    };

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: userData.email.toLowerCase() },
        { nic: userData.nic }
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
        return NextResponse.json(
          { message: validation.error },
          { status: 400 }
        );
      }

      // Create temporary user ID for file naming
      const tempUserId = new Date().getTime().toString();
      profilePicturePath = await uploadProfilePicture(profilePictureFile, tempUserId);
    }

    // Create user
    const user = new User({
      ...userData,
      email: userData.email.toLowerCase(),
      profilePicture: profilePicturePath
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json({
      message: 'Registration successful',
      user: userResponse
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'User with this email or NIC already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}