
export type ProjectStatus = 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';

export interface ServiceProject {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: number;
  description: string;
  teamMembers: string[];
  progress: number;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}
