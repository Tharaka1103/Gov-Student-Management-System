import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib//db';
import Student from '@/models/Student';
import {Course} from '@/models/Course';

export async function GET(request: NextRequest) {
  try {

    await dbConnect();
    
    const students = await Student.find({})
      .populate('enrolledCourses.courseId', 'title duration price')
      .sort({ createdAt: -1 });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {

    await dbConnect();

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      dateOfBirth,
      nic,
      guardianName,
      guardianPhone,
      courseIds,
      previousEducation,
      previousInstitution,
      notes,
      status
    } = body;

    // Check if student with email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return NextResponse.json({ message: 'Student with this email already exists' }, { status: 400 });
    }

    // Generate student ID
    const studentCount = await Student.countDocuments();
    const studentId = `STU${String(studentCount + 1).padStart(6, '0')}`;

    // Calculate age
    const birthDate = new Date(dateOfBirth);
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    // Prepare enrolled courses
    const enrolledCourses = courseIds.map((courseId: string) => ({
      courseId,
      enrollmentDate: new Date(),
      status: 'active',
      progress: 0
    }));

    const student = new Student({
      studentId,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      phone,
      address,
      dateOfBirth,
      nic,
      guardianName,
      guardianPhone,
      enrolledCourses,
      academicInfo: {
        previousEducation,
        previousInstitution
      },
      status: status || 'active',
      enrollmentDate: new Date(),
      notes,
      age
    });

    await student.save();

    // Update course enrollment counts
    for (const courseId of courseIds) {
      await Course.findByIdAndUpdate(courseId, {
        $inc: { enrolledStudents: 1, availableSeats: -1 }
      });
    }

    const populatedStudent = await Student.findById(student._id)
      .populate('enrolledCourses.courseId', 'title duration price');

    return NextResponse.json(populatedStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}