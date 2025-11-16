import type { Dispatch, SetStateAction } from 'react';

export enum HomeworkStatus {
  Pending = 'Pending',
  Submitted = 'Submitted',
  Graded = 'Graded',
}

export enum AssignmentType {
  DO = 'Do Questions',
  READ = 'Read Material',
  WATCH_YT = 'Watch YouTube Video',
  WATCH_GD = 'Watch Video (Drive)',
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  deadline: string;
  fileUrl: string;
  submittedFile?: { name: string };
  status: HomeworkStatus;
  submittedAt?: string;
  createdAt: string;
}

export interface Test {
  id: string;
  title: string;
  scheduledTime: string;
  questionPaperUrl: string;
  createdAt: string;
}

export interface StudyMaterial {
  id: string;
  subject: string;
  chapter: string;
  title: string;
  fileUrl: string;
  createdAt: string;
}

export interface Query {
  id: string;
  studentName: string;
  queryText: string;
  image?: { name: string; data: string };
  solution?: string;
  createdAt: string;
  isResolved: boolean;
  resolvedAt?: string;
}

export interface Assignment {
  id: string;
  title: string;
  type: AssignmentType;
  description: string;
  link?: string;
  createdAt: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface Class {
  id: string;
  title: string;
  scheduledTime: string;
  meetLink: string;
  createdAt: string;
}

export interface CrossUserNotification {
  id: string;
  message: string;
  recipient: 'student' | 'teacher';
  createdAt: string;
  isRead: boolean;
}

export interface AppContextType {
  homeworks: Homework[];
  setHomeworks: Dispatch<SetStateAction<Homework[]>>;
  tests: Test[];
  setTests: Dispatch<SetStateAction<Test[]>>;
  materials: StudyMaterial[];
  setMaterials: Dispatch<SetStateAction<StudyMaterial[]>>;
  queries: Query[];
  setQueries: Dispatch<SetStateAction<Query[]>>;
  assignments: Assignment[];
  setAssignments: Dispatch<SetStateAction<Assignment[]>>;
  classes: Class[];
  setClasses: Dispatch<SetStateAction<Class[]>>;
  crossUserNotifications: CrossUserNotification[];
  setCrossUserNotifications: Dispatch<SetStateAction<CrossUserNotification[]>>;
  submitHomework: (homeworkId: string, file: File) => void;
  addHomework: (homework: Omit<Homework, 'id' | 'status' | 'submittedFile' | 'submittedAt' | 'createdAt'>) => void;
  addTest: (test: Omit<Test, 'id' | 'createdAt'>) => void;
  addMaterial: (material: Omit<StudyMaterial, 'id' | 'createdAt'>) => void;
  submitQuery: (query: Omit<Query, 'id' | 'solution' | 'createdAt' | 'isResolved' | 'resolvedAt'>) => void;
  resolveQuery: (queryId: string, solution: string) => void;
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'isCompleted' | 'completedAt'>) => void;
  completeAssignment: (assignmentId: string) => void;
  addClass: (klass: Omit<Class, 'id' | 'createdAt'>) => void;
  showNotification: (message: string, type?: 'success' | 'error') => void;
}