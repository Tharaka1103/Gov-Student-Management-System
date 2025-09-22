'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Workshop } from '@/types';
import { format } from 'date-fns';

interface EditWorkshopFormProps {
  workshop: Workshop;
  onSuccess: (workshop: Workshop) => void;
  onCancel: () => void;
}

interface WorkshopFormData {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  location: string;
  maxParticipants: string;
}

export default function EditWorkshopForm({
  workshop,
  onSuccess,
  onCancel
}: EditWorkshopFormProps) {
  const [formData, setFormData] = useState<WorkshopFormData>({
    title: workshop.title,
    description: workshop.description,
    startDate: new Date(workshop.startDate),
    endDate: new Date(workshop.endDate),
    location: workshop.location,
    maxParticipants: workshop.maxParticipants.toString()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      setIsLoading(false);
      return;
    }

    if (formData.startDate >= formData.endDate) {
      setError('End date must be after start date');
      setIsLoading(false);
      return;
    }

    const maxParticipants = parseInt(formData.maxParticipants);
    if (maxParticipants < 1) {
      setError('Maximum participants must be at least 1');
      setIsLoading(false);
      return;
    }

    // Check if reducing max participants below current enrollment
    if (maxParticipants < workshop.students.length) {
      setError(`Cannot set maximum participants below current enrollment (${workshop.students.length} students)`);
      setIsLoading(false);
      return;
    }

    try {
      const workshopData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        location: formData.location,
        maxParticipants: maxParticipants
      };

      const response = await fetch(`/api/auditor/workshops/${workshop._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workshopData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update workshop');
      }

      onSuccess(data.workshop);

    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to update workshop', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert className="border-destructive/50 text-destructive bg-destructive/10">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Workshop Title *</Label>
          <Input
            id="title"
            placeholder="Enter workshop title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxParticipants">Max Participants *</Label>
          <Input
            id="maxParticipants"
            type="number"
            min="1"
            placeholder="Enter maximum participants"
            value={formData.maxParticipants}
            onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
            required
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Current enrollment: {workshop.students.length} students
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe the workshop content and objectives"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
          disabled={isLoading}
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          placeholder="Enter workshop location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Start Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(formData.startDate, 'PPP') : 'Select start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate || undefined}
                onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date || null }))}
                disabled={(date) => date < new Date() || isLoading}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? format(formData.endDate, 'PPP') : 'Select end date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate || undefined}
                onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date || null }))}
                disabled={(date) => date < (formData.startDate || new Date()) || isLoading}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[120px] bg-red-900"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Update Workshop
            </>
          )}
        </Button>
      </div>
    </form>
  );
}