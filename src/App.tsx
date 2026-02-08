import { useState } from 'react';
import { TreeView } from './components/TreeView';
import { TreeNode } from './types/tree';
import { initialTreeData } from './data/mockData';
import './App.css';

function App() {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialTreeData);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Tree View Component</h1>
        <p className="app-subtitle">
          Fully functional tree with expand/collapse, add/remove, drag & drop, lazy loading, and inline editing
        </p>
      </header>

      <main className="app-main">
        <div className="tree-container">
          <div className="tree-header">
            <h2 className="tree-title">File Explorer</h2>
            <div className="tree-instructions">
              <span>Double-click to edit</span>
              <span>•</span>
              <span>Drag to reorder</span>
              <span>•</span>
              <span>Folder icon expands lazy children</span>
            </div>
          </div>
          <TreeView data={treeData} onUpdate={setTreeData} />
        </div>
      </main>
    </div>
  );
}

export default App;
