import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Workshop from '@/models/Workshop';
import { getCurrentUser } from '@/lib/auth';
import { uploadProfilePicture, validateImageFile } from '@/lib/upload';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; studentId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'employee') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id: workshopId, studentId } = await params;

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return NextResponse.json({ message: 'Workshop not found' }, { status: 404 });
    }

    // Check if workshop belongs to current auditor
    if (workshop.internalAuditor.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Find the student to be removed
    const studentIndex = workshop.students.findIndex(
      (student: any) => student._id.toString() === studentId
    );

    if (studentIndex === -1) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // Get student data before removal (for cleanup)
    const studentToRemove = workshop.students[studentIndex];

    // Remove profile picture if it exists
    if (studentToRemove.profilePicture) {
      try {
        const filePath = path.join(process.cwd(), 'public', studentToRemove.profilePicture);
        await unlink(filePath);
      } catch (fileError) {
        console.log('Could not delete profile picture:', fileError);
        // Continue with student removal even if file deletion fails
      }
    }

    // Remove student from array
    workshop.students.splice(studentIndex, 1);

    // Save the workshop
    await workshop.save();

    return NextResponse.json({
      message: 'Student removed successfully',
      removedStudent: {
        _id: studentToRemove._id,
        name: studentToRemove.name,
        email: studentToRemove.email
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Remove student error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; studentId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'employee') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id: workshopId, studentId } = await params;

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return NextResponse.json({ message: 'Workshop not found' }, { status: 404 });
    }

    // Check if workshop belongs to current auditor
    if (workshop.internalAuditor.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Find the specific student
    const student = workshop.students.find(
      (student: any) => student._id.toString() === studentId
    );

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({
      student: student
    }, { status: 200 });

  } catch (error) {
    console.error('Get student error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; studentId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'employee') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id: workshopId, studentId } = await params;
    const formData = await req.formData();

    // Extract updated student data
    const updatedData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      nic: formData.get('nic') as string,
      mobile: formData.get('mobile') as string,
      council: formData.get('council') as string,
    };

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return NextResponse.json({ message: 'Workshop not found' }, { status: 404 });
    }

    // Check if workshop belongs to current auditor
    if (workshop.internalAuditor.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Find the student to update
    const studentIndex = workshop.students.findIndex(
      (student: any) => student._id.toString() === studentId
    );

    if (studentIndex === -1) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const existingStudent = workshop.students[studentIndex];

    // Handle profile picture upload if provided
    let profilePictureUrl = existingStudent.profilePicture;
    const profilePictureFile = formData.get('profilePicture') as File;

    if (profilePictureFile && profilePictureFile.size > 0) {
      // Validate the file
      const validation = validateImageFile(profilePictureFile);
      if (!validation.valid) {
        return NextResponse.json(
          { message: validation.error },
          { status: 400 }
        );
      }

      try {
        // Delete old profile picture if it exists
        if (existingStudent.profilePicture) {
          try {
            const oldFilePath = path.join(process.cwd(), 'public', existingStudent.profilePicture);
            await unlink(oldFilePath);
          } catch (deleteError) {
            console.log('Could not delete old profile picture:', deleteError);
          }
        }

        // Upload new profile picture
        const tempUserId = `student-${existingStudent._id}`;
        profilePictureUrl = await uploadProfilePicture(profilePictureFile, tempUserId);
      } catch (uploadError) {
        console.error('File upload failed:', uploadError);
        return NextResponse.json(
          { message: 'Failed to upload profile picture' },
          { status: 500 }
        );
      }
    }

    // Update only the specific fields while preserving all existing data
    workshop.students[studentIndex].name = updatedData.name;
    workshop.students[studentIndex].email = updatedData.email;
    workshop.students[studentIndex].nic = updatedData.nic;
    workshop.students[studentIndex].council = updatedData.council;
    workshop.students[studentIndex].mobile = updatedData.mobile;
    workshop.students[studentIndex].profilePicture = profilePictureUrl;

    // Use markModified to ensure Mongoose tracks the changes
    workshop.markModified('students');
    await workshop.save();

    return NextResponse.json({
      message: 'Student updated successfully',
      student: workshop.students[studentIndex]
    }, { status: 200 });

  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}