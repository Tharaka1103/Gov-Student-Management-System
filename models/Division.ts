import mongoose from 'mongoose';

const divisionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  headProgramOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  subProgramOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

let Division: mongoose.Model<any>;

try {
  Division = mongoose.model('Division');
} catch (error) {
  Division = mongoose.model('Division', divisionSchema);
}

export default Division;