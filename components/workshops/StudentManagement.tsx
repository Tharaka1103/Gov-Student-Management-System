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
  Loader2
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
  nic: string;
  mobile: string;
  address: string;
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
      case 'enrolled': return 'bg-primary/10 text-primary border-primary/20';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'dropped': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-secondary/10 text-secondary border-secondary/20';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-red-900">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-12 w-12 border-2 border-border">
              <AvatarImage src={student.profilePicture || ''} alt={student.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {student.name}
              </h3>
              <p className="text-sm text-muted-foreground font-mono">
                {student.enrollmentNumber}
              </p>
              <Badge className={`mt-1 text-xs ${getStatusColor(student.status)}`}>
                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(student)} className="cursor-pointer">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Student</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove <strong>{student.name}</strong> from this workshop? 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(student._id || '', student.name)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{student.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{student.mobile}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-mono">{student.nic}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{student.address}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Enrolled {new Date(student.enrollmentDate).toLocaleDateString()}</span>
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
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
                    <Avatar className="h-16 w-16 border-2 border-border">
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
                  <div className="h-16 w-16 border-2 border-dashed border-border rounded-full flex items-center justify-center bg-muted/30">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-primary-foreground file:text-sm hover:file:bg-primary/90"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional. Max 5MB. JPEG, PNG, WebP only.
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                disabled={isLoading}
                className="focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                disabled={isLoading}
                className="focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nic" className="text-sm font-medium">
                NIC Number *
              </Label>
              <Input
                id="nic"
                placeholder="Enter NIC number"
                value={formData.nic}
                onChange={(e) => handleInputChange('nic', e.target.value)}
                required
                disabled={isLoading}
                className="focus:ring-primary font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-medium">
                Mobile Number *
              </Label>
              <Input
                id="mobile"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                required
                disabled={isLoading}
                className="focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address *
            </Label>
            <Textarea
              id="address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
              disabled={isLoading}
              className="focus:ring-primary min-h-[80px] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[100px]"
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
    nic: '',
    mobile: '',
    address: ''
  });

  const [editFormData, setEditFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    nic: '',
    mobile: '',
    address: ''
  });

  const [addPreviewImage, setAddPreviewImage] = useState<string | null>(null);
  const [editPreviewImage, setEditPreviewImage] = useState<string | null>(null);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nic.includes(searchTerm) ||
    student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditDialog = useCallback((student: Student) => {
    setEditingStudent(student);
    setEditFormData({
      name: student.name,
      email: student.email,
      nic: student.nic,
      mobile: student.mobile,
      address: student.address
    });
    setEditPreviewImage(student.profilePicture || null);
    setIsEditDialogOpen(true);
  }, []);

  const closeAddDialog = useCallback(() => {
    if (!isLoading) {
      setIsAddDialogOpen(false);
      setAddFormData({ name: '', email: '', nic: '', mobile: '', address: '' });
      setAddPreviewImage(null);
    }
  }, [isLoading]);

  const closeEditDialog = useCallback(() => {
    if (!isLoading) {
      setIsEditDialogOpen(false);
      setEditFormData({ name: '', email: '', nic: '', mobile: '', address: '' });
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
      toast.success('Student added successfully!');

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
      toast.success('Student updated successfully!');

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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-border pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Student Management</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{students.length} of {maxParticipants} students enrolled</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="hidden sm:block">
                {capacityPercentage}% capacity used
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            disabled={students.length >= maxParticipants}
            className="shrink-0 bg-red-900"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Workshop Capacity</span>
            <span>{capacityPercentage}%</span>
          </div>
          <div className="w-full bg-secondary/30 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${capacityPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students by name, email, NIC, or enrollment number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted/30 p-4 mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No students found' : 'No students enrolled yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchTerm 
                ? 'Try adjusting your search criteria to find the student you\'re looking for.'
                : 'Get started by adding your first student to this workshop.'
              }
            </p>
            {!searchTerm && students.length < maxParticipants && (
              <Button onClick={() => setIsAddDialogOpen(true)} className='bg-red-900'>
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Student
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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