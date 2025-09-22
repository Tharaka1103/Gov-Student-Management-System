import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Workshop from '@/models/Workshop';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'internal_auditor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const workshops = await Workshop.find({ internalAuditor: currentUser._id });
    
    const totalWorkshops = workshops.length;
    const activeWorkshops = workshops.filter(w => w.status === 'ongoing').length;
    const completedWorkshops = workshops.filter(w => w.status === 'completed').length;
    const upcomingWorkshops = workshops.filter(w => w.status === 'upcoming').length;
    
    const totalStudents = workshops.reduce((sum, workshop) => sum + workshop.students.length, 0);
    
    const successRate = totalWorkshops > 0 
      ? Math.round((completedWorkshops / totalWorkshops) * 100)
      : 0;

    const stats = {
      totalWorkshops,
      activeWorkshops,
      totalStudents,
      completedWorkshops,
      upcomingWorkshops,
      workshopSuccessRate: `${successRate}%`
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Fetch auditor stats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}