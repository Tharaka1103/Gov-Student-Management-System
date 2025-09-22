import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Division from '@/models/Division';
import Employee from '@/models/Employee';

// GET all divisions for director
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'director') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const divisions = await Division.find({ director: user._id })
      .populate('employees', 'name email profilePicture isActive')
      .populate('headProgramOfficer', 'name email profilePicture')
      .populate('subProgramOfficer', 'name email profilePicture')
      .sort({ createdAt: -1 });

    return NextResponse.json({ divisions });
  } catch (error) {
    console.error('Get divisions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// CREATE new division
export async function POST(request: NextRequest) {
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

    // Check if division name already exists
    const existingDivision = await Division.findOne({ name: name.trim() });
    if (existingDivision) {
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

      // Remove employees from other divisions
      await Division.updateMany(
        { director: user._id },
        { $pull: { employees: { $in: employees } } }
      );
    }

    const division = new Division({
      name: name.trim(),
      description: description?.trim(),
      director: user._id,
      employees: employees || [],
      headProgramOfficer: headProgramOfficer || null,
      subProgramOfficer: subProgramOfficer || null
    });

    await division.save();

    const populatedDivision = await Division.findById(division._id)
      .populate('employees', 'name email profilePicture isActive')
      .populate('headProgramOfficer', 'name email profilePicture')
      .populate('subProgramOfficer', 'name email profilePicture');

    return NextResponse.json({ division: populatedDivision }, { status: 201 });
  } catch (error) {
    console.error('Create division error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}