import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import {Course} from '@/models/Course';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const courses = await Course.find({}).sort({ createdAt: -1 });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {

    await dbConnect();

    const body = await request.json();
    const { title, duration, description, price, availableSeats, instructor, category } = body;

    if (!title || !duration || !price || !availableSeats) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if course with same title already exists
    const existingCourse = await Course.findOne({ title });
    if (existingCourse) {
      return NextResponse.json({ message: 'Course with this title already exists' }, { status: 400 });
    }

    const course = new Course({
      title,
      duration,
      description,
      price,
      availableSeats,
      instructor,
      category,
      enrolledStudents: 0
    });

    await course.save();
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}