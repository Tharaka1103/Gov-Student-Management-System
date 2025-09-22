import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Workshop from '@/models/Workshop';
import { getCurrentUser } from '@/lib/auth';
import { uploadProfilePicture, validateImageFile } from '@/lib/upload'; // Import your upload functions
import mongoose from 'mongoose';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'internal_auditor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const formData = await req.formData();
    const { id: workshopId } = await params;

    // Extract student data from FormData
    const studentData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      nic: formData.get('nic') as string,
      mobile: formData.get('mobile') as string,
      address: formData.get('address') as string,
    };

    // Handle profile picture upload
    const profilePictureFile = formData.get('profilePicture') as File;
    let profilePictureUrl = null;

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
        // Generate a unique user ID for the filename (you can use enrollment number or generate one)
        const tempUserId = `student-${Date.now()}`;
        profilePictureUrl = await uploadProfilePicture(profilePictureFile, tempUserId);
      } catch (uploadError) {
        console.error('File upload failed:', uploadError);
        return NextResponse.json(
          { message: 'Failed to upload profile picture' },
          { status: 500 }
        );
      }
    }

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return NextResponse.json({ message: 'Workshop not found' }, { status: 404 });
    }

    // Check if workshop belongs to current auditor
    if (workshop.internalAuditor.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if workshop is full
    if (workshop.students.length >= workshop.maxParticipants) {
      return NextResponse.json(
        { message: 'Workshop is full' },
        { status: 400 }
      );
    }

    // Check if student already exists
    const existingStudent = workshop.students.find(
      (student: { nic: any; email: any; }) => 
        student.nic === studentData.nic || student.email === studentData.email
    );

    if (existingStudent) {
      return NextResponse.json(
        { message: 'Student with this NIC or email already enrolled' },
        { status: 400 }
      );
    }

    // Generate enrollment number
    const enrollmentNumber = `WS${workshop._id.toString().slice(-6).toUpperCase()}${(workshop.students.length + 1).toString().padStart(3, '0')}`;

    const newStudent = {
      _id: new mongoose.Types.ObjectId(), // Ensure unique ID
      ...studentData,
      profilePicture: profilePictureUrl, // This will now contain the actual file path
      enrollmentNumber,
      enrollmentDate: new Date(),
      status: 'enrolled'
    };

    workshop.students.push(newStudent);
    await workshop.save();

    return NextResponse.json({
      message: 'Student enrolled successfully',
      student: newStudent
    }, { status: 201 });

  } catch (error) {
    console.error('Enroll student error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}