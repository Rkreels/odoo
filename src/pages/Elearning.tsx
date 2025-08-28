
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import { GraduationCap, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CourseCard from '@/components/elearning/CourseCard';
import { Course } from '@/types/elearning';

const initialCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Business Management',
    description: 'Learn the fundamentals of business management including planning, organizing, and leading teams.',
    instructor: 'Dr. Sarah Johnson',
    duration: '4 weeks',
    price: '$99',
    status: 'published',
    category: 'Business',
    rating: 4.8,
    enrolledStudents: 156,
    lessons: 12,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    title: 'Digital Marketing Strategies',
    description: 'Master digital marketing techniques including SEO, social media, and content marketing.',
    instructor: 'Mike Wilson',
    duration: '6 weeks',
    price: '$149',
    status: 'published',
    category: 'Marketing',
    rating: 4.6,
    enrolledStudents: 89,
    lessons: 18,
    createdAt: '2024-01-05',
  },
  {
    id: '3',
    title: 'Project Management Fundamentals',
    description: 'Learn project management methodologies, tools, and best practices for successful project delivery.',
    instructor: 'Lisa Brown',
    duration: '5 weeks',
    price: '$129',
    status: 'draft',
    category: 'Management',
    rating: 4.9,
    enrolledStudents: 67,
    lessons: 15,
    createdAt: '2024-01-15',
  },
];

const Elearning = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleEnroll = (courseId: string) => {
    console.log('Enroll in course:', courseId);
    // Future: Implement enrollment logic
  };

  const handleViewCourse = (course: Course) => {
    console.log('View course:', course);
    // Future: Implement course preview
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(courses.map(course => course.category))];

  return (
    <OdooMainLayout currentApp="eLearning">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">eLearning Platform</h1>
                <p className="text-odoo-gray">Create and manage online courses</p>
              </div>
            </div>
            <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
                onView={handleViewCourse}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No courses found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </OdooMainLayout>
  );
};

export default Elearning;
