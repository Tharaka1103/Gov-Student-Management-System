import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Division from '@/models/Division';

// GET employee stats
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'employee') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find employee's division
    const division = await Division.findOne({
      employees: user._id
    }).populate('employees', 'isActive');

    let stats = {
      divisionAssigned: !!division,
      divisionName: division?.name || null,
      totalDivisionMembers: 0,
      activeDivisionMembers: 0,
      isOfficer: false,
      officerRole: null,
      joiningDate: user.dateOfJoiningService,
      servicePeriod: user.servicePeriod,
      council: user.council
    };

    if (division) {
      stats.totalDivisionMembers = division.employees ? division.employees.length : 0;
      stats.activeDivisionMembers = division.employees ? 
        division.employees.filter(emp => emp.isActive).length : 0;
      
      // Check officer roles
      if (division.headProgramOfficer?.toString() === user._id) {
        stats.isOfficer = true;
        stats.officerRole = 'Head Program Officer';
      } else if (division.subProgramOfficer?.toString() === user._id) {
        stats.isOfficer = true;
        stats.officerRole = 'Sub Program Officer';
      }
    }

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Get employee stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}