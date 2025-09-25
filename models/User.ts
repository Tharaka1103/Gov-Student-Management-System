import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: function() {
      return ['admin', 'director', 'internal_auditor'].includes(this.role);
    },
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true // Allow null values for employees
  },
  nic: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'director', 'internal_auditor', 'employee'],
    required: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Role-specific fields for director/admin
  managingDepartments: [{
    type: String,
    trim: true
  }],
  workshops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop'
  }],
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  permissions: [{
    type: String
  }],
  // Employee-specific fields
  servicePeriod: {
    type: String
  },
  dateOfJoiningService: {
    type: Date
  },
  degree: {
    type: String,
    trim: true
  },
  council: {
    type: String,
    required: function() {
      return this.role === 'employee';
    },
    trim: true
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate auto password
userSchema.statics.generateAutoPassword = function(name: string): string {
  const cleanName = name.toLowerCase().replace(/\s+/g, '');
  return `${cleanName}1234`;
};

// Fix for the mongoose models issue
let User: mongoose.Model<any>;

try {
  // Try to get existing model
  User = mongoose.model('User');
} catch (error) {
  // Create new model if it doesn't exist
  User = mongoose.model('User', userSchema);
}

export default User;