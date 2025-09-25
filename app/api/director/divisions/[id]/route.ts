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

// GET single division
export async function GET(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'director') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const id = await getParamsId(params);

    const division = await Division.findOne({
      _id: id,
      director: user._id
    })
      .populate({
        path: 'employees',
        match: { role: 'employee' },
        select: 'name email profilePicture isActive mobile nic degree servicePeriod dateOfJoiningService'
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
export async function PUT(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'director') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, employees, headProgramOfficer, subProgramOfficer } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Division name is required' }, { status: 400 });
    }

    await dbConnect();
    const id = await getParamsId(params);

    // Check if division exists and belongs to director
    const existingDivision = await Division.findOne({
      _id: id,
      director: user._id
    });

    if (!existingDivision) {
      return NextResponse.json({ error: 'Division not found' }, { status: 404 });
    }

    // Check if name is unique (excluding current division)
    const nameExists = await Division.findOne({
      name: name.trim(),
      _id: { $ne: id }
    });

    if (nameExists) {
      return NextResponse.json({ error: 'Division name already exists' }, { status: 400 });
    }

    // Validate employees belong to this director and are employees
    if (employees && employees.length > 0) {
      const validEmployees = await User.find({
        _id: { $in: employees },
        director: user._id,
        role: 'employee'
      });

      if (validEmployees.length !== employees.length) {
        return NextResponse.json({ error: 'Some employees do not belong to you or are not employees' }, { status: 400 });
      }

      // Remove employees from other divisions (excluding current division)
      await Division.updateMany(
        { director: user._id, _id: { $ne: id } },
        { $pull: { employees: { $in: employees } } }
      );
    }

    // Validate head and sub program officers
    if (headProgramOfficer) {
      const validHead = await User.findOne({
        _id: headProgramOfficer,
        director: user._id,
        role: 'employee'
      });
      if (!validHead) {
        return NextResponse.json({ error: 'Head Program Officer not found or invalid' }, { status: 400 });
      }
    }

    if (subProgramOfficer) {
      const validSub = await User.findOne({
        _id: subProgramOfficer,
        director: user._id,
        role: 'employee'
      });
      if (!validSub) {
        return NextResponse.json({ error: 'Sub Program Officer not found or invalid' }, { status: 400 });
      }
    }

    const updatedDivision = await Division.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description?.trim(),
        employees: employees || [],
        headProgramOfficer: headProgramOfficer || null,
        subProgramOfficer: subProgramOfficer || null
      },
      { new: true }
    )
      .populate({
        path: 'employees',
        match: { role: 'employee' },
        select: 'name email profilePicture isActive mobile nic degree servicePeriod dateOfJoiningService'
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

    return NextResponse.json({ division: updatedDivision });
  } catch (error) {
    console.error('Update division error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE division
export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'director') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const id = await getParamsId(params);

    const division = await Division.findOne({
      _id: id,
      director: user._id
    });

    if (!division) {
      return NextResponse.json({ error: 'Division not found' }, { status: 404 });
    }

    await Division.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Division deleted successfully' });
  } catch (error) {
    console.error('Delete division error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}