import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Workshop from '@/models/Workshop';
import { getCurrentUser } from '@/lib/auth';

// Helper function to handle both sync and async params
async function getParamsId(params: any): Promise<string> {
  // Check if params is a Promise (new Next.js) or object (old Next.js)
  if (params && typeof params.then === 'function') {
    const resolvedParams = await params;
    return resolvedParams.id;
  }
  return params.id;
}

export async function GET(
  req: NextRequest,
  { params }: { params: any } // Changed from { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'internal_auditor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = await getParamsId(params);
    await dbConnect();

    const workshop = await Workshop.findById(id);

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

export async function PUT(
  req: NextRequest,
  { params }: { params: any } // Changed from { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'internal_auditor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = await getParamsId(params);
    await dbConnect();
    
    const updateData = await req.json();

    const workshop = await Workshop.findById(id);
    if (!workshop) {
      return NextResponse.json({ message: 'Workshop not found' }, { status: 404 });
    }

    // Check if workshop belongs to current auditor
    if (workshop.internalAuditor.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      id, // Fixed: was using params.id instead of id
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: any } // Changed from { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'internal_auditor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = await getParamsId(params);
    await dbConnect();

    const workshop = await Workshop.findById(id);

    if (!workshop) {
      return NextResponse.json({ message: 'Workshop not found' }, { status: 404 });
    }

    // Check if workshop belongs to current auditor
    if (workshop.internalAuditor.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await Workshop.findByIdAndDelete(id); // Fixed: was using params.id instead of id

    return NextResponse.json({ message: 'Workshop deleted successfully' });
  } catch (error) {
    console.error('Delete workshop error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}