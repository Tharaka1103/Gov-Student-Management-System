import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  nic: string;
  guardianName?: string;
  guardianPhone?: string;
  enrolledCourses: Array<{
    courseId: mongoose.Types.ObjectId;
    enrollmentDate: Date;
    status: 'active' | 'completed' | 'suspended' | 'dropped';
    progress?: number;
    completionDate?: Date;
  }>;
  academicInfo: {
    previousEducation?: string;
    previousInstitution?: string;
    grades?: Array<{
      courseId: mongoose.Types.ObjectId;
      grade: string;
      marks: number;
      examDate: Date;
    }>;
  };
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  enrollmentDate: Date;
  graduationDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>({
  studentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  nic: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  guardianName: {
    type: String,
    trim: true
  },
  guardianPhone: {
    type: String,
    trim: true
  },
  enrolledCourses: [{
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'suspended', 'dropped'],
      default: 'active'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    completionDate: Date
  }],
  academicInfo: {
    previousEducation: String,
    previousInstitution: String,
    grades: [{
      courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
      },
      grade: String,
      marks: Number,
      examDate: Date
    }]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'suspended'],
    default: 'active',
    index: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  graduationDate: Date,
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
StudentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
StudentSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
});

// Index for search
StudentSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  studentId: 'text'
});

// Pre-save middleware to generate student ID
StudentSchema.pre('save', async function(next) {
  if (this.isNew && !this.studentId) {
    const count = await mongoose.model('Student').countDocuments();
    this.studentId = `STU${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);