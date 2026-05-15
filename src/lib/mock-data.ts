export const currentUser = {
  id: 'user-1',
  email: 'developer@example.com',
  name: 'Alex Developer',
  isPro: false,
};

export const itemTypes = [
  { id: 'type-snippet', name: 'Snippet', icon: '</>', color: '#3b82f6', isSystem: true },
  { id: 'type-prompt', name: 'Prompt', icon: '🤖', color: '#8b5cf6', isSystem: true },
  { id: 'type-note', name: 'Note', icon: '📝', color: '#10b981', isSystem: true },
  { id: 'type-command', name: 'Command', icon: '$_', color: '#f59e0b', isSystem: true },
  { id: 'type-file', name: 'File', icon: '📎', color: '#6b7280', isSystem: true },
  { id: 'type-image', name: 'Image', icon: '🖼️', color: '#ec4899', isSystem: true },
  { id: 'type-url', name: 'URL', icon: '🔗', color: '#06b6d4', isSystem: true },
];

export const collections = [
  { id: 'col-1', name: 'React Patterns', description: 'Reusable React patterns', isFavorite: true },
  { id: 'col-2', name: 'Context Files', description: 'Claude context files', isFavorite: false },
  { id: 'col-3', name: 'Python Utils', description: 'Python utility functions', isFavorite: true },
];

export const tags = [
  { id: 'tag-1', name: 'react' },
  { id: 'tag-2', name: 'hooks' },
  { id: 'tag-3', name: 'typescript' },
  { id: 'tag-4', name: 'api' },
  { id: 'tag-5', name: 'cli' },
];

export const items = [
  {
    id: 'item-1',
    title: 'useDebounce Hook',
    contentType: 'text',
    content: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
    description: 'Debounce hook for search inputs',
    isFavorite: true,
    isPinned: true,
    language: 'typescript',
    typeId: 'type-snippet',
    collectionId: 'col-1',
    tagIds: ['tag-1', 'tag-2', 'tag-3'],
    createdAt: '2026-05-10T10:00:00Z',
  },
  {
    id: 'item-2',
    title: 'Code Review Prompt',
    contentType: 'text',
    content: `You are an expert code reviewer. Review the following code for:
1. Performance issues
2. Security vulnerabilities
3. Code smells
4. Best practices adherence

Provide specific, actionable feedback.`,
    description: 'Standard prompt for code reviews',
    isFavorite: false,
    isPinned: false,
    language: 'text',
    typeId: 'type-prompt',
    collectionId: 'col-2',
    tagIds: ['tag-4'],
    createdAt: '2026-05-12T14:30:00Z',
  },
  {
    id: 'item-3',
    title: 'Fix EACCES Permission',
    contentType: 'text',
    content: 'sudo chown -R $(whoami) /usr/local/lib/node_modules',
    description: 'Fix npm permission errors on macOS',
    isFavorite: true,
    isPinned: false,
    language: 'bash',
    typeId: 'type-command',
    collectionId: null,
    tagIds: ['tag-5'],
    createdAt: '2026-05-14T09:15:00Z',
  },
  {
    id: 'item-4',
    title: 'API Response Pattern',
    contentType: 'text',
    content: `interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}`,
    description: 'Standard API response type',
    isFavorite: false,
    isPinned: true,
    language: 'typescript',
    typeId: 'type-snippet',
    collectionId: 'col-1',
    tagIds: ['tag-3', 'tag-4'],
    createdAt: '2026-05-14T16:45:00Z',
  },
  {
    id: 'item-5',
    title: 'Shadcn Setup Notes',
    contentType: 'text',
    content: `# Shadcn/ui Setup

1. Initialize: npx shadcn@latest init
2. Add components: npx shadcn@latest add button card input

Reference: https://ui.shadcn.com/`,
    description: 'Setup notes for shadcn components',
    isFavorite: false,
    isPinned: false,
    language: 'markdown',
    typeId: 'type-note',
    collectionId: 'col-2',
    tagIds: [],
    createdAt: '2026-05-15T08:00:00Z',
  },
  {
    id: 'item-6',
    title: 'Next.js Docs',
    contentType: 'text',
    content: 'https://nextjs.org/docs',
    description: 'Official Next.js documentation',
    isFavorite: false,
    isPinned: false,
    language: null,
    typeId: 'type-url',
    collectionId: null,
    tagIds: ['tag-1'],
    createdAt: '2026-05-15T11:20:00Z',
  },
];