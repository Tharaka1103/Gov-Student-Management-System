'use client';

import { useState, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  UserPlus,
  Search,
  MoreHorizontal,
  Edit3,
  Trash2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Upload,
  X,
  Users,
  Loader2,
  Building
} from 'lucide-react';
import { Student } from '@/types';
import { toast } from 'sonner';
import Image from 'next/image';

interface StudentManagementProps {
  workshopId: string;
  students: Student[];
  maxParticipants: number;
  onStudentAdded: (student: Student) => void;
  onStudentUpdated: (student: Student) => void;
  onStudentRemoved: (studentId: string) => void;
}

interface StudentFormData {
  name: string;
  email: string;
  council: string;
  nic: string;
  mobile: string;
  profilePicture?: File;
}

// Memoized Student Card Component
const StudentCard = memo(({ 
  student, 
  onEdit, 
  onDelete 
}: { 
  student: Student; 
  onEdit: (student: Student) => void;
  onDelete: (id: string, name: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'dropped': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-red-900 hover:scale-105">
  <CardContent className="p-3 sm:p-4 md:p-6">
    <div className="flex items-start justify-between mb-3 sm:mb-4">
      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 border-2 border-red-900 shadow-md flex-shrink-0">
          <AvatarImage src={student.profilePicture || ''} alt={student.name} />
          <AvatarFallback className="bg-yellow-400/60 text-black font-medium text-xs sm:text-sm md:text-lg">
            {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 max-w-full">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg break-words leading-tight max-w-full">
            {student.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 font-mono mb-1 break-all">
            {student.enrollmentNumber}
          </p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <Badge className={`text-xs ${getStatusColor(student.status)}`}>
              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
            </Badge>
            {student.council && (
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                <Building className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                <span className="break-words">{student.council}</span>
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="transition-opacity h-6 w-6 sm:h-8 sm:w-8 p-0 bg-yellow-200 rounded-xs flex-shrink-0 ml-2"
          >
            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32 sm:w-40">
          <DropdownMenuItem onClick={() => onEdit(student)} className="cursor-pointer text-xs sm:text-sm bg-yellow-200 hover:bg-yellow-400">
            <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem 
                className="text-white bg-red-500 hover:bg-red-700 cursor-pointer text-xs sm:text-sm"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-white" />
                Remove
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[90%] sm:w-full max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base sm:text-lg">Remove Student</AlertDialogTitle>
                <AlertDialogDescription className="text-sm">
                  Are you sure you want to remove <strong className="break-words">{student.name}</strong> from this workshop? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(student._id || '', student.name)}
                  className="bg-red-600 hover:bg-red-700 text-sm"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div className="space-y-2 sm:space-y-3 border-t border-red-900">
      {student.email && (
        <div className="flex items-start mt-2 sm:mt-3 gap-2 text-xs sm:text-sm text-gray-600">
          <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <span className="break-words min-w-0 flex-1">{student.email}</span>
        </div>
      )}
      
      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
        <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-green-500 mt-0.5" />
        <span className="break-words min-w-0 flex-1">{student.mobile}</span>
      </div>
      
      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
        <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-purple-500 mt-0.5" />
        <span className="font-mono break-all min-w-0 flex-1">{student.nic}</span>
      </div>

      {student.council && (
        <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
          <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-orange-500 mt-0.5" />
          <span className="break-words min-w-0 flex-1">{student.council}</span>
        </div>
      )}
    </div>

    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-red-900">
      <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
        <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
        <span className="break-words">Enrolled {new Date(student.enrollmentDate).toLocaleDateString()}</span>
      </div>
    </div>
  </CardContent>
</Card>
  );
});

StudentCard.displayName = 'StudentCard';

// Student Form Component
const StudentForm = memo(({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  previewImage, 
  setPreviewImage, 
  isLoading, 
  isEdit = false 
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: StudentFormData;
  setFormData: (data: StudentFormData | ((prev: StudentFormData) => StudentFormData)) => void;
  previewImage: string | null;
  setPreviewImage: (image: string | null) => void;
  isLoading: boolean;
  isEdit?: boolean;
}) => {
  const handleInputChange = useCallback((field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, [setFormData]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
        return;
      }
      
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB.');
        return;
      }

      setFormData(prev => ({ ...prev, profilePicture: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [setFormData, setPreviewImage]);

  const removeImage = useCallback(() => {
    setFormData(prev => ({ ...prev, profilePicture: undefined }));
    setPreviewImage(null);
  }, [setFormData, setPreviewImage]);

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            {isEdit ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Update the student information below.' 
              : 'Fill in the student details to enroll them in this workshop.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 mt-4">
          {/* Profile Picture Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {previewImage ? (
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-2 border-gray-200">
                      <AvatarImage src={previewImage} alt="Preview" />
                    </Avatar>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeImage}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="h-16 w-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:bg-yellow-400/70 file:text-black file:text-sm hover:file:bg-yellow-400 cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional. Max 5MB. JPEG, PNG, WebP only.
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Full Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                disabled={isLoading}
                className="focus:ring-blue-500 bg-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-500" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address (optional)"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isLoading}
                className="focus:ring-blue-500 bg-white/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nic" className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-500" />
                NIC Number *
              </Label>
              <Input
                id="nic"
                placeholder="Enter NIC number"
                value={formData.nic}
                onChange={(e) => handleInputChange('nic', e.target.value)}
                required
                disabled={isLoading}
                className="focus:ring-blue-500 font-mono bg-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-500" />
                Mobile Number *
              </Label>
              <Input
                id="mobile"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                required
                disabled={isLoading}
                className="focus:ring-blue-500 bg-white/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="council" className="text-sm font-medium flex items-center gap-2">
              <Building className="w-4 h-4 text-orange-500" />
              Urban Councils Name / Regional Councils Name / Municipal Councils Name *
            </Label>
            <Input
              id="council"
              placeholder="Enter council name"
              value={formData.council}
              required
              onChange={(e) => handleInputChange('council', e.target.value)}
              disabled={isLoading}
              className="focus:ring-blue-500 bg-white/50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px] bg-red-900 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEdit ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  {isEdit ? 'Update' : 'Add'} Student
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

StudentForm.displayName = 'StudentForm';

export default function StudentManagement({
  workshopId,
  students,
  maxParticipants,
  onStudentAdded,
  onStudentUpdated,
  onStudentRemoved
}: StudentManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Separate form states
  const [addFormData, setAddFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    council: '',
    nic: '',
    mobile: '',
  });

  const [editFormData, setEditFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    council: '',
    nic: '',
    mobile: '',
  });

  const [addPreviewImage, setAddPreviewImage] = useState<string | null>(null);
  const [editPreviewImage, setEditPreviewImage] = useState<string | null>(null);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nic.includes(searchTerm) ||
    student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.council?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditDialog = useCallback((student: Student) => {
    setEditingStudent(student);
    setEditFormData({
      name: student.name,
      email: student.email || '',
      council: student.council || '',
      nic: student.nic,
      mobile: student.mobile,
    });
    setEditPreviewImage(student.profilePicture || null);
    setIsEditDialogOpen(true);
  }, []);

  const closeAddDialog = useCallback(() => {
    if (!isLoading) {
      setIsAddDialogOpen(false);
      setAddFormData({ name: '', email: '', council: '', nic: '', mobile: '' });
      setAddPreviewImage(null);
    }
  }, [isLoading]);

  const closeEditDialog = useCallback(() => {
    if (!isLoading) {
      setIsEditDialogOpen(false);
      setEditFormData({ name: '', email: '', council: '', nic: '', mobile: '' });
      setEditPreviewImage(null);
      setEditingStudent(null);
    }
  }, [isLoading]);

  const handleAddStudent = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (students.length >= maxParticipants) {
      toast.error('Workshop is full. Cannot add more students.');
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      Object.entries(addFormData).forEach(([key, value]) => {
        if (key === 'profilePicture' && value) {
          submitData.append(key, value as File);
        } else if (key !== 'profilePicture' && value) {
          submitData.append(key, value as string);
        }
      });

      const response = await fetch(`/api/auditor/workshops/${workshopId}/students`, {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add student');
      }

      onStudentAdded(data.student);
      closeAddDialog();
      toast.success('Student added successfully! 🎉');

    } catch (error: any) {
      toast.error('Failed to add student', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [addFormData, students.length, maxParticipants, workshopId, onStudentAdded, closeAddDialog]);

  const handleUpdateStudent = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingStudent) return;

    setIsLoading(true);

    try {
      const submitData = new FormData();
      Object.entries(editFormData).forEach(([key, value]) => {
        if (key === 'profilePicture' && value) {
          submitData.append(key, value as File);
        } else if (key !== 'profilePicture' && value) {
          submitData.append(key, value as string);
        }
      });

      const response = await fetch(`/api/auditor/workshops/${workshopId}/students/${editingStudent._id}`, {
        method: 'PUT',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update student');
      }

      onStudentUpdated(data.student);
      closeEditDialog();
      toast.success('Student updated successfully! ✨');

    } catch (error: any) {
      toast.error('Failed to update student', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [editFormData, editingStudent, workshopId, onStudentUpdated, closeEditDialog]);

  const handleRemoveStudent = useCallback(async (studentId: string, studentName: string) => {
    try {
      const response = await fetch(`/api/auditor/workshops/${workshopId}/students/${studentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove student');
      }

      onStudentRemoved(studentId);
      toast.success(`${studentName} has been removed from the workshop.`);

    } catch (error: any) {
      toast.error('Failed to remove student', {
        description: error.message,
      });
    }
  }, [workshopId, onStudentRemoved]);

  const capacityPercentage = Math.round((students.length / maxParticipants) * 100);
  const councilStats = students.reduce((acc, student) => {
    if (student.council) {
      acc[student.council] = (acc[student.council] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Student Management</h2>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span>{students.length} of {maxParticipants} students enrolled</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="hidden sm:block">
                {capacityPercentage}% capacity used
              </div>
              {Object.keys(councilStats).length > 0 && (
                <>
                  <div className="hidden sm:block">•</div>
                  <div className="hidden sm:block">
                    {Object.keys(councilStats).length} councils represented
                  </div>
                </>
              )}
            </div>
          </div>
          
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            disabled={students.length >= maxParticipants}
            className="shrink-0 bg-red-900 text-white shadow-lg"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Progress Bar and Stats */}
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>Workshop Capacity</span>
              <span>{capacityPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-yellow-400 h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
          </div>

          {/* Council Distribution */}
          {Object.keys(councilStats).length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Councils:</span>
              {Object.entries(councilStats).map(([council, count]) => (
                <Badge key={council} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {council} ({count})
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search students by name, email, NIC, council, or enrollment number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-blue-50 p-6 mb-6">
              <Users className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              {searchTerm ? 'No students found' : 'No students enrolled yet'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
              {searchTerm 
                ? 'Try adjusting your search criteria to find the student you\'re looking for.'
                : 'Get started by adding your first student to this workshop.'
              }
            </p>
            {!searchTerm && students.length < maxParticipants && (
              <Button 
                onClick={() => setIsAddDialogOpen(true)} 
                className='bg-red-900 text-white shadow-lg'
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Student
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student._id || `student-${students.indexOf(student)}`}
              student={student}
              onEdit={openEditDialog}
              onDelete={handleRemoveStudent}
            />
          ))}
        </div>
      )}

      {/* Add Student Dialog */}
      <StudentForm
        isOpen={isAddDialogOpen}
        onClose={closeAddDialog}
        onSubmit={handleAddStudent}
        formData={addFormData}
        setFormData={setAddFormData}
        previewImage={addPreviewImage}
        setPreviewImage={setAddPreviewImage}
        isLoading={isLoading}
        isEdit={false}
      />

      {/* Edit Student Dialog */}
      <StudentForm
        isOpen={isEditDialogOpen}
        onClose={closeEditDialog}
        onSubmit={handleUpdateStudent}
        formData={editFormData}
        setFormData={setEditFormData}
        previewImage={editPreviewImage}
        setPreviewImage={setEditPreviewImage}
        isLoading={isLoading}
        isEdit={true}
      />
    </div>
  );
}