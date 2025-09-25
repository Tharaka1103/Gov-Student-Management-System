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
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const nic = formData.get('nic') as string;
    const mobile = formData.get('mobile') as string;
    const address = formData.get('address') as string;
    const password = formData.get('password') as string;

    // Validate required fields
    if (!name || !email || !nic || !mobile || !address || !password) {
      return NextResponse.json(
        { message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { nic: nic }
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

    // Create director - DON'T manually hash password, let the model's pre-save hook handle it
    const director = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      nic: nic.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      password: password, // Don't hash here - let the pre-save hook do it
      role: 'director',
      profilePicture: profilePicturePath,
      isActive: true,
      managingDepartments: [], // Initialize with empty array
    });

    console.log('Creating director with password length:', password.length);
    await director.save();
    console.log('Director created successfully');

    // Prepare response
    const directorResponse = director.toObject();
    delete directorResponse.password;

    // Ensure all required fields are present with proper defaults
    const completeDirectorResponse = {
      _id: directorResponse._id,
      name: directorResponse.name,
      email: directorResponse.email,
      nic: directorResponse.nic,
      mobile: directorResponse.mobile,
      address: directorResponse.address,
      role: directorResponse.role,
      isActive: directorResponse.isActive,
      managingDepartments: directorResponse.managingDepartments || [],
      profilePicture: directorResponse.profilePicture,
      createdAt: directorResponse.createdAt,
      updatedAt: directorResponse.updatedAt,
    };

    return NextResponse.json({
      message: 'Director created successfully',
      director: completeDirectorResponse,
      generatedPassword: password // Return the original password for display
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create director error:', error);
    
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { message: `${field === 'email' ? 'Email' : 'NIC'} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}