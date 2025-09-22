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

    // Get workshop ID from URL search parameters
    const workshopId = req.nextUrl.searchParams.get('id');
    
    if (!workshopId) {
      return NextResponse.json({ message: 'Workshop ID is required' }, { status: 400 });
    }

    await dbConnect();
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      return NextResponse.json({ message: 'Workshop not found' }, { status: 404 });
    }

    // Check if workshop belongs to current auditor
    if (workshop.internalAuditor.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ workshop });
  } catch (error) {
    console.error('Fetch workshop error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'internal_auditor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get workshop ID from URL search parameters
    const workshopId = req.nextUrl.searchParams.get('id');
    
    if (!workshopId) {
      return NextResponse.json({ message: 'Workshop ID is required' }, { status: 400 });
    }

    await dbConnect();
    const updateData = await req.json();
    
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return NextResponse.json({ message: 'Workshop not found' }, { status: 404 });
    }

    // Check if workshop belongs to current auditor
    if (workshop.internalAuditor.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      message: 'Workshop updated successfully',
      workshop: updatedWorkshop
    });
  } catch (error) {
    console.error('Update workshop error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'internal_auditor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get workshop ID from URL search parameters
    const workshopId = req.nextUrl.searchParams.get('id');
    
    if (!workshopId) {
      return NextResponse.json({ message: 'Workshop ID is required' }, { status: 400 });
    }

    await dbConnect();
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      return NextResponse.json({ message: 'Workshop not found' }, { status: 404 });
    }

    // Check if workshop belongs to current auditor
    if (workshop.internalAuditor.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await Workshop.findByIdAndDelete(workshopId);

    return NextResponse.json({ message: 'Workshop deleted successfully' });
  } catch (error) {
    console.error('Delete workshop error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}