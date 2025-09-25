import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Division from '@/models/Division';
import User from '@/models/User';

// Helper function to handle both sync and async params
async function getParamsId(params: any): Promise<string> {
  // Check if params is a Promise (new Next.js) or object (old Next.js)
  if (params && typeof params.then === 'function') {
    const resolvedParams = await params;
    return resolvedParams.id;
  }
  return params.id;
}

// REMOVE employee from division
export async function POST(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'director') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { employeeId } = await request.json();

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    await dbConnect();
    const id = await getParamsId(params);

    // Check if division exists and belongs to director
    const division = await Division.findOne({
      _id: id,
      director: user._id
    });

    if (!division) {
      return NextResponse.json({ error: 'Division not found' }, { status: 404 });
    }

    // Verify that the employee exists and belongs to this director
    const employee = await User.findOne({
      _id: employeeId,
      director: user._id,
      role: 'employee'
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if employee is actually in this division
    if (!division.employees.includes(employeeId)) {
      return NextResponse.json({ error: 'Employee is not in this division' }, { status: 400 });
    }

    // Prepare update operations
    const updateOperations: any = {
      $pull: { employees: employeeId }
    };

    // Remove from officer positions if assigned
    const unsetOperations: any = {};
    if (division.headProgramOfficer?.toString() === employeeId) {
      unsetOperations.headProgramOfficer = 1;
    }
    if (division.subProgramOfficer?.toString() === employeeId) {
      unsetOperations.subProgramOfficer = 1;
    }

    if (Object.keys(unsetOperations).length > 0) {
      updateOperations.$unset = unsetOperations;
    }

    // Remove employee from division
    await Division.findByIdAndUpdate(id, updateOperations);

    const updatedDivision = await Division.findById(id)
      .populate({
        path: 'employees',
        match: { role: 'employee' },
        select: 'name email profilePicture isActive mobile nic degree servicePeriod dateOfJoiningService council'
      })
      .populate({
        path: 'headProgramOfficer',
        match: { role: 'employee' },
        select: 'name email profilePicture'
      })
      .populate({
        path: 'subProgramOfficer',
        match: { role: 'employee' },
        select: 'name email profilePicture'
      });

    return NextResponse.json({ 
      division: updatedDivision,
      message: 'Employee removed from division successfully'
    });
  } catch (error) {
    console.error('Remove employee from division error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}