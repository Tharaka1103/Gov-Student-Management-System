import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'director') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const totalEmployees = await Employee.countDocuments({ director: currentUser._id });
    const activeDepartments = currentUser.managingDepartments?.length || 0;

    const stats = {
      totalEmployees,
      activeDepartments,
      pendingTasks: 5, // This would come from a tasks collection
      completedProjects: 12, // This would come from a projects collection
      departmentPerformance: 'Excellent'
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Fetch director stats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}