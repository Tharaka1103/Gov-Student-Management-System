import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getCurrentUser, generateToken } from '@/lib/auth';
import { uploadProfilePicture, validateImageFile } from '@/lib/upload';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'director') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const employees = await User.find({ 
      director: currentUser._id,
      role: 'employee'
    })
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json({ employees });
  } catch (error) {
    console.error('Fetch employees error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'director') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const nic = formData.get('nic') as string;
    const mobile = formData.get('mobile') as string;
    const address = formData.get('address') as string;
    const servicePeriod = formData.get('servicePeriod') as string;
    const dateOfJoiningService = formData.get('dateOfJoiningService') as string;
    const degree = formData.get('degree') as string;
    const password = formData.get('password') as string;

    // Validate required fields
    if (!name || !nic || !mobile || !address || !servicePeriod || !dateOfJoiningService || !password) {
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
        ...(email ? [{ email: email.toLowerCase() }] : []),
        { nic: nic }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email?.toLowerCase() ? 'email' : 'NIC';
      return NextResponse.json(
        { message: `User with this ${field} already exists` },
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

    // Create employee user
    const employee = new User({
      name: name.trim(),
      email: email ? email.toLowerCase().trim() : undefined,
      nic: nic.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      password: password,
      role: 'employee',
      servicePeriod: servicePeriod.trim(),
      dateOfJoiningService: new Date(dateOfJoiningService),
      degree: degree?.trim() || undefined,
      director: currentUser._id,
      profilePicture: profilePicturePath,
      isActive: true
    });

    await employee.save();

    // Prepare response without password
    const employeeResponse = employee.toObject();
    delete employeeResponse.password;

    return NextResponse.json({
      message: 'Employee created successfully',
      employee: employeeResponse,
      generatedPassword: password
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create employee error:', error);
    
    if (error.code === 11000) {
      const field = error.keyPattern?.email ? 'email' : 'NIC';
      return NextResponse.json(
        { message: `User with this ${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}