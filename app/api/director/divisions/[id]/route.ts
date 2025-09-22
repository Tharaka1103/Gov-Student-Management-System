import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Division from '@/models/Division';
import Employee from '@/models/Employee';

// GET single division
export async function GET(request: NextRequest) {
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

    await dbConnect();
    const division = await Division.findOne({
      _id: divisionId,
      director: user._id
    })
      .populate('employees', 'name email profilePicture isActive mobile nic degree servicePeriod dateOfJoiningService')
      .populate('headProgramOfficer', 'name email profilePicture')
      .populate('subProgramOfficer', 'name email profilePicture');

    if (!division) {
      return NextResponse.json({ error: 'Division not found' }, { status: 404 });
    }

    return NextResponse.json({ division });
  } catch (error) {
    console.error('Get division error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE division
export async function PUT(request: NextRequest) {
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

    const { name, description, employees, headProgramOfficer, subProgramOfficer } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Division name is required' }, { status: 400 });
    }

    await dbConnect();

    // Check if division exists and belongs to director
    const existingDivision = await Division.findOne({
      _id: divisionId,
      director: user._id
    });

    if (!existingDivision) {
      return NextResponse.json({ error: 'Division not found' }, { status: 404 });
    }

    // Check if name is unique (excluding current division)
    const nameExists = await Division.findOne({
      name: name.trim(),
      _id: { $ne: divisionId }
    });

    if (nameExists) {
      return NextResponse.json({ error: 'Division name already exists' }, { status: 400 });
    }

    // Validate employees belong to this director
    if (employees && employees.length > 0) {
      const validEmployees = await Employee.find({
        _id: { $in: employees },
        director: user._id
      });
      
      if (validEmployees.length !== employees.length) {
        return NextResponse.json({ error: 'Some employees do not belong to you' }, { status: 400 });
      }

      // Remove employees from other divisions (excluding current division)
      await Division.updateMany(
        { director: user._id, _id: { $ne: divisionId } },
        { $pull: { employees: { $in: employees } } }
      );
    }

    const updatedDivision = await Division.findByIdAndUpdate(
      divisionId,
      {
        name: name.trim(),
        description: description?.trim(),
        employees: employees || [],
        headProgramOfficer: headProgramOfficer || null,
        subProgramOfficer: subProgramOfficer || null
      },
      { new: true }
    )
      .populate('employees', 'name email profilePicture isActive mobile nic degree servicePeriod dateOfJoiningService')
      .populate('headProgramOfficer', 'name email profilePicture')
      .populate('subProgramOfficer', 'name email profilePicture');

    return NextResponse.json({ division: updatedDivision });
  } catch (error) {
    console.error('Update division error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE division
export async function DELETE(request: NextRequest) {
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

    await dbConnect();

    const division = await Division.findOne({
      _id: divisionId,
      director: user._id
    });

    if (!division) {
      return NextResponse.json({ error: 'Division not found' }, { status: 404 });
    }

    await Division.findByIdAndDelete(divisionId);

    return NextResponse.json({ message: 'Division deleted successfully' });
  } catch (error) {
    console.error('Delete division error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}