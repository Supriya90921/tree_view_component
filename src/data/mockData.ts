import { TreeNode } from '../types/tree';

export const initialTreeData: TreeNode[] = [
  {
    id: 'root-1',
    name: 'Documents',
    isExpanded: true,
    children: [
      {
        id: 'doc-1',
        name: 'Work',
        isExpanded: false,
        children: [
          { id: 'doc-1-1', name: 'Project A.docx' },
          { id: 'doc-1-2', name: 'Budget 2026.xlsx' },
          { id: 'doc-1-3', name: 'Presentation.pptx' },
        ],
      },
      {
        id: 'doc-2',
        name: 'Personal',
        isExpanded: false,
        children: [
          { id: 'doc-2-1', name: 'Resume.pdf' },
          { id: 'doc-2-2', name: 'Photos', hasLazyChildren: true },
        ],
      },
      { id: 'doc-3', name: 'Notes.txt' },
    ],
  },
  {
    id: 'root-2',
    name: 'Projects',
    isExpanded: true,
    children: [
      {
        id: 'proj-1',
        name: 'Web Development',
        isExpanded: false,
        children: [
          { id: 'proj-1-1', name: 'React App', hasLazyChildren: true },
          { id: 'proj-1-2', name: 'Vue Dashboard' },
        ],
      },
      {
        id: 'proj-2',
        name: 'Mobile Apps',
        hasLazyChildren: true,
      },
    ],
  },
  {
    id: 'root-3',
    name: 'Downloads',
    isExpanded: false,
    children: [
      { id: 'down-1', name: 'installer.exe' },
      { id: 'down-2', name: 'archive.zip' },
    ],
  },
  {
    id: 'root-4',
    name: 'Media',
    hasLazyChildren: true,
  },
];
