import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { getCurrentUser } from '@/lib/auth';
import { uploadProfilePicture, validateImageFile } from '@/lib/upload';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'director') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const employees = await Employee.find({ director: currentUser._id })
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
    
    const employeeData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      nic: formData.get('nic') as string,
      mobile: formData.get('mobile') as string,
      address: formData.get('address') as string,
      servicePeriod: formData.get('servicePeriod') as string,
      dateOfJoiningService: new Date(formData.get('dateOfJoiningService') as string),
      degree: formData.get('degree') as string || undefined,
      director: currentUser._id,
    };

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({
      $or: [
        { email: employeeData.email.toLowerCase() },
        { nic: employeeData.nic }
      ]
    });

    if (existingEmployee) {
      return NextResponse.json(
        { message: 'Employee with this email or NIC already exists' },
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

    const employee = new Employee({
      ...employeeData,
      email: employeeData.email.toLowerCase(),
      profilePicture: profilePicturePath
    });

    await employee.save();

    return NextResponse.json({
      message: 'Employee created successfully',
      employee
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create employee error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Employee with this email or NIC already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}