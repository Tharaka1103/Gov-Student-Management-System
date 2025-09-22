import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
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
  servicePeriod: {
    type: String,
    required: true
  },
  dateOfJoiningService: {
    type: Date,
    required: true
  },
  degree: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

let Employee: mongoose.Model<any>;

try {
  Employee = mongoose.model('Employee');
} catch (error) {
  Employee = mongoose.model('Employee', employeeSchema);
}

export default Employee;