import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';
import { uploadProfilePicture, validateImageFile } from '@/lib/upload';
import { unlink } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const user = await User.findById(currentUser._id).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const formData = await req.formData();
    
    const updateData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      nic: formData.get('nic') as string,
      mobile: formData.get('mobile') as string,
      address: formData.get('address') as string,
    };

    // Handle profile picture upload
    let profilePictureUrl = currentUser.profilePicture;
    const profilePictureFile = formData.get('profilePicture') as File;

    if (profilePictureFile && profilePictureFile.size > 0) {
      const validation = validateImageFile(profilePictureFile);
      if (!validation.valid) {
        return NextResponse.json(
          { message: validation.error },
          { status: 400 }
        );
      }

      try {
        // Delete old profile picture if it exists
        if (currentUser.profilePicture) {
          try {
            const oldFilePath = path.join(process.cwd(), 'public', currentUser.profilePicture);
            await unlink(oldFilePath);
          } catch (deleteError) {
            console.log('Could not delete old profile picture:', deleteError);
          }
        }

        // Upload new profile picture
        profilePictureUrl = await uploadProfilePicture(profilePictureFile, currentUser._id);
      } catch (uploadError) {
        console.error('File upload failed:', uploadError);
        return NextResponse.json(
          { message: 'Failed to upload profile picture' },
          { status: 500 }
        );
      }
    }

    // Check if email or NIC is already taken by another user
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: currentUser._id } },
        { $or: [{ email: updateData.email }, { nic: updateData.nic }] }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email or NIC already exists' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      {
        ...updateData,
        profilePicture: profilePictureUrl,
      },
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Update profile error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Email or NIC already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Delete profile picture if it exists
    if (currentUser.profilePicture) {
      try {
        const filePath = path.join(process.cwd(), 'public', currentUser.profilePicture);
        await unlink(filePath);
      } catch (deleteError) {
        console.log('Could not delete profile picture:', deleteError);
      }
    }

    // Delete user account
    await User.findByIdAndDelete(currentUser._id);

    // Clear auth cookie
    const response = NextResponse.json({ 
      message: 'Account deleted successfully' 
    }, { status: 200 });
    
    response.cookies.delete('auth-token');
    
    return response;

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}