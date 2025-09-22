'use client';

import { useState } from 'react';
import { Division } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';

interface DivisionCardProps {
  division: Division;
  onUpdate: (division: Division) => void;
  onDelete: (divisionId: string) => void;
}

export default function DivisionCard({ division, onUpdate, onDelete }: DivisionCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/director/divisions/${division._id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete division');
      }

      onDelete(division._id);
      setIsDeleteDialogOpen(false);
      toast.success('Division deleted successfully');
    } catch (error) {
      console.error('Delete division error:', error);
      toast.error('Failed to delete division');
    } finally {
      setIsDeleting(false);
    }
  };

  const employees = Array.isArray(division.employees) ? division.employees : [];
  const headOfficer = division.headProgramOfficer && typeof division.headProgramOfficer === 'object' 
    ? division.headProgramOfficer 
    : null;
  const subOfficer = division.subProgramOfficer && typeof division.subProgramOfficer === 'object' 
    ? division.subProgramOfficer 
    : null;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-blue-500 text-white p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold truncate">{division.name}</h3>
              {division.description && (
                <p className="text-xs text-blue-100 mt-1 truncate">{division.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-1 ml-2">
              <Link 
                href={`/director/divisions/${division._id}`}
                className="p-1.5 hover:bg-blue-600 rounded transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </Link>
              <button 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="p-1.5 hover:bg-red-500 rounded transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm font-bold text-blue-600">{employees.length}</div>
              <div className="text-xs text-gray-600">Members</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm font-bold text-green-600">{headOfficer ? '1' : '0'}</div>
              <div className="text-xs text-gray-600">Head</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm font-bold text-purple-600">{subOfficer ? '1' : '0'}</div>
              <div className="text-xs text-gray-600">Sub</div>
            </div>
          </div>

          {/* Officers */}
          {(headOfficer || subOfficer) && (
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-gray-700">Officers</h4>
              {headOfficer && (
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Head</span>
                  <span className="text-gray-900 truncate">{headOfficer.name}</span>
                </div>
              )}
              {subOfficer && (
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">Sub</span>
                  <span className="text-gray-900 truncate">{subOfficer.name}</span>
                </div>
              )}
            </div>
          )}

          {/* Employee Avatars */}
          {employees.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-gray-700">Team</h4>
              <div className="flex flex-wrap gap-1">
                {employees.slice(0, 6).map((employee: any) => (
                  <div key={employee._id} className="relative group">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium overflow-hidden">
                      {employee.profilePicture ? (
                        <img src={employee.profilePicture} alt={employee.name} className="w-full h-full object-cover" />
                      ) : (
                        employee.name.split(' ').map((n: string) => n[0]).join('').substring(0, 1)
                      )}
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {employee.name}
                    </div>
                  </div>
                ))}
                {employees.length > 6 && (
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium">
                    +{employees.length - 6}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-1.5 pt-2 border-t border-gray-100">
            <Link 
              href={`/director/divisions/${division._id}`}
              className="flex-1 px-2 py-1.5 bg-blue-50 text-blue-600 rounded text-center text-xs font-medium hover:bg-blue-100 transition-colors"
            >
              View
            </Link>
            <Link 
              href={`/director/divisions/${division._id}/edit`}
              className="flex-1 px-2 py-1.5 bg-gray-50 text-gray-600 rounded text-center text-xs font-medium hover:bg-gray-100 transition-colors"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Division</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Are you sure you want to delete "{division.name}"? This action cannot be undone.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}