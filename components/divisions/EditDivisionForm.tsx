'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Division, Employee } from '@/types';
import { toast } from 'sonner';

interface EditDivisionFormProps {
  divisionId: string;
}

export default function EditDivisionForm({ divisionId }: EditDivisionFormProps) {
  const router = useRouter();
  const [division, setDivision] = useState<Division | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    employees: [] as string[],
    headProgramOfficer: '',
    subProgramOfficer: ''
  });

  useEffect(() => {
    fetchDivision();
    fetchAllEmployees();
  }, [divisionId]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredEmployees(
        allEmployees.filter(emp =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredEmployees(allEmployees);
    }
  }, [searchTerm, allEmployees]);

  const fetchDivision = async () => {
    try {
      const response = await fetch(`/api/director/divisions/${divisionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch division');
      }
      const data = await response.json();
      setDivision(data.division);
      
      const div = data.division;
      const employeeIds = Array.isArray(div.employees) 
        ? div.employees.map((emp: any) => typeof emp === 'string' ? emp : emp._id)
        : [];
      
      setFormData({
        name: div.name || '',
        description: div.description || '',
        employees: employeeIds,
        headProgramOfficer: div.headProgramOfficer?._id || div.headProgramOfficer || '',
        subProgramOfficer: div.subProgramOfficer?._id || div.subProgramOfficer || ''
      });
    } catch (error) {
      console.error('Fetch division error:', error);
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
        setFilteredEmployees(data.employees);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmployeeToggle = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      employees: prev.employees.includes(employeeId)
        ? prev.employees.filter(id => id !== employeeId)
        : [...prev.employees, employeeId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/director/divisions/${divisionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update division');
      }

      toast.success('Division updated successfully! ✨');
      router.push('/director/divisions');
    } catch (error) {
      console.error('Update division error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update division');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div className="h-16 bg-gray-200 rounded-t-lg"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!division) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Division not found</h3>
            <p className="text-gray-600 mb-4 text-sm">The division you're looking for doesn't exist.</p>
            <button 
              onClick={() => router.push('/director/divisions')}
              className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              ← Back to Divisions
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedEmployees = allEmployees.filter(emp => formData.employees.includes(emp._id));
  const availableEmployees = filteredEmployees.filter(emp => !formData.employees.includes(emp._id));

  return (
    <div className="container mx-auto px-4 py-6">
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Division</h1>
          <p className="text-sm text-gray-600">Update division information and manage team members</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className=" mx-auto space-y-6 ">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-red-900 text-white p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Division Information
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Division Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter division name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created On
                </label>
                <input
                  type="text"
                  value={new Date(division.createdAt).toLocaleDateString()}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter division description"
              />
            </div>
          </div>
        </div>

        {/* Employee Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-red-900 text-white p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Team Members ({selectedEmployees.length})
            </h2>
          </div>

          <div className="p-4 space-y-4">
            {/* Current Members */}
            {selectedEmployees.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Current Members ({selectedEmployees.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedEmployees.map(emp => (
                    <div key={emp._id} className="bg-gray-50 rounded p-3 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium overflow-hidden flex-shrink-0">
                          {emp.profilePicture ? (
                            <img src={emp.profilePicture} alt={emp.name} className="w-full h-full object-cover" />
                          ) : (
                            emp.name.split(' ').map(n => n[0]).join('').substring(0, 1)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm">{emp.name}</p>
                          <p className="text-xs text-gray-600 truncate">{emp.email}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {emp._id === formData.headProgramOfficer && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Head</span>
                            )}
                            {emp._id === formData.subProgramOfficer && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Sub</span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleEmployeeToggle(emp._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
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

            {/* Add Employees */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Add More Employees</h3>
              
              <div className="relative mb-3">
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

              <div className="border border-gray-300 rounded max-h-48 overflow-y-auto">
                {availableEmployees.length === 0 ? (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    {searchTerm ? 'No employees found' : 'All employees assigned'}
                  </div>
                ) : (
                  <div className="p-1">
                    {availableEmployees.map(employee => (
                      <label key={employee._id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.employees.includes(employee._id)}
                          onChange={() => handleEmployeeToggle(employee._id)}
                          className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                            {employee.profilePicture ? (
                              <img src={employee.profilePicture} alt={employee.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              employee.name.split(' ').map(n => n[0]).join('').substring(0, 1)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                            <p className="text-xs text-gray-500">{employee.email}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Officer Assignment */}
        {selectedEmployees.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-red-900 text-white p-4 rounded-t-lg">
              <h2 className="text-lg font-semibold flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Officer Assignments
              </h2>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Head Program Officer
                  </label>
                  <select
                    value={formData.headProgramOfficer}
                    onChange={(e) => handleInputChange('headProgramOfficer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Head Officer</option>
                    {selectedEmployees.map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Program Officer
                  </label>
                  <select
                    value={formData.subProgramOfficer}
                    onChange={(e) => handleInputChange('subProgramOfficer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Sub Officer</option>
                    {selectedEmployees.filter(emp => emp._id !== formData.headProgramOfficer).map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(formData.headProgramOfficer || formData.subProgramOfficer) && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Assignments</h4>
                  <div className="space-y-1">
                    {formData.headProgramOfficer && (
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Head</span>
                        <span className="text-sm text-gray-900">
                          {selectedEmployees.find(emp => emp._id === formData.headProgramOfficer)?.name}
                        </span>
                      </div>
                    )}
                    {formData.subProgramOfficer && (
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Sub</span>
                        <span className="text-sm text-gray-900">
                          {selectedEmployees.find(emp => emp._id === formData.subProgramOfficer)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => router.push('/director/divisions')}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.name.trim()}
            className="flex-1 px-4 py-2 bg-red-900 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Update Division
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}