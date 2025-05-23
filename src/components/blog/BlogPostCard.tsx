
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogPostCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{post.title}</CardTitle>
          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
            {post.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {post.author}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {post.publishDate}
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {post.views} views
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(post.id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
