// Helper to generate dates relative to today
const getDateOffset = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const DEFAULT_CATEGORIES = [
  { id: 'cat-work', name: 'Work', color: '#2d6a68', icon: 'Briefcase' },
  { id: 'cat-personal', name: 'Personal', color: '#ec4899', icon: 'User' },
  { id: 'cat-study', name: 'Study', color: '#8b5cf6', icon: 'BookOpen' },
  { id: 'cat-health', name: 'Health', color: '#10b981', icon: 'Activity' },
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Finalize Q3 Product Roadmap presentation',
    description: 'Review key metrics with engineering leads and align deliverables for next sprint.',
    priority: 'High',
    category: 'Work',
    dueDate: getDateOffset(0), // Today
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    completedAt: null,
  },
  {
    id: 'task-2',
    title: 'Renew annual health insurance policy',
    description: 'Verify coverage benefits, compare tier options, and upload documentation.',
    priority: 'High',
    category: 'Health',
    dueDate: getDateOffset(-2), // Overdue by 2 days!
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    completedAt: null,
  },
  {
    id: 'task-3',
    title: 'Complete System Design chapter 4 notes',
    description: 'Focus on distributed caching strategies (Redis vs Memcached) and consistency models.',
    priority: 'Medium',
    category: 'Study',
    dueDate: getDateOffset(1), // Tomorrow
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    completedAt: null,
  },
  {
    id: 'task-4',
    title: 'Grocery shopping & meal prep for the week',
    description: 'Fresh vegetables, high-protein pantry staples, fruits and oats.',
    priority: 'Low',
    category: 'Personal',
    dueDate: getDateOffset(3), // In 3 days
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    completedAt: null,
  },
  {
    id: 'task-5',
    title: 'Morning 5km endurance run & stretch',
    description: 'Warmup with dynamic stretches and maintain steady 5:30 min/km pace.',
    priority: 'Medium',
    category: 'Health',
    dueDate: getDateOffset(0),
    status: 'Completed',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'task-6',
    title: 'Audit application accessibility & keyboard navigation',
    description: 'Check ARIA labels, tab order, focus rings, and color contrast compliance.',
    priority: 'High',
    category: 'Work',
    dueDate: getDateOffset(-1),
    status: 'Completed',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];
