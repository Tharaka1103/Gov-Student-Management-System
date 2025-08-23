const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  contact: { type: String },
  nic: { type: String },
  work: { type: String },
  address: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'director', 'user'], required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  await mongoose.connect('mongodb+srv://tharaka:1234@cluster0.yd0xvos.mongodb.net/gov-student-management-system?retryWrites=true&w=majority&appName=Cluster0');
  const admin = new User({
    email: 'admin@gmail.com',
    username: 'admin',
    password: bcrypt.hashSync('admin12345', 10),
    role: 'admin',
  });
  await admin.save();
  console.log('Admin created');
  mongoose.disconnect();
}

createAdmin();