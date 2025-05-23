
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Clock, Star, Play } from 'lucide-react';
import { Course } from '@/types/elearning';

interface CourseCardProps {
  course: Course;
  onEnroll: (courseId: string) => void;
  onView: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, onView }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{course.title}</CardTitle>
          <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
            {course.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {course.enrolledStudents} students
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration}
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1" />
            {course.rating}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-odoo-primary">{course.price}</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onView(course)}>
              <Play className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button size="sm" onClick={() => onEnroll(course.id)} className="bg-odoo-primary hover:bg-odoo-primary/90 text-white">
              Enroll
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
