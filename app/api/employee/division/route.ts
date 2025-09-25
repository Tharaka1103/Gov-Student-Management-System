import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Division from '@/models/Division';

// GET employee's division details
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'employee') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find the division where this employee is assigned
    const division = await Division.findOne({
      employees: user._id
    })
      .populate({
        path: 'employees',
        match: { role: 'employee' },
        select: 'name email profilePicture isActive council degree servicePeriod'
      })
      .populate({
        path: 'headProgramOfficer',
        match: { role: 'employee' },
        select: 'name email profilePicture council'
      })
      .populate({
        path: 'subProgramOfficer',
        match: { role: 'employee' },
        select: 'name email profilePicture council'
      })
      .populate({
        path: 'director',
        select: 'name email profilePicture managingDepartments'
      });

    if (!division) {
      return NextResponse.json({ 
        division: null,
        message: 'Employee is not assigned to any division'
      });
    }

    // Calculate additional stats
    const totalMembers = division.employees ? division.employees.length : 0;
    const activeMembers = division.employees ? division.employees.filter((emp: { isActive: any; }) => emp.isActive).length : 0;
    
    // Check if current user is an officer
    const isHeadOfficer = division.headProgramOfficer?._id.toString() === user._id;
    const isSubOfficer = division.subProgramOfficer?._id.toString() === user._id;

    const divisionData = {
      ...division.toObject(),
      stats: {
        totalMembers,
        activeMembers,
        inactiveMembers: totalMembers - activeMembers
      },
      userRole: {
        isHeadOfficer,
        isSubOfficer,
        isMember: !isHeadOfficer && !isSubOfficer
      }
    };

    return NextResponse.json({ division: divisionData });
  } catch (error) {
    console.error('Get employee division error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}