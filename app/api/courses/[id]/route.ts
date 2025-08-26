import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import {Course} from '@/models/Course';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    await dbConnect();

    const body = await request.json();
    const { title, duration, description, price, availableSeats, instructor, category } = body;

    const course = await Course.findById(params.id);
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Check if title is taken by another course
    const existingCourse = await Course.findOne({
      title,
      _id: { $ne: params.id }
    });

    if (existingCourse) {
      return NextResponse.json({ message: 'Course title already taken' }, { status: 400 });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      params.id,
      {
        title,
        duration,
        description,
        price,
        availableSeats,
        instructor,
        category,
        updatedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    await dbConnect();

    const course = await Course.findById(params.id);
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Check if course has enrolled students
    if (course.enrolledStudents > 0) {
      return NextResponse.json({ 
        message: 'Cannot delete course with enrolled students' 
      }, { status: 400 });
    }

    await Course.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}