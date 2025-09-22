import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';
import { uploadProfilePicture, validateImageFile } from '@/lib/upload';

// GET specific director
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get director ID from URL search parameters
    const directorId = request.nextUrl.searchParams.get('id');
    
    if (!directorId) {
      return NextResponse.json({ message: 'Director ID is required' }, { status: 400 });
    }

    await dbConnect();
    const director = await User.findById(directorId)
      .select('-password')
      .populate('employees', 'name email department')
      .lean();

    if (!director) {
      return NextResponse.json({ message: 'Director not found' }, { status: 404 });
    }

    return NextResponse.json({ director });
  } catch (error) {
    console.error('Get director error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE director
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get director ID from URL search parameters
    const directorId = request.nextUrl.searchParams.get('id');
    
    if (!directorId) {
      return NextResponse.json({ message: 'Director ID is required' }, { status: 400 });
    }

    await dbConnect();

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const nic = formData.get('nic') as string;
    const mobile = formData.get('mobile') as string;
    const address = formData.get('address') as string;
    const isActive = formData.get('isActive') === 'true';
    const managingDepartments = JSON.parse(formData.get('managingDepartments') as string);
    const profilePictureFile = formData.get('profilePicture') as File;

    // Check if director exists
    const existingDirector = await User.findById(directorId);
    if (!existingDirector || existingDirector.role !== 'director') {
      return NextResponse.json({ message: 'Director not found' }, { status: 404 });
    }

    // Check for duplicate email/nic (excluding current director)
    const duplicate = await User.findOne({
      $and: [
        { _id: { $ne: directorId } },
        { $or: [{ email }, { nic }] }
      ]
    });

    if (duplicate) {
      return NextResponse.json(
        { message: 'Email or NIC already exists' },
        { status: 400 }
      );
    }

    // Handle profile picture upload
    let profilePicture = existingDirector.profilePicture;
    if (profilePictureFile && profilePictureFile.size > 0) {
      const validation = validateImageFile(profilePictureFile);
      if (!validation.valid) {
        return NextResponse.json(
          { message: validation.error },
          { status: 400 }
        );
      }
      profilePicture = await uploadProfilePicture(profilePictureFile, directorId);
    }

    // Update director
    const updatedDirector = await User.findByIdAndUpdate(
      directorId,
      {
        name,
        email,
        nic,
        mobile,
        address,
        isActive,
        managingDepartments,
        profilePicture
      },
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({
      message: 'Director updated successfully',
      director: updatedDirector
    });

  } catch (error) {
    console.error('Update director error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE director
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get director ID from URL search parameters
    const directorId = request.nextUrl.searchParams.get('id');
    
    if (!directorId) {
      return NextResponse.json({ message: 'Director ID is required' }, { status: 400 });
    }

    await dbConnect();

    const director = await User.findById(directorId);
    if (!director || director.role !== 'director') {
      return NextResponse.json({ message: 'Director not found' }, { status: 404 });
    }

    await User.findByIdAndDelete(directorId);

    return NextResponse.json({
      message: 'Director deleted successfully'
    });

  } catch (error) {
    console.error('Delete director error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}