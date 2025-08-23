import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  contact: { type: String },
  nic: { type: String },
  work: { type: String },
  address: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'director', 'user'], required: true },
}, { timestamps: true });

export const User = models.User || model('User', userSchema);