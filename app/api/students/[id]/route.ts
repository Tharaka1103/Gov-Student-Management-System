import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { Course } from '@/models/Course';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params; // ✅ await params
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

    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // Check if email is taken by another student
    const existingStudent = await Student.findOne({
      email,
      _id: { $ne: id }
    });
    if (existingStudent) {
      return NextResponse.json({ message: 'Email already taken by another student' }, { status: 400 });
    }

    // Calculate age
    const birthDate = new Date(dateOfBirth);
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    // Update course enrollments
    const oldCourseIds = student.enrolledCourses.map((ec: { courseId: { toString: () => any } }) =>
      ec.courseId.toString()
    );
    const newCourseIds = courseIds || [];

    const coursesToRemove = oldCourseIds.filter((id: any) => !newCourseIds.includes(id));
    const coursesToAdd = newCourseIds.filter((id: any) => !oldCourseIds.includes(id));

    for (const courseId of coursesToRemove) {
      await Course.findByIdAndUpdate(courseId, {
        $inc: { enrolledStudents: -1, availableSeats: 1 }
      });
    }

    for (const courseId of coursesToAdd) {
      await Course.findByIdAndUpdate(courseId, {
        $inc: { enrolledStudents: 1, availableSeats: -1 }
      });
    }

    const enrolledCourses = newCourseIds.map((courseId: string) => {
      const existingEnrollment = student.enrolledCourses.find(
        (ec: { courseId: { toString: () => string } }) => ec.courseId.toString() === courseId
      );

      return (
        existingEnrollment || {
          courseId,
          enrollmentDate: new Date(),
          status: 'active',
          progress: 0
        }
      );
    });

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
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
        status,
        notes,
        age,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('enrolledCourses.courseId', 'title duration price');

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params; // ✅ await params
    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // Update course enrollment counts
    for (const enrollment of student.enrolledCourses) {
      await Course.findByIdAndUpdate(enrollment.courseId, {
        $inc: { enrolledStudents: -1, availableSeats: 1 }
      });
    }

    await Student.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
