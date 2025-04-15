
import React from 'react';
import CodeEditor from '@/components/CodeEditor';
import { motion } from 'framer-motion';
import { Code2, Zap, Gem, Files, FileCode2, Settings, GitBranch } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <div className="vscode-titlebar flex items-center justify-between px-4 py-1.5 text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileCode2 size={14} />
            <span>Glow Code Assistant - VS Code</span>
          </div>
          <div className="hidden md:flex space-x-4">
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Go</span>
            <span>Run</span>
            <span>Terminal</span>
            <span>Help</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Settings size={14} />
          <GitBranch size={14} />
        </div>
      </div>
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-12 md:w-14 bg-vscode-sidebar border-r border-vscode-border flex flex-col items-center py-4 space-y-6"
        >
          <Files size={24} className="text-muted-foreground hover:text-foreground cursor-pointer" />
          <Code2 size={24} className="text-primary cursor-pointer" />
          <Zap size={24} className="text-muted-foreground hover:text-foreground cursor-pointer" />
        </motion.div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-vscode-border">
            <div className="vscode-tab active px-4 py-2 text-sm flex items-center space-x-2">
              <FileCode2 size={14} />
              <span>code-editor.tsx</span>
            </div>
          </div>
          
          {/* Editor area */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 p-4"
          >
            <div className="h-full rounded overflow-hidden shadow-lg border border-vscode-border">
              <CodeEditor initialCode="// Welcome to Glow Code Assistant
// Start typing to get AI-powered suggestions

function greeting(name) {
  return `Hello, ${name}!`;
}

// Try writing some code and use the AI tools on the right" />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Status bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-vscode-titlebar border-t border-vscode-border py-1 px-4 flex justify-between items-center text-xs text-muted-foreground"
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <GitBranch size={12} />
            <span>main</span>
          </div>
          <span>JavaScript</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Ln 1, Col 1</span>
          <span className="flex items-center">
            <Gem className="mr-1" size={12} />
            Powered by Groq
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
