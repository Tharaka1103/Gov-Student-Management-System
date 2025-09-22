import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Division from '@/models/Division';

// REMOVE employee from division
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'director') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get division ID from URL search parameters
    const divisionId = request.nextUrl.searchParams.get('id');
    
    if (!divisionId) {
      return NextResponse.json({ error: 'Division ID is required' }, { status: 400 });
    }

    const { employeeId } = await request.json();

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    await dbConnect();

    // Check if division exists and belongs to director
    const division = await Division.findOne({
      _id: divisionId,
      director: user._id
    });

    if (!division) {
      return NextResponse.json({ error: 'Division not found' }, { status: 404 });
    }

    // Remove employee from division
    await Division.findByIdAndUpdate(
      divisionId,
      { 
        $pull: { employees: employeeId },
        $unset: {
          ...(division.headProgramOfficer?.toString() === employeeId && { headProgramOfficer: 1 }),
          ...(division.subProgramOfficer?.toString() === employeeId && { subProgramOfficer: 1 })
        }
      }
    );

    const updatedDivision = await Division.findById(divisionId)
      .populate('employees', 'name email profilePicture isActive mobile nic degree servicePeriod dateOfJoiningService')
      .populate('headProgramOfficer', 'name email profilePicture')
      .populate('subProgramOfficer', 'name email profilePicture');

    return NextResponse.json({ division: updatedDivision });
  } catch (error) {
    console.error('Remove employee from division error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}