

import type { Homework, Test, StudyMaterial, Query, Assignment, Class } from './types';
import { HomeworkStatus } from './types';

export const TEACHER_NAME = "Kush";
export const STUDENT_NAME = "Aditya";
export const MEET_LINK = "https://meet.google.com/nyk-trur-rjk";
export const PHONE_NUMBER = "+919722334465";
export const WHATSAPP_LINK = `https://wa.me/${PHONE_NUMBER.replace('+', '')}`;

// January 22, 2026, 2:00 PM IST
// FIX: Changed `new date(...)` to `new Date(...)` to fix a typo and correctly instantiate a Date object.
export const EXAM_DATE_PAPER_3 = new Date("2026-01-22T14:00:00+05:30");

export const EXAM_DATES = [
    { date: new Date("2026-01-18T14:00:00+05:30"), name: "Paper-1: Accounting (2-5 PM)"},
    { date: new Date("2026-01-20T14:00:00+05:30"), name: "Paper-2: Business Laws (2-5 PM)"},
    { date: EXAM_DATE_PAPER_3, name: "Paper-3: Quantitative Aptitude (2-4 PM)"},
    { date: new Date("2026-01-24T14:00:00+05:30"), name: "Paper-4: Business Economics (2-4 PM)"},
];


export const INITIAL_HOMEWORKS: Homework[] = [
  {
    id: 'hw1',
    title: 'Chapter 1: Ratio and Proportion',
    description: 'Solve all exercise problems from the ICAI module.',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    fileUrl: '/homework/chapter1_problems.pdf',
    status: HomeworkStatus.Pending,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'hw2',
    title: 'Chapter 2: Indices and Logarithms',
    description: 'Complete the mock test paper provided.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    fileUrl: '/homework/chapter2_mocktest.pdf',
    status: HomeworkStatus.Pending,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const INITIAL_TESTS: Test[] = [
  {
    id: 'test1',
    title: 'Mock Test - I (Chapters 1-3)',
    scheduledTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    questionPaperUrl: '/tests/mock_test_1.pdf',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const INITIAL_MATERIALS: StudyMaterial[] = [
    { id: 'sm1', subject: 'Paper-3: Quantitative Aptitude', chapter: 'Chapter 1: Ratio and Proportion', title: 'ICAI Study Material', fileUrl: '/materials/paper3_ch1.pdf', createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
    { id: 'sm2', subject: 'Paper-3: Quantitative Aptitude', chapter: 'Chapter 2: Indices and Logarithms', title: 'ICAI Study Material', fileUrl: '/materials/paper3_ch2.pdf', createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
    { id: 'sm3', subject: 'Paper-3: Quantitative Aptitude', chapter: 'Chapter 3: Equations', title: 'Revision Notes', fileUrl: '/materials/paper3_ch3_notes.pdf', createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
];


export const INITIAL_QUERIES: Query[] = [
    { 
        id: 'q1', 
        studentName: 'Aditya', 
        queryText: 'I am stuck on question 5 from the chapter 1 homework. Can you explain the concept of compound ratio?', 
        createdAt: new Date().toISOString(),
        isResolved: false
    }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [];

export const INITIAL_CLASSES: Class[] = [];

export const FALLBACK_QUOTES = [
    "The secret to getting ahead is getting started. Keep pushing, Aditya!",
    "Believe you can and you're halfway there. You've got this!",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Don't watch the clock; do what it does. Keep going.",
    "The harder you work for something, the greater you'll feel when you achieve it."
];