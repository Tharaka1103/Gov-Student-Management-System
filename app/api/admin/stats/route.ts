import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Employee from '@/models/Employee';
import Workshop from '@/models/Workshop';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const [totalDirectors, totalAdmins, totalEmployees, totalWorkshops] = await Promise.all([
      User.countDocuments({ role: 'director' }),
      User.countDocuments({ role: 'admin' }),
      Employee.countDocuments(),
      Workshop.countDocuments(),
    ]);

    const activeUsers = await User.countDocuments({ isActive: true });

    const stats = {
      totalDirectors,
      totalAdmins,
      totalEmployees,
      totalWorkshops,
      activeUsers,
      systemHealth: 'Excellent'
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}