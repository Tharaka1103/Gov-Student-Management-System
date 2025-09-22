'use client';

import { useState, useEffect } from 'react';
import { Employee } from '@/types';
import { toast } from 'sonner';

interface CreateDivisionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (division: any) => void;
}

export default function CreateDivisionDialog({
  isOpen,
  onClose,
  onSuccess
}: CreateDivisionDialogProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    employees: [] as string[],
    headProgramOfficer: '',
    subProgramOfficer: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredEmployees(
        employees.filter(emp =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/director/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees);
        setFilteredEmployees(data.employees);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
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
      const response = await fetch('/api/director/divisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create division');
      }

      const data = await response.json();
      onSuccess(data.division);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        employees: [],
        headProgramOfficer: '',
        subProgramOfficer: ''
      });
      setSearchTerm('');
    } catch (error) {
      console.error('Create division error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create division');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedEmployees = employees.filter(emp => formData.employees.includes(emp._id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create New Division</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Basic Information */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Division Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter division name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter division description"
                />
              </div>
            </div>

            {/* Employee Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Select Employees</h3>
              
              {/* Search */}
              <div className="relative">
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

              {/* Selected Employees */}
              {selectedEmployees.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">
                    Selected ({selectedEmployees.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedEmployees.map(emp => (
                      <span key={emp._id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                        {emp.name}
                        <button
                          type="button"
                          onClick={() => handleEmployeeToggle(emp._id)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Employee List */}
              <div className="border border-gray-300 rounded max-h-40 overflow-y-auto">
                {filteredEmployees.length === 0 ? (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    {searchTerm ? 'No employees found' : 'No employees available'}
                  </div>
                ) : (
                  <div className="p-1">
                    {filteredEmployees.map(employee => (
                      <label key={employee._id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.employees.includes(employee._id)}
                          onChange={() => handleEmployeeToggle(employee._id)}
                          className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2 flex-1">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {employee.profilePicture ? (
                              <img src={employee.profilePicture} alt={employee.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              employee.name.split(' ').map(n => n[0]).join('').substring(0, 1)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{employee.name}</p>
                            <p className="text-xs text-gray-500 truncate">{employee.email}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Officers Selection */}
            {selectedEmployees.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Assign Officers</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Head Program Officer
                    </label>
                    <select
                      value={formData.headProgramOfficer}
                      onChange={(e) => setFormData(prev => ({ ...prev, headProgramOfficer: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Head Officer</option>
                      {selectedEmployees.map(emp => (
                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Sub Program Officer
                    </label>
                    <select
                      value={formData.subProgramOfficer}
                      onChange={(e) => setFormData(prev => ({ ...prev, subProgramOfficer: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Sub Officer</option>
                      {selectedEmployees.filter(emp => emp._id !== formData.headProgramOfficer).map(emp => (
                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name.trim()}
            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Division'}
          </button>
        </div>
      </div>
    </div>
  );
}