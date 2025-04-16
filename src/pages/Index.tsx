
import React from 'react';
import EnhancedCodeEditor from '@/components/EnhancedCodeEditor';
import { motion } from 'framer-motion';
import { Code2, Zap, GitBranch } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <Code2 size={24} className="text-primary" />
          <h1 className="text-xl font-bold">Programiz Code Assistant</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full rounded-lg overflow-hidden shadow-lg"
        >
          <EnhancedCodeEditor initialCode="// Welcome to Programiz Code Assistant
// Start typing to get AI-powered suggestions

function greeting(name) {
  return `Hello, ${name}!`;
}

// Try writing some code and use the AI tools on the right" />
        </motion.div>
      </div>
      
      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="border-t border-border py-3 px-6 flex justify-between items-center text-sm text-muted-foreground"
      >
        <div className="flex items-center space-x-4">
          <span>Programiz Code Assistant</span>
          <span>Version 1.0</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1">
            <GitBranch className="h-4 w-4" />
            Powered by Groq
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
