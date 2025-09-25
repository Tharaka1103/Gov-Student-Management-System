'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import DirectorHeader from '@/components/layout/DirectorHeader';
import EmployeeCard from '@/components/employees/EmployeeCard';
import CreateEmployeeDialog from '@/components/employees/CreateEmployeeDialog';
import { downloadEmployeePDF } from '@/lib/pdfExport';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  UserPlus,
  Building,
  FileText,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { User, Employee } from '@/types';
import LoadingIndicator from '@/components/LoadingIndicator ';
import DirectorFooter from '@/components/layout/DirectorFooter';

export default function EmployeesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm]);

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

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/director/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees);
      } else {
        toast.error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      toast.error('Failed to fetch employees');
    } finally {
      setIsLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.nic.includes(searchTerm) ||
        (employee.degree && employee.degree.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredEmployees(filtered);
  };

  const handleExportPDF = async () => {
    if (!user || employees.length === 0) {
      toast.error('No data to export');
      return;
    }

    setIsExporting(true);
    
    try {
      // Use filtered employees if there's a search term, otherwise use all employees
      const employeesToExport = searchTerm ? filteredEmployees : employees;
      
      if (employeesToExport.length === 0) {
        toast.error('No employees match your current filter');
        return;
      }

      await downloadEmployeePDF({
        employees: employeesToExport,
        directorName: user.name,
        departmentName: user.managingDepartments?.[0] || undefined
      });

      toast.success('PDF exported successfully! 📄', {
        description: `Generated report with ${employeesToExport.length} employees`,
      });
    } catch (error) {
      console.error('Failed to export PDF:', error);
      toast.error('Failed to export PDF', {
        description: 'Please try again later',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmployeeCreated = (newEmployee: Employee) => {
    setEmployees(prev => [newEmployee, ...prev]);
    setIsCreateDialogOpen(false);
    toast.success('Employee added successfully! 🎉', {
      description: 'New employee has been added to your team.',
    });
  };

  const handleEmployeeUpdated = (updatedEmployee: Employee) => {
    setEmployees(prev =>
      prev.map(employee =>
        employee._id === updatedEmployee._id ? updatedEmployee : employee
      )
    );
    toast.success('Employee updated successfully! ✨', {
      description: 'Changes have been saved.',
    });
  };

  const handleEmployeeDeleted = (employeeId: string) => {
    setEmployees(prev => prev.filter(employee => employee._id !== employeeId));
    toast.success('Employee removed successfully', {
      description: 'The employee has been removed from your team.',
    });
  };

  if (!user) {
    return <div><LoadingIndicator
        isVisible={isLoading}
        variant="minimal"
        showBackdrop={false}
      /></div>;
  }

  const calculateServiceYears = (employee: Employee) => {
    const joiningDate = new Date(employee.dateOfJoiningService);
    const now = new Date();
    return Math.floor((now.getTime() - joiningDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
  };

  const getEmployeeStats = () => {
    const totalEmployees = employees.length;
    const withDegree = employees.filter(emp => emp.degree).length;
    const avgServiceYears = employees.length > 0 
      ? Math.round(employees.reduce((sum, emp) => sum + calculateServiceYears(emp), 0) / employees.length)
      : 0;
    
    return {
      total: totalEmployees,
      withDegree,
      avgServiceYears,
      active: employees.filter(emp => emp.isActive).length
    };
  };

  const stats = getEmployeeStats();

  return (
    <div className="min-h-screen bg-white">
      <DirectorHeader user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Employee Management 👥
            </h1>
            <p className="text-gray-600">
              Manage your team members and their information
            </p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <Button 
              variant="outline"
              onClick={handleExportPDF}
              disabled={isExporting || employees.length === 0}
              className="relative"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </>
              )}
            </Button>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-red-900 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-sm text-gray-600">Total Employees</p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-sm text-gray-600">Active</p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.withDegree}</div>
              <p className="text-sm text-gray-600">With Degree</p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.avgServiceYears}y</div>
              <p className="text-sm text-gray-600">Avg. Service</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="backdrop-blur-xl bg-white/40 border border-white/30 mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search employees by name, email, NIC, or degree..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50"
              />
            </div>
            {searchTerm && (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredEmployees.length} of {employees.length} employees
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="text-gray-500"
                >
                  Clear search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employees Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="backdrop-blur-xl bg-white/40 border border-white/30">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-16 w-16 bg-gray-300 rounded-full mb-4 mx-auto"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 mx-auto"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-4 mx-auto"></div>
                    <div className="h-8 bg-gray-300 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEmployees.length === 0 ? (
          <Card className="backdrop-blur-xl bg-white/40 border border-white/30">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by adding your first employee.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-red-900 hover:bg-red-700 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Your First Employee
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee._id}
                employee={employee}
                onUpdate={handleEmployeeUpdated}
                onDelete={handleEmployeeDeleted}
              />
            ))}
          </div>
        )}

        {/* Create Employee Dialog */}
        <CreateEmployeeDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={handleEmployeeCreated}
          directorId={user._id}
        />
      </main>
      <DirectorFooter/>
    </div>
  );
}