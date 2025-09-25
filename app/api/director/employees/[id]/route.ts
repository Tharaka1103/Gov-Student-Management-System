import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { uploadProfilePicture, validateImageFile } from '@/lib/upload';

// Helper function to handle both sync and async params
async function getParamsId(params: any): Promise<string> {
  if (params && typeof params.then === 'function') {
    const resolvedParams = await params;
    return resolvedParams.id;
  }
  return params.id;
}

// GET individual employee
export async function GET(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'director') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = await getParamsId(params);

    await dbConnect();
    const employee = await User.findOne({
      _id: id,
      director: user._id,
      role: 'employee'
    }).select('-password');

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ employee });
  } catch (error) {
    console.error('Get employee error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE employee
export async function PUT(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'director') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = await getParamsId(params);

    await dbConnect();

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const nic = formData.get('nic') as string;
    const mobile = formData.get('mobile') as string;
    const address = formData.get('address') as string;
    const servicePeriod = formData.get('servicePeriod') as string;
    const dateOfJoiningService = formData.get('dateOfJoiningService') as string;
    const degree = formData.get('degree') as string;
    const council = formData.get('council') as string;
    const isActive = formData.get('isActive') === 'true';
    const profilePicture = formData.get('profilePicture') as File;

    if (!name || !nic || !mobile || !address || !servicePeriod || !dateOfJoiningService || !council) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if employee exists and belongs to this director
    const existingEmployee = await User.findOne({
      _id: id,
      director: user._id,
      role: 'employee'
    });

    if (!existingEmployee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check for unique constraints (excluding current employee)
    if (email) {
      const emailExists = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id }
      });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
    }

    const nicExists = await User.findOne({
      nic,
      _id: { $ne: id }
    });
    if (nicExists) {
      return NextResponse.json({ error: 'NIC already exists' }, { status: 400 });
    }

    let profilePictureUrl = existingEmployee.profilePicture;

    // Handle profile picture upload
    if (profilePicture && profilePicture.size > 0) {
      const validation = validateImageFile(profilePicture);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      profilePictureUrl = await uploadProfilePicture(profilePicture, id);
    }

    const updateData: any = {
      name: name.trim(),
      nic: nic.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      servicePeriod,
      dateOfJoiningService: new Date(dateOfJoiningService),
      degree: degree?.trim() || undefined,
      council: council.trim(),
      profilePicture: profilePictureUrl,
      isActive
    };

    // Only update email if provided
    if (email) {
      updateData.email = email.toLowerCase().trim();
    }

    const updatedEmployee = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');

    return NextResponse.json({ employee: updatedEmployee });
  } catch (error) {
    console.error('Update employee error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'director') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = await getParamsId(params);

    await dbConnect();

    const employee = await User.findOne({
      _id: id,
      director: user._id,
      role: 'employee'
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}