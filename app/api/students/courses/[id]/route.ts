import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import {Course} from '@/models/Course';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { studentId } = req.query;

  switch (req.method) {
    case 'POST':
      // Enroll student in course
      try {
        const { courseId } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
          return res.status(404).json({ message: 'Course not found' });
        }

        // Check if already enrolled
        const existingEnrollment = student.enrolledCourses.find(
            (enrollment: { courseId: { toString: () => any; }; }) => enrollment.courseId.toString() === courseId
        );

        if (existingEnrollment) {
          return res.status(400).json({ message: 'Student already enrolled in this course' });
        }

        student.enrolledCourses.push({
          courseId,
          enrollmentDate: new Date(),
          status: 'active',
          progress: 0
        });

        await student.save();
        await student.populate('enrolledCourses.courseId', 'title duration price');

        res.status(200).json({
          message: 'Student enrolled successfully',
          student
        });
      } catch (error) {
        console.error('POST enrollment error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;

    case 'PUT':
      // Update course enrollment
      try {
        const { courseId, status, progress } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }

        const enrollmentIndex = student.enrolledCourses.findIndex(
            (enrollment: { courseId: { toString: () => any; }; }) => enrollment.courseId.toString() === courseId
        );

        if (enrollmentIndex === -1) {
          return res.status(404).json({ message: 'Enrollment not found' });
        }

        // Update enrollment
        if (status) student.enrolledCourses[enrollmentIndex].status = status;
        if (progress !== undefined) student.enrolledCourses[enrollmentIndex].progress = progress;
        
        if (status === 'completed') {
          student.enrolledCourses[enrollmentIndex].completionDate = new Date();
        }

        await student.save();
        await student.populate('enrolledCourses.courseId', 'title duration price');

        res.status(200).json({
          message: 'Enrollment updated successfully',
          student
        });
      } catch (error) {
        console.error('PUT enrollment error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;

    case 'DELETE':
      // Remove course enrollment
      try {
        const { courseId } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }

        student.enrolledCourses = student.enrolledCourses.filter(
            (enrollment: { courseId: { toString: () => any; }; }) => enrollment.courseId.toString() !== courseId
        );

        await student.save();
        await student.populate('enrolledCourses.courseId', 'title duration price');

        res.status(200).json({
          message: 'Student unenrolled successfully',
          student
        });
      } catch (error) {
        console.error('DELETE enrollment error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
      res.status(405).json({ message: 'Method not allowed' });
  }
}