import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Workshop from '@/models/Workshop';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'internal_auditor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const workshops = await Workshop.find({ internalAuditor: currentUser._id })
      .sort({ createdAt: -1 });

    return NextResponse.json({ workshops });
  } catch (error) {
    console.error('Fetch workshops error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'internal_auditor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const workshopData = await req.json();

    // Validate dates
    const startDate = new Date(workshopData.startDate);
    const endDate = new Date(workshopData.endDate);
    
    if (startDate >= endDate) {
      return NextResponse.json(
        { message: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (startDate < new Date()) {
      return NextResponse.json(
        { message: 'Start date cannot be in the past' },
        { status: 400 }
      );
    }

    const workshop = new Workshop({
      ...workshopData,
      internalAuditor: currentUser._id,
      students: []
    });

    await workshop.save();

    return NextResponse.json({
      message: 'Workshop created successfully',
      workshop
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create workshop error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}