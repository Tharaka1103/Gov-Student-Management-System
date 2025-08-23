import { Schema, model, models } from 'mongoose';

const courseSchema = new Schema({
  title: { type: String, required: true },
  duration: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
}, { timestamps: true });

export const Course = models.Course || model('Course', courseSchema);