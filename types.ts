export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

export enum MobilityStatus {
  PREPARATION = 'PREPARATION',
  ONGOING = 'ONGOING',
  FINISHED = 'FINISHED',
  VALIDATED = 'VALIDATED'
}

export interface Mobility {
  id: string;
  userId: string;
  destination: string;
  countryCode: string; // e.g., 'ES', 'IE'
  startDate: string;
  endDate: string;
  type: 'STAGE' | 'ETUDE' | 'GROUPE';
  status: MobilityStatus;
  hostOrganization: string;
}

export enum ChecklistItemStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  VALIDATED = 'VALIDATED'
}

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  status: ChecklistItemStatus;
  deadline?: string;
  requiresUpload: boolean;
  uploadedFile?: string;
}

export interface JournalEntry {
  id: string;
  mobilityId: string;
  date: string;
  content: string;
  activities: string;
  skills: string;
  mood: number; // 1-5
  photos?: string[];
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  category: string;
  date: string;
  likes: number;
  replies: number;
}

export interface Evaluation {
  logistics: number;
  reception: number;
  skills: number;
  content: string;
  highlights: string;
}

export interface Testimonial {
  id: string;
  mobilityId: string;
  authorName: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
  generatedTitle?: string;
}