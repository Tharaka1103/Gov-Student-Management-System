import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Division from '@/models/Division';
import Employee from '@/models/Employee';

// Helper function to handle both sync and async params
async function getParamsId(params: any): Promise<string> {
  // Check if params is a Promise (new Next.js) or object (old Next.js)
  if (params && typeof params.then === 'function') {
    const resolvedParams = await params;
    return resolvedParams.id;
  }
  return params.id;
}
// ADD employee to division
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

    // Check if employee exists and belongs to director
    const employee = await Employee.findOne({
      _id: employeeId,
      director: user._id
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if employee is already in this division
    if (division.employees.includes(employeeId)) {
      return NextResponse.json({ error: 'Employee already in this division' }, { status: 400 });
    }

    // Remove employee from other divisions
    await Division.updateMany(
      { director: user._id, _id: { $ne: params.id } },
      { $pull: { employees: employeeId } }
    );

    // Add employee to current division
    await Division.findByIdAndUpdate(
      params.id,
      { $addToSet: { employees: employeeId } }
    );

    const updatedDivision = await Division.findById(params.id)
      .populate('employees', 'name email profilePicture isActive mobile nic degree servicePeriod dateOfJoiningService')
      .populate('headProgramOfficer', 'name email profilePicture')
      .populate('subProgramOfficer', 'name email profilePicture');

    return NextResponse.json({ division: updatedDivision });
  } catch (error) {
    console.error('Add employee to division error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}