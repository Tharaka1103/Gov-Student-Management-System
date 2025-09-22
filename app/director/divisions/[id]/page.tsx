'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DirectorHeader from '@/components/layout/DirectorHeader';
import { User, Division, Employee } from '@/types';
import { toast } from 'sonner';

interface DivisionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DivisionDetailPage({ params }: DivisionDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [division, setDivision] = useState<Division | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchDivision();
    fetchAllEmployees();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchDivision = async () => {
    try {
      const response = await fetch(`/api/director/divisions/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch division');
      }
      const data = await response.json();
      setDivision(data.division);
    } catch (error) {
      console.error('Failed to fetch division:', error);
      toast.error('Failed to fetch division details');
      router.push('/director/divisions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const response = await fetch('/api/director/employees');
      if (response.ok) {
        const data = await response.json();
        setAllEmployees(data.employees);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleAddEmployee = async (employeeId: string) => {
    try {
      const response = await fetch(`/api/director/divisions/${id}/add-employee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add employee');
      }

      const data = await response.json();
      setDivision(data.division);
      setIsAddEmployeeDialogOpen(false);
      setSearchTerm('');
      toast.success('Employee added to division successfully!');
    } catch (error) {
      console.error('Add employee error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add employee');
    }
  };

  const handleRemoveEmployee = async (employeeId: string) => {
    try {
      const response = await fetch(`/api/director/divisions/${id}/remove-employee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove employee');
      }

      const data = await response.json();
      setDivision(data.division);
      toast.success('Employee removed from division successfully!');
    } catch (error) {
      console.error('Remove employee error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to remove employee');
    }
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!division) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DirectorHeader user={user} />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Division not found</h1>
            <p className="text-gray-600 mb-4 text-sm">The division you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/director/divisions')}
              className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Back to Divisions
            </button>
          </div>
        </div>
      </div>
    );
  }

  const employees = Array.isArray(division.employees) ? division.employees : [];
  const availableEmployees = allEmployees.filter(emp => 
    !employees.some((divEmp: any) => divEmp._id === emp._id)
  );
  const filteredAvailableEmployees = availableEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to safely get officer details
  const getOfficerDetails = (officer: string | Employee | null | undefined): Employee | null => {
    if (!officer) return null;
    if (typeof officer === 'string') return null;
    return officer as Employee;
  };

  const headOfficer = getOfficerDetails(division.headProgramOfficer);
  const subOfficer = getOfficerDetails(division.subProgramOfficer);

  return (
    <div className="min-h-screen bg-gray-50">
      <DirectorHeader user={user} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={() => router.push('/director/divisions')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{division.name}</h1>
            {division.description && (
              <p className="text-gray-600 mt-1 text-sm">{division.description}</p>
            )}
          </div>
          <button
            onClick={() => setIsAddEmployeeDialogOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Employee</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Division Info Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Total Employees</span>
                  <span className="text-xl font-bold text-blue-500">{employees.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Head Officer</span>
                  <span className="text-sm font-semibold text-green-500">
                    {headOfficer ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Sub Officer</span>
                  <span className="text-sm font-semibold text-purple-500">
                    {subOfficer ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>

            {/* Officers Card */}
            {(headOfficer || subOfficer) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Officers
                </h3>
                <div className="space-y-3">
                  {headOfficer && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium overflow-hidden">
                        {headOfficer.profilePicture ? (
                          <img src={headOfficer.profilePicture} alt={headOfficer.name} className="w-full h-full object-cover" />
                        ) : (
                          headOfficer.name.split(' ').map(n => n[0]).join('').substring(0, 1)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{headOfficer.name}</p>
                        <p className="text-xs text-green-600">Head Program Officer</p>
                      </div>
                    </div>
                  )}
                  {subOfficer && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium overflow-hidden">
                        {subOfficer.profilePicture ? (
                          <img src={subOfficer.profilePicture} alt={subOfficer.name} className="w-full h-full object-cover" />
                        ) : (
                          subOfficer.name.split(' ').map(n => n[0]).join('').substring(0, 1)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{subOfficer.name}</p>
                        <p className="text-xs text-purple-600">Sub Program Officer</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push(`/director/divisions/${division._id}/edit`)}
                  className="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Division</span>
                </button>
                <button
                  onClick={() => setIsAddEmployeeDialogOpen(true)}
                  className="w-full px-3 py-2 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Add Member</span>
                </button>
              </div>
            </div>
          </div>

          {/* Employees List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Division Members ({employees.length})
                </h3>
              </div>
              
              {employees.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No employees assigned</h4>
                  <p className="text-gray-600 mb-4 text-sm">
                    This division doesn't have any employees yet. Add some employees to get started.
                  </p>
                  <button
                    onClick={() => setIsAddEmployeeDialogOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Add Employees
                  </button>
                </div>
              ) : (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {employees.map((employee: any) => (
                      <div key={employee._id} className="bg-gray-50 rounded p-3 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium overflow-hidden flex-shrink-0">
                            {employee.profilePicture ? (
                              <img src={employee.profilePicture} alt={employee.name} className="w-full h-full object-cover" />
                            ) : (
                              employee.name.split(' ').map((n: string) => n[0]).join('').substring(0, 1)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate text-sm">{employee.name}</p>
                            <p className="text-xs text-gray-600 truncate">{employee.email}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {employee._id === division.headProgramOfficer?._id && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Head</span>
                              )}
                              {employee._id === division.subProgramOfficer?._id && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Sub</span>
                              )}
                              <span className={`px-2 py-0.5 text-xs rounded ${
                                employee.isActive 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {employee.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveEmployee(employee._id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Employee Dialog */}
        {isAddEmployeeDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[75vh] overflow-hidden">
              <div className="bg-blue-500 text-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Add Employee to Division</h3>
                  <button 
                    onClick={() => {
                      setIsAddEmployeeDialogOpen(false);
                      setSearchTerm('');
                    }}
                    className="text-white hover:text-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {/* Search */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search employees..."
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Employee List */}
                <div className="max-h-56 overflow-y-auto space-y-2">
                  {filteredAvailableEmployees.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      {searchTerm ? 'No employees found matching your search' : 'No available employees'}
                    </div>
                  ) : (
                    filteredAvailableEmployees.map(employee => (
                      <div 
                        key={employee._id} 
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer" 
                        onClick={() => handleAddEmployee(employee._id)}
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium overflow-hidden">
                          {employee.profilePicture ? (
                            <img src={employee.profilePicture} alt={employee.name} className="w-full h-full object-cover" />
                          ) : (
                            employee.name.split(' ').map(n => n[0]).join('').substring(0, 1)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{employee.name}</p>
                          <p className="text-xs text-gray-600 truncate">{employee.email}</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}