import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { uploadProfilePicture, validateImageFile } from '@/lib/upload';

// GET individual employee
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'director') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const employee = await Employee.findOne({
      _id: params.id,
      director: user._id
    });

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
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'director') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    const isActive = formData.get('isActive') === 'true';
    const profilePicture = formData.get('profilePicture') as File;

    if (!name || !email || !nic || !mobile || !address || !servicePeriod || !dateOfJoiningService) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if employee exists and belongs to this director
    const existingEmployee = await Employee.findOne({
      _id: params.id,
      director: user._id
    });

    if (!existingEmployee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check for unique constraints (excluding current employee)
    const emailExists = await Employee.findOne({
      email: email.toLowerCase(),
      _id: { $ne: params.id }
    });
    if (emailExists) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const nicExists = await Employee.findOne({
      nic,
      _id: { $ne: params.id }
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
      profilePictureUrl = await uploadProfilePicture(profilePicture, params.id);
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      params.id,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        nic: nic.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        servicePeriod,
        dateOfJoiningService: new Date(dateOfJoiningService),
        degree: degree?.trim() || undefined,
        profilePicture: profilePictureUrl,
        isActive
      },
      { new: true }
    );

    return NextResponse.json({ employee: updatedEmployee });
  } catch (error) {
    console.error('Update employee error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'director') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const employee = await Employee.findOne({
      _id: params.id,
      director: user._id
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    await Employee.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}