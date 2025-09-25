'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Building,
  Calendar,
  Mail,
  User
} from 'lucide-react';

interface DivisionDetailsCardProps {
  division: any;
}

export default function DivisionDetailsCard({ division }: DivisionDetailsCardProps) {
  if (!division) {
    return (
      <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-orange-600" />
            <span>Division Assignment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Division Assigned</h3>
            <p className="text-gray-600">You are not currently assigned to any division.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="backdrop-blur-xl bg-white/40 border border-red-900">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-blue-600" />
            <span>My Division</span>
          </div>
          <Badge variant="default" className="bg-blue-100 text-blue-700">
            Active Member
          </Badge>
        </CardTitle>
        <CardDescription>
          Your division details and team information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Division Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{division.name}</h2>
          {division.description && (
            <p className="text-gray-600">{division.description}</p>
          )}
          
          {/* User Role Badge */}
          {division.userRole.isHeadOfficer && (
            <Badge className="bg-yellow-100 text-yellow-800">
              <Crown className="w-3 h-3 mr-1" />
              Head Program Officer
            </Badge>
          )}
          {division.userRole.isSubOfficer && (
            <Badge className="bg-purple-100 text-purple-800">
              <Shield className="w-3 h-3 mr-1" />
              Sub Program Officer
            </Badge>
          )}
          {division.userRole.isMember && (
            <Badge variant="outline">
              <User className="w-3 h-3 mr-1" />
              Division Member
            </Badge>
          )}
        </div>

        <Separator className='bg-red-900'/>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/30 rounded-lg">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{division.stats.totalMembers}</div>
            <p className="text-xs text-gray-600">Total Members</p>
          </div>
          <div className="text-center p-4 bg-white/30 rounded-lg">
            <UserCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{division.stats.activeMembers}</div>
            <p className="text-xs text-gray-600">Active Members</p>
          </div>
          <div className="text-center p-4 bg-white/30 rounded-lg">
            <UserX className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{division.stats.inactiveMembers}</div>
            <p className="text-xs text-gray-600">Inactive Members</p>
          </div>
        </div>

        <Separator className='bg-red-900'/>

        {/* Leadership */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Crown className="w-4 h-4 mr-2 text-yellow-600" />
            Division Leadership
          </h3>
          
          {/* Director */}
          <div className="flex items-center space-x-3 p-3 bg-white/20 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src={division.director?.profilePicture} alt={division.director?.name} />
              <AvatarFallback className="bg-blue-500 text-white">
                {division.director?.name?.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{division.director?.name}</p>
              <p className="text-sm text-gray-600">Director</p>
            </div>
            <Badge variant="outline" className="text-xs">Director</Badge>
          </div>

          {/* Head Program Officer */}
          {division.headProgramOfficer && (
            <div className="flex items-center space-x-3 p-3 bg-white/20 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarImage src={division.headProgramOfficer.profilePicture} alt={division.headProgramOfficer.name} />
                <AvatarFallback className="bg-yellow-500 text-white">
                  {division.headProgramOfficer.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{division.headProgramOfficer.name}</p>
                <p className="text-sm text-gray-600">Head Program Officer</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Head
              </Badge>
            </div>
          )}

          {/* Sub Program Officer */}
          {division.subProgramOfficer && (
            <div className="flex items-center space-x-3 p-3 bg-white/20 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarImage src={division.subProgramOfficer.profilePicture} alt={division.subProgramOfficer.name} />
                <AvatarFallback className="bg-purple-500 text-white">
                  {division.subProgramOfficer.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{division.subProgramOfficer.name}</p>
                <p className="text-sm text-gray-600">Sub Program Officer</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800 text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Sub
              </Badge>
            </div>
          )}
        </div>

        <Separator className='bg-red-900'/>

        {/* Division Info */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Division Information</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Created:</span>
              <span className="font-medium">{formatDate(division.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">{formatDate(division.updatedAt)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Status:</span>
              <Badge variant={division.isActive ? "default" : "secondary"}>
                {division.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}